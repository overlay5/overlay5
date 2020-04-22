(function(){
  store = window.vueStore

  if (typeof window.PUBSUB_HANDLERS === 'undefined') {
    window.PUBSUB_HANDLERS = []
  }

  window.PUBSUB_HANDLERS['video-playback-by-id'] = function (message) {
    if (message.type === 'viewcount') {
      store.dispatch('twitchViewersSet', message.viewers)
    }
  }

})()
