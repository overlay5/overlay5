(function(){
  store = window.o5.store

  if (typeof window.WEBHOOK_HANDLERS === 'undefined') {
    window.WEBHOOK_HANDLERS = {}
  }

  window.WEBHOOK_HANDLERS['user-follows'] = function (message) {
    store.dispatch('twitchFollowerPush', event.data[0])
  }

  //  "data":
  //     [{
  //        "from_id":"1336",
  //        "from_name":"ebi",
  //        "to_id":"1337",
  //        "to_name":"oliver0823nagy",
  //        "followed_at": "2017-08-22T22:55:24Z"
  //     }]

})()
