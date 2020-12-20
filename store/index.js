(function(){
  const TWITCH_PUBSUB_EVENT = 'twitch-pubsub/event'

  const TWITCH_IRC_CLEARCHAT = 'twitch-irc/clearchat'
  const TWITCH_IRC_CLEARMSG = 'twitch-irc/clearmsg'
  const TWITCH_IRC_GLOBALUSERSTATE = 'twitch-irc/globaluserstate'
  const TWITCH_IRC_PRIVMSG = 'twitch-irc/privmsg'
  const TWITCH_IRC_ROOMSTATE = 'twitch-irc/roomstate'
  const TWITCH_IRC_USERNOTICE = 'twitch-irc/usernotice'
  const TWITCH_IRC_USERSTATE = 'twitch-irc/userstate'
  const TWITCH_IRC_RAID_EVENT = 'twitch-irc/raid-event'

  const TWITCH_CHAT_SET_BADGES = 'twitch-irc/badges-set'
  const MEDIA_AUDIO_SET = 'media/audio-set'
  const MEDIA_WEBCAM_SET = 'media/webcam-set'
  const MEDIA_RECOGNITION_SET = 'media/recognition-set'

  const TWITCH_VIEWERS = 'twitch/viewers-set'
  const TWITCH_FOLLOWER = 'twitch/follower-push'

  const state = {
    twitchFollowers: [],
    twitchViewers: 0,
    twitchEvents: [],
    twitchIRC: [],
    twitchRaids: [],
    twitchChatBadges: [],
    mediaAudio: null,
    mediaWebcam: null,
    mediaRecognition: true,
  }

  const getters = {
    twitchEvents: state =>
      (number = 10) =>
        state.twitchEvents.slice(state.twitchEvents.length - number, state.twitchEvents.length),
    twitchFollowers: state =>
      (number = 10) =>
        state.twitchEvents.slice(state.twitchFollowers.length - number, state.twitchFollowers.length),
    twitchChatBadges: state =>
      state.twitchChatBadges,
    twitchIrcMessages: state =>
      (number = 10) =>
        state.twitchIRC.slice(state.twitchIRC.length - number, state.twitchIRC.length)
          .filter(message => !(message.hidden === true || /^nightbot/i.test(message.username) || /^!\w+$/i.test(message.message))),
    mediaAudio: state => state.mediaAudio,
    mediaWebcam: state => state.mediaWebcam,
    mediaRecognition: state => state.mediaRecognition,
  }

  const mutations = {
    mutateTheChat: (state) => {
      state.twitchIRC = state.twitchIRC.filter(x => x)
    },
    [MEDIA_RECOGNITION_SET]: (state, payload) => state.mediaRecognition = payload,
    [TWITCH_VIEWERS]: (state, payload) => state.twitchViewers = payload,
    [TWITCH_FOLLOWER]: (state, payload) => state.twitchFollowers.push(payload),
    [TWITCH_PUBSUB_EVENT]: (state, payload) => {
      if (!state.twitchEvents) {
        return state.twitchEvents = [ payload ]
      }
      state.twitchEvents.push(payload)
    },
    [TWITCH_IRC_CLEARCHAT]: (state, user) => state.twitchIRC = state.twitchIRC.map(msg => {
      if (msg.username === user) {
        msg.hidden = true
      }
      return msg
    }),
    [TWITCH_IRC_CLEARMSG]: (state, messageID) => state.twitchIRC = state.twitchIRC.map(msg => {
      if (msg.tags.id === messageID) {
        msg.hidden = true
      }
      return msg
    }),
    [TWITCH_IRC_PRIVMSG]: (state, payload) => state.twitchIRC.push(payload),
    [TWITCH_IRC_RAID_EVENT]: (state, payload) => state.twitchRaids.push(payload),
    [TWITCH_CHAT_SET_BADGES]: (state, payload) => (state.twitchChatBadges = payload),
    [MEDIA_AUDIO_SET]: (state, payload) => (state.mediaAudio = payload),
    [MEDIA_WEBCAM_SET]: (state, payload) => (state.mediaWebcam = payload),
  }

  const actions = {
    twitchViewersSet: ({ commit }, viewers) => commit(TWITCH_VIEWERS, viewers),
    twitchEventsPush: ({ commit }, event) => commit(TWITCH_PUBSUB_EVENT, event),
    twitchFollowerPush: ({ commit }, event) => commit(TWITCH_FOLLOWER, event),
    twitchIrcPush: ({ commit }, message) => commit(TWITCH_IRC_PRIVMSG, message),
    twitchIrcHideUser: ({ commit }, user) => commit(TWITCH_IRC_CLEARCHAT, user),
    twitchIrcHideMessage: ({ commit }, messageID) => commit(TWITCH_IRC_CLEARMSG, messageID),
    twitchIrcRaid: ({ commit }, raidEvent) => commit(TWITCH_IRC_RAID_EVENT, raidEvent),
    twitchChatBadges: ({ commit }, badges) => commit(TWITCH_CHAT_SET_BADGES, badges),
    mediaSetAudio: ({ commit }, deviceId) => commit(MEDIA_AUDIO_SET, deviceId),
    mediaSetWebcam: ({ commit }, deviceId) => commit(MEDIA_WEBCAM_SET, deviceId),
    mediaToggleRecognition: ({ commit, state }) => commit(MEDIA_RECOGNITION_SET, !state.mediaRecognition),
  }

  window.o5 = window.o5 || {}
  window.o5.store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
  })
})()
