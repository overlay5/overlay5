(function () {
  // https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
  function nonce(length) {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  if (typeof window.WEBHOOK_HANDLERS === 'undefined') {
    window.WEBHOOK_HANDLERS = {}
  }

  const TWITCH_SOCKETHOOK_HOSTNAME = 'o5-web-subsocket.herokuapp.com'
  const TWITCH_ACCESS_TOKEN = window.localStorage.getItem('twitch_access_token')
  const TWITCH_API_URI = 'https://api.twitch.tv/helix/webhooks/hub'

  const TWITCH_SOCKETHOOK_NS = localStorage.getItem('hooks/namespace') || `twitch-webhooks-${nonce(15)}`
  const TWITCH_WEBHOOK_SECRET = localStorage.getItem('hooks/secret') || `twhs-${nonce(32)}`
  localStorage.setItem('hooks/namespace', TWITCH_SOCKETHOOK_NS)
  localStorage.setItem('hooks/secret', TWITCH_WEBHOOK_SECRET)

  const TWITCH_WEBHOOK_SUBSCRIBE = {
    'hub.callback': `https://${TWITCH_SOCKETHOOK_HOSTNAME}/hook/${TWITCH_SOCKETHOOK_NS}`,
    'hub.mode': 'subscribe',
    'hub.lease_seconds': 864000,
    'hub.secret': TWITCH_WEBHOOK_SECRET,
    'hub.topic': '',
  }

  const TWITCH_HUB_TOPICS = [
    `https://api.twitch.tv/helix/users/follows?first=1&to_id=${CHANNEL_ID}`,
    // `https://api.twitch.tv/helix/streams?user_id=${CHANNEL_ID}`,
    // `https://api.twitch.tv/helix/users?id=${CHANNEL_ID}`,
    // `https://api.twitch.tv/helix/extensions/transactions?extension_id=<extension_id>&first=1`,
    // `https://api.twitch.tv/helix/moderation/moderators/events?broadcaster_id=${CHANNEL_ID}&first=1`,
    // `https://api.twitch.tv/helix/moderation/banned/events?broadcaster_id=${CHANNEL_ID}&first=1`,
    // `https://api.twitch.tv/helix/subscriptions/events?broadcaster_id=${CHANNEL_ID}&first=1`,
  ]

  const reconnectInterval = 5000 * 3 // ms to wait before reconnect
  const store = window.o5.store
  let ws

  async function twitchApiHelix(uri, options) {
    const response = await fetch(uri, {
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      ...options
    })
    console.log('Twitch Helix response: ', response)
  }

  function topicsSubscribe() {
    // "fire-and-forget" async functions
    TWITCH_HUB_TOPICS.forEach(async topic => {
      await twitchApiHelix(TWITCH_API_URI, {
        method: 'POST',
        body: JSON.stringify({ ...TWITCH_WEBHOOK_SUBSCRIBE,  'hub.topic': topic })
      })
    })
  }


  function connect() {
    const wsURI = `wss://${TWITCH_SOCKETHOOK_HOSTNAME}/socket/${TWITCH_SOCKETHOOK_NS}`
    let pingTimer = 0
    ws = new WebSocket(wsURI)
    window.webhookWS = ws
    let subscribed = false

    function heartbeat() {
      clearTimeout(pingTimer)
      pingTimer = setTimeout(() => {
        // the 'ping' ws frame is hidden by browser
        // and just changes the socket readyState
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close()
        } else {
          heartbeat()
        }
      }, 30000 + 1000)
    }

    ws.onopen = function (event) {
      heartbeat()
      if (!subscribed) {
        topicsSubscribe()
        subscribed = true
      }
    }

    ws.onerror = function () {
      console.error('WebHook WebSocket client error', arguments)
    }

    ws.onclose = function () {
      console.error('WebHook WebSocket closed its connection!', arguments)
      clearTimeout(pingTimer)
      setTimeout(connect, reconnectInterval)
    }

    ws.onmessage = function (message) {
      heartbeat()
      // TODO: test the `x-hub-signature` header for our secret
      // 'x-hub-signature': 'sha256=5d56b8306a65ccb16cf8bea36e5de8fe8d0335a8662bb5626eb6b00ddb4beffb'
      const event = JSON.parse(message)
      try {
        const apiURI = Object.fromEntries(
          event.headers.link.split(', ').map(x => x.split('; ').reverse())
        )['rel="self"'].replace(/[<>]/g,'').split('?')[0]
        const handler = apiURI.replace(/^https?:\/\/api.twitch.tv\/helix/, '').replace('/','-')
        window.WEBHOOK_HANDLERS[handler](event)
      } catch (err) {
        console.error('Failed to handle WebHook message', err, event)
      }
    }
  }

  if (TWITCH_ACCESS_TOKEN) {
    connect()
  } else {
    console.error('Access token is missing; Skipping Twitch WebSocket-WebHook handler.')
  }


})()
