(function(){
  const TWITCH_IRC_MESSAGE_PUSH = 'twitch-irc/message-push'

  const state = {
    twitchIRC: []
  }

  const getters = {
    twitchIrcMessages: state =>
      (number = 10) =>
        state.twitchIRC.slice(state.twitchIRC.length - number, state.twitchIRC.length)
  }

  const mutations = {
    [TWITCH_IRC_MESSAGE_PUSH]: (state, payload) => state.twitchIRC.push(payload)
  }

  const actions = {
    twitchIrcPush: ({ commit }, message) => commit(TWITCH_IRC_MESSAGE_PUSH, message)
  }

  window.vueStore = new Vuex.Store({
    plugins: [ window.VuexLocalStorage ],
    state,
    getters,
    mutations,
    actions,
  })
})()
