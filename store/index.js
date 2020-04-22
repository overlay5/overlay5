(function(){
  const TWITCH_IRC_MESSAGE_PUSH = 'twitch-irc/message-push'
  const TWITCH_CHAT_SET_BADGES = 'twitch-irc/set-badges'
  const MEDIA_AUDIO_SET = 'media/audio-set'
  const MEDIA_WEBCAM_SET = 'media/webcam-set'

  const state = {
    twitchIRC: [],
    twitchChatBadges: [],
    mediaAudio: null,
    mediaWebcam: null,
  }

  const getters = {
    twitchChatBadges: state =>
      state.twitchChatBadges,
    twitchIrcMessages: state =>
      (number = 10) =>
        state.twitchIRC.slice(state.twitchIRC.length - number, state.twitchIRC.length)
          .map(message => ({
              ...message,
              message: message.message.trim(),
              tags: Object.fromEntries(message.tags.split(';').map(t => t.split('=')))
            })
          ),
    mediaAudio: state => state.mediaAudio,
    mediaWebcam: state => state.mediaWebcam,
  }

  const mutations = {
    [TWITCH_IRC_MESSAGE_PUSH]: (state, payload) => state.twitchIRC.push(payload),
    [TWITCH_CHAT_SET_BADGES]: (state, payload) => (state.twitchChatBadges = payload),
    [MEDIA_AUDIO_SET]: (state, payload) => (state.mediaAudio = payload),
    [MEDIA_WEBCAM_SET]: (state, payload) => (state.mediaWebcam = payload),
  }

  const actions = {
    twitchIrcPush: ({ commit }, message) => commit(TWITCH_IRC_MESSAGE_PUSH, message),
    twitchChatBadges: ({ commit }, badges) => commit(TWITCH_CHAT_SET_BADGES, badges),
    mediaSetAudio: ({ commit }, deviceId) => commit(MEDIA_AUDIO_SET, deviceId),
    mediaSetWebcam: ({ commit }, deviceId) => commit(MEDIA_WEBCAM_SET, deviceId),
  }

  window.vueStore = new Vuex.Store({
    plugins: [ window.VuexLocalStorage ],
    state,
    getters,
    mutations,
    actions,
  })
})()
