(function(){
  const MODULE_NAME = 'twitch-irc'
  const TWITCH_IRC_CLEARCHAT = 'twitch-irc/clearchat'
  const TWITCH_IRC_CLEARMSG = 'twitch-irc/clearmsg'
  const TWITCH_IRC_PRIVMSG = 'twitch-irc/privmsg'
  const TWITCH_IRC_ROOMSTATE = 'twitch-irc/roomstate'
  const TWITCH_IRC_USERNOTICE = 'twitch-irc/usernotice'
  const TWITCH_IRC_USERSTATE = 'twitch-irc/userstate'
  const TWITCH_IRC_RAID_EVENT = 'twitch-irc/raid-event'
  const TWITCH_IRC_SET_BADGES = 'twitch-irc/badges-set'

  window.o5.store.registerModule(MODULE_NAME, {
    namespaced: true,
    state: {
      messages: [],
      raids: [],
    },
    getters: {
      messages: state =>
        (number = 10) =>
          state.messages.slice(state.messages.length - number, state.messages.length)
            .filter(message => !(message.hidden)),
    },
    mutations: {
      [TWITCH_IRC_CLEARCHAT]: (state, user) => state.twitchIRC = state.twitchIRC.map(msg => {
        if (msg.username === user) {
          msg.hidden = true
        }
      }),
      [TWITCH_IRC_CLEARMSG]: (state, messageID) => state.twitchIRC = state.twitchIRC.map(msg => {
        if (msg.tags.id === messageID) {
          msg.hidden = true
        }
      }),
      [TWITCH_IRC_PRIVMSG]: (state, payload) => state.twitchIRC.push(payload),
      [TWITCH_IRC_RAID_EVENT]: (state, payload) => state.twitchRaids.push(payload),
      [TWITCH_IRC_SET_BADGES]: (state, payload) => (state.twitchChatBadges = payload),
    },
    actions: {
      messagePush: ({ commit }, message) => commit(TWITCH_IRC_PRIVMSG, message),
      hideUser: ({ commit }, user) => commit(TWITCH_IRC_CLEARCHAT, user),
      hideMessage: ({ commit }, messageID) => commit(TWITCH_IRC_CLEARMSG, messageID),
      raid: ({ commit }, raidEvent) => commit(TWITCH_IRC_RAID_EVENT, raidEvent),
      badges: ({ commit }, badges) => commit(TWITCH_IRC_SET_BADGES, badges),
    }
  })

})()
