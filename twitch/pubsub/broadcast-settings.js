(function(){
  store = window.o5.store

  if (typeof window.PUBSUB_HANDLERS === 'undefined') {
    window.PUBSUB_HANDLERS = []
  }

  window.PUBSUB_HANDLERS['broadcast-settings-update'] = function (message) {
    console.log('got a broadcast-settings-update event', message)
    // if (message.type === 'broadcast_settings_update') {
    //   console.log('got a broadcast-settings-update event', message)
    // }
  }

})()

// {"type":"MESSAGE","data":{"topic":"broadcast-settings-update.156037856","message":"{\"channel_id\":\"156037856\",\"type\":\"broadcast_settings_update\",\"channel\":\"fextralife\",\"old_status\":\"DROPS ON! 🔴\\nLIVE 🔴\\n!drops 100% chance of RNG! ALL NIGHT ALL DAY Beta with Cas!\",\"status\":null,\"old_game\":\"VALORANT\",\"game\":null,\"old_game_id\":516575,\"game_id\":null}"}}
// {"type":"MESSAGE","data":{"topic":"broadcast-settings-update.71190292","message":"{\"channel_id\":\"71190292\",\"type\":\"broadcast_settings_update\",\"channel\":\"trainwreckstv\",\"old_status\":\"recap + BAN APPEALS TODAY | !twitter | !podcast\",\"status\":null,\"old_game\":\"Just Chatting\",\"game\":null,\"old_game_id\":509658,\"game_id\":null}"}}

// const example_ws = {
//   "type": "MESSAGE",
//   "data": {
//     "topic": "broadcast-settings-update.55558379",
//     "message": "{\"channel_id\":\"55558379\",\"type\":\"broadcast_settings_update\",\"channel\":\"kesor6\",\"old_status\":\"🤯 #AMA DevOps as I write an AWS cloud dashboard using JavaScript+GraphQL+Vue.js+DGraph\",\"status\":\"🤯 #AMA DevOps as I write an AWS cloud dashboard using JavaScript+GraphQL+Vue.js+DGraph\",\"old_game\":\"Science \\u0026 Technology\",\"game\":\"Science \\u0026 Technology\",\"old_game_id\":509670,\"game_id\":509670}"
//   }
// }

// const example_message = {
//   "channel_id": "55558379",
//   "type": "broadcast_settings_update",
//   "channel": "kesor6",
//   "old_status": "🤯 #AMA DevOps as I write an AWS cloud dashboard using JavaScript+GraphQL+Vue.js+DGraph",
//   "status": "🤯 #AMA DevOps as I write an AWS cloud dashboard using JavaScript+GraphQL+Vue.js+DGraph",
//   "old_game": "Science \\u0026 Technology",
//   "game": "Science \\u0026 Technology",
//   "old_game_id": 509670,
//   "game_id": 509670
// }
