(function () {
  let TWITCH_ACCESS_TOKEN = window.localStorage.getItem('twitch_access_token')
  const store = window.o5.store

  if (typeof window.PUBSUB_HANDLERS === 'undefined') {
    window.PUBSUB_HANDLERS = []
  }

  const TWITCH_WS_URI = 'wss://pubsub-edge.twitch.tv'
  const TWITCH_PUBSUB_TOPICS = [ // official topics -- https://dev.twitch.tv/docs/pubsub
    'broadcast-settings-update',
    'celebration-events-v1',
    'channel-bits-badge-unlocks',
    'channel-points-channel-v1',
    'channel-bits-events-v2',
    // 'channel-bounty-board-events.cta',
    'channel-cheer-events-public-v1',
    'channel-drop-events',
    'channel-squad-updates',
    'channel-sub-gifts-v1',
    'channel-subscribe-events-v1',
    // 'chat_moderator_actions',
    'community-points-channel-v1',
    // 'extension-control',
    'hype-train-events-v1',
    // 'leaderboard-events-v1.bits-usage-by-channel-v1-53907383-MONTH',
    // 'whispers',
    // 'leaderboard-events-v1.sub-gifts-sent-53907383-MONTH',
    'polls',
    'pv-watch-party-events',
    'raid',
    'stream-change-by-channel',
    'stream-chat-room-v1',
    'video-playback-by-id',
  ].map(t => `${t}.${CHANNEL_ID}`)

  const heartbeatInterval = 5000 * 60 // ms between PING's
  const reconnectInterval = 5000 * 3 // ms to wait before reconnect
  let heartbeatHandle, ws

  // https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
  function nonce(length) {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  function listen(topics) {
    const message = {
      type: 'LISTEN',
      nonce: nonce(15),
      data: { topics, auth_token: TWITCH_ACCESS_TOKEN, }
    }
    ws.send(JSON.stringify(message))
  }

  function heartbeat() {
    message = { type: 'PING' }
    ws.send(JSON.stringify(message))
  }

  function connect() {
    ws = new WebSocket(TWITCH_WS_URI)

    ws.onopen = function (event) {
      heartbeat()
      heartbeatHandle = setInterval(heartbeat, heartbeatInterval)
      listen(TWITCH_PUBSUB_TOPICS)
    }

    ws.onerror = function (error) {
      console.error(JSON.stringify(error))
    }

    ws.onclose = function () {
      clearInterval(heartbeatHandle)
      setTimeout(connect, reconnectInterval)
    }

    ws.onmessage = function (wsEvent) {
      pubsubEvent = JSON.parse(wsEvent.data)
      if (pubsubEvent.type == 'RECONNECT') {
        setTimeout(connect, reconnectInterval)
        return
      }
      if (pubsubEvent.type === 'MESSAGE') {
        const [ topic, channel_id ] = pubsubEvent.data.topic.split('.')
        try {
          PUBSUB_HANDLERS[topic](JSON.parse(pubsubEvent.data.message))
        } catch (err) {
          console.error(`Handling the PubSub message didn't work!`, { err, pubsubEvent })
        }
      }
      store.dispatch('twitchEventsPush', pubsubEvent)
    }
  }

  if (TWITCH_ACCESS_TOKEN) {
    connect()
  } else {
    console.error('Access token is missing; Skipping Twitch WebSocket-PubSub handler.')
  }

})()
