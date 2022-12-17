(function(){
  const MODULE_NAME = 'twitch'
  const TWITCH_OAUTH_SET = 'twitch/oauth-set'
  const TWITCH_OAUTH_CLEAR = 'twitch/oauth-clear'

  window.o5.store.registerModule(MODULE_NAME, {
    namespaced: true,
    state: {
      oauth: null,
    },
    getters: {
      oauth: state => state.oauth
    },
    mutations: {
      [TWITCH_OAUTH_SET]: (state, oauth) => state.oauth = oauth,
      [TWITCH_OAUTH_CLEAR]: (state) => state.oauth = null,
    },
    actions: {
      oauthSet: ({ commit }, oauth) => commit(TWITCH_OAUTH_SET, oauth),
      oauthClear: ({ commit }) => commit(TWITCH_OAUTH_CLEAR),
    }
  })

})()

