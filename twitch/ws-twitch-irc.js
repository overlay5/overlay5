(function () {
  const TWITCH_IRC_URI = 'wss://irc-ws.chat.twitch.tv'
  const TWITCH_IRC_PROTO = 'irc'
  const CLIENT_USERNAME = 'kesor6'

  const reconnectInterval = 5000 * 3 // ms to wait before reconnect
  const store = window.vueStore
  let ws

  function authenticate() {
    const token = window.localStorage.getItem('access_token')
    ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership')
    ws.send(`PASS oauth:${token}`)
    ws.send(`NICK ${CLIENT_USERNAME}`)
    ws.send(`JOIN #${CLIENT_USERNAME}`)
  }

  function parseIrcMessage(data) {
    let parsed = {
      message: null,
      tags: null,
      command: null,
      channel: null,
      username: null,
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
      parsed.username = data.slice(tagIdx + 2, data.indexOf('!'))
      parsed.command = data.slice(userIdx + 1, commandIdx)
      parsed.channel = data.slice(commandIdx + 1, channelIdx)
      parsed.message = data.slice(messageIdx + 1)
    }
    return parsed
  }

  function connect() {
    ws = new WebSocket(TWITCH_IRC_URI, TWITCH_IRC_PROTO)

    ws.onopen = function (event) {
      authenticate()
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
      } else if (parsed.message && parsed.username && parsed.channel === `#${CLIENT_USERNAME}`) {
        store.dispatch('twitchIrcPush', parsed)
        console.log(parsed)
      }
    }
  }

  connect()

})()
