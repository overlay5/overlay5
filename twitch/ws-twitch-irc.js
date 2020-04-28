(function () {
  const TWITCH_ACCESS_TOKEN = window.localStorage.getItem('access_token')
  const TWITCH_IRC_URI = 'wss://irc-ws.chat.twitch.tv'
  const TWITCH_IRC_PROTO = 'irc'
  const CLIENT_USERNAME = 'kesor6'

  const reconnectInterval = 5000 * 3 // ms to wait before reconnect
  const store = window.vueStore
  let ws

  const IRC_USERNOTICE_HANDLERS = {
    sub: (event) => {
    },
    resub: (event) => {
    },
    subgift: (event) => {
    },
    anonsubgift: (event) => {
    },
    submysterygift: (event) => {
    },
    giftpaidupgrade: (event) => {
    },
    rewardgift: (event) => {
    },
    anongiftpaidupgrade: (event) => {
    },
    raid: async (event) => {
      const login = event.tags['msg-param-login'] // -- The name of the source user raiding this channel.
      const displayName = event.tags['msg-param-displayName'] // -- The display name of the source user raiding this channel.
      const viewerCount = event.tags['msg-param-viewerCount'] // -- The number of viewers watching the source channel raiding this channel.
      // 1. Get the other user's avatar by using:
      const res = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
        headers: {
          'Client-ID': CLIENT_ID,
          'Authorization': `OAuth ${access_token}`
        }
      })
      const raiderInformation = (await res.json()).data[0]
      const avatar = raiderInformation.profile_image_url
      store.dispatch('twitchIrcRaid', {
        raw: event,
        login,
        displayName,
        viewerCount,
        avatar,
        raiderInformation,
      })
    },
    unraid: (event) => {
    },
    ritual: (event) => {
    },
    bitsbadgetier: (event) => {
    },
  }

  const IRC_COMMAND_HANDLERS = {
    CLEARCHAT: (event) => {
      const user = event.message
      store.dispatch('twitchIrcHideUser', user)
    },
    CLEARMSG: (event) => {
      const messageId = event.tags['target-msg-id']
      store.dispatch('twitchIrcHideMessage', messageId)
    },
    GLOBALUSERSTATE: (event) => {
      // do nothing
    },
    PRIVMSG: (event) => {
      store.dispatch('twitchIrcPush', event)
    },
    ROOMSTATE: (event) => {
    },
    NOTICE: (event) => {
    },
    USERNOTICE: (event) => {
      const noticeType = event.tags['msg-id']
      return IRC_USERNOTICE_HANDLERS[noticeType](event)
    },
    USERSTATE: (event) => {
    },
  }

  function authenticate() {
    ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership')
    ws.send(`PASS oauth:${TWITCH_ACCESS_TOKEN}`)
    ws.send(`NICK ${CLIENT_USERNAME}`)
    ws.send(`JOIN #${CLIENT_USERNAME}`)
  }

  async function fetchBadges() {
    const globalBadges = await fetch(`https://badges.twitch.tv/v1/badges/global/display?language=en`)
    const badges = (await globalBadges.json())['badge_sets']
    const actualBadges = Object.fromEntries(
      Object.entries(badges)
        .map( ([k,v]) =>
          Object.keys(v.versions).map(ver =>
            [`${k}/${ver}`, v.versions[ver]['image_url_4x']]).flat()
        ))
    store.dispatch('twitchChatBadges', actualBadges)
  }

  function parseIrcMessage(data) {
    let parsed = {
      message: null,
      tags: null,
      command: null,
      channel: null,
      username: null,
      raw: data,
    }
    if (data.startsWith('PING')) {
      parsed.command = 'PING'
      parsed.message = data.split(':')[1]
    } else if (data[0] === '@') {
      const tagIdx = data.indexOf(' '),
            userIdx = data.indexOf(' ', tagIdx + 1),
            commandIdx = data.indexOf(' ', userIdx + 1),
            channelIdx = data.indexOf(' ', commandIdx + 1),
            messageIdx = data.indexOf(':', channelIdx + 1)
      parsed.tags = data.slice(0, tagIdx)
      if (typeof parsed.tags === 'string') {
        parsed.tags = Object.fromEntries(parsed.tags.split(';').map(t => t.split('=')))
      }
      parsed.username = data.slice(tagIdx + 2, data.indexOf('!'))
      parsed.command = data.slice(userIdx + 1, commandIdx)
      parsed.channel = data.slice(commandIdx + 1, channelIdx)
      parsed.message = data.slice(messageIdx + 1).trim()
    }
    return parsed
  }

  function connect() {
    ws = new WebSocket(TWITCH_IRC_URI, TWITCH_IRC_PROTO)

    ws.onopen = function (event) {
      authenticate()
      fetchBadges()
        .then(() => console.log(`Successfully fetched badges for channel.`))
        .catch((err) => console.error(`Failed to fetch badges.`, err))
    }

    ws.onerror = function (error) {
      console.error(error)
    }

    ws.onclose = function () {
      // clearInterval(heartbeatHandle)
      setTimeout(connect, reconnectInterval)
    }

    ws.onmessage = function (event) {
      parsed = parseIrcMessage(event.data)
      if (parsed.command === 'PING') {
        ws.send(`PONG :${parsed.message}`)
      } else if (parsed.message && parsed.channel === `#${CLIENT_USERNAME}`) {
        IRC_COMMAND_HANDLERS[parsed.command](parsed)
      }
    }
  }

  if (TWITCH_ACCESS_TOKEN) {
    connect()
  }

})()
