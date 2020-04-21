(function(){
  const TWITCH_IRC_MESSAGE_PUSH = 'twitch-irc/message-push'
  const TWITCH_CHAT_SET_BADGES = 'twitch-irc/set-badges'

  const state = {
    twitchIRC: [],
    twitchChatBadges: [],
  }

  // JSON.parse(localStorage['overlay5-store'])['twitchIRC'].map(x => x.tags).map(t => t.split(';')).map(kv => Object.fromEntries( kv.map(t => t.split('='))))

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
  }

  const mutations = {
    [TWITCH_IRC_MESSAGE_PUSH]: (state, payload) => state.twitchIRC.push(payload),
    [TWITCH_CHAT_SET_BADGES]: (state, payload) => (state.twitchChatBadges = payload),
  }

  const actions = {
    twitchIrcPush: ({ commit }, message) => commit(TWITCH_IRC_MESSAGE_PUSH, message),
    twitchChatBadges: ({ commit }, badges) => commit(TWITCH_CHAT_SET_BADGES, badges),
  }

  window.vueStore = new Vuex.Store({
    plugins: [ window.VuexLocalStorage ],
    state,
    getters,
    mutations,
    actions,
  })
})()
