// {"type":"MESSAGE","data":{"topic":"stream-chat-room-v1.55558379","message":"{\"type\":\"host_target_change\",\"data\":{\"channel_id\":\"55558379\",\"channel_login\":\"kesor6\",\"target_channel_id\":null,\"target_channel_login\":null,\"previous_target_channel_id\":\"497711372\",\"num_viewers\":0}}"}}
// {"type":"MESSAGE","data":{"topic"\:"stream-chat-room-v1.55558379","message":"{\"type\":\"host_target_change_v2\",\"data\":{\"channel_id\":\"55558379\",\"channel_login\":\"kesor6\",\"target_channel_id\":null,\"target_channel_login\":null,\"previous_target_channel_id\":\"497711372\",\"num_viewers\":0}}"}}
// {"type":"MESSAGE","data":{"topic":"stream-chat-room-v1.71190292","message":"{\"type\":\"chat_rich_embed\",\"data\":{\"message_id\":\"a54742b3-43d9-439d-8272-31447c1e9bc4\",\"request_url\":\"https://clips.twitch.tv/TallApatheticChowderBuddhaBar\",\"author_name\":\"TerraBuck\",\"thumbnail_url\":\"https://clips-media-assets2.twitch.tv/AT-cm%7C453083443-preview-86x45.jpg\",\"title\":\"squadW\",\"twitch_metadata\":{\"clip_metadata\":{\"game\":\"Just Chatting\",\"channel_display_name\":\"Trainwreckstv\",\"slug\":\"TallApatheticChowderBuddhaBar\",\"id\":\"453083443\",\"broadcaster_id\":\"71190292\",\"curator_id\":\"91220856\"}}}}"}}
// {"type":"MESSAGE","data":{"topic":"stream-chat-room-v1.71190292","message":"{\"type\":\"host_target_change_v2\",\"data\":{\"channel_id\":\"503546237\",\"channel_login\":\"bitescounter\",\"target_channel_id\":null,\"target_channel_login\":null,\"previous_target_channel_id\":\"71190292\",\"num_viewers\":0}}"}}
// {"type":"MESSAGE","data":{"topic":"stream-chat-room-v1.71190292","message":"{\"type\":\"host_target_change_v2\",\"data\":{\"channel_id\":\"486730431\",\"channel_login\":\"gabenson9988\",\"target_channel_id\":\"71190292\",\"target_channel_login\":\"trainwreckstv\",\"previous_target_channel_id\":null,\"num_viewers\":0}}"}}
(function(){
  store = window.o5.store

  if (typeof window.PUBSUB_HANDLERS === 'undefined') {
    window.PUBSUB_HANDLERS = []
  }

  window.PUBSUB_HANDLERS['stream-chat-room-v1'] = function (message) {
    if (message.type === 'host_target_change_v2') {
    // example message
    // {
    //   "type": "MESSAGE",
    //   "data": {
    //     "topic": "stream-chat-room-v1.55558379",
    //     "message": "{\"type\":\"host_target_change_v2\",\"data\":{\"channel_id\":\"169711291\",\"channel_login\":\"joshdvir\",\"target_channel_id\":\"55558379\",\"target_channel_login\":\"kesor6\",\"previous_target_channel_id\":null,\"num_viewers\":0}}"
    //   }
    // }
    }
  }

})()


// const example_message = {
//   "type": "host_target_change",
//   "data": {
//     "channel_id": "55558379",
//     "channel_login": "kesor6",
//     "target_channel_id": null,
//     "target_channel_login": null,
//     "previous_target_channel_id": "497711372",
//     "num_viewers": 0
//   }
// }

// const example_message_v2 = {
//     "type": "host_target_change_v2",
//     "data": {
//       "channel_id": "55558379",
//       "channel_login": "kesor6",
//       "target_channel_id": null,
//       "target_channel_login": null,
//       "previous_target_channel_id": "497711372",
//       "num_viewers": 0
//     }
//   }
