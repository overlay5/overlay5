(function(){
  Vue.component('TwitchChatMessage', {
    props: ['message'],
    template: /*html*/`
      <v-sheet class="my-1 py-1 px-2" elevation="3">
        <span class="d-inline-block subtitle-2">
          <span v-for="badge in badges" :key="badge"><img :src="badge"/>&nbsp;</span>
          <span :style="style">{{ message.tags['display-name'] }}</span>
        </span>
        <span class="d-inline-block body-2" v-html="emotiMessage" />
      </v-sheet>
    `,
    computed: {
      ...Vuex.mapGetters(['twitchChatBadges']),
      emotiMessage: function () {
        const escapedMessage = document.createElement('span')
        if (!this.message.tags.emotes || this.message.tags.emotes.length <= 0) {
          escapedMessage.textContent = this.message.message
          return escapedMessage.innerHTML
        }

        const sortedEmotes = this.message.tags.emotes.split('/').map(emote => {
          const [ id, range ] = emote.split(':')
          const [ start, finish ] = range.split('-').map(n => parseInt(n))
          return { id, start, finish }
        }).sort((a,b) => a.start - b.start)

        let idx = 0
        for (let emote of sortedEmotes) {
          const fragment = this.message.message.slice(idx, emote.start)
          const img = document.createElement('img')
          img.src = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`
          img.alt = img.title = this.message.message.slice(emote.start, emote.finish + 1)
          img.classList.add('emote')
          if (this.message.tags['emote-only'] === 1) {
            img.classList.add('big')
          }
          escapedMessage.appendChild(document.createTextNode(fragment))
          escapedMessage.appendChild(img)
          idx = emote.finish + 1
        }

        if (idx < this.message.message.length) {
          fragment = this.message.message.slice(idx, this.message.message.length)
          escapedMessage.appendChild(document.createTextNode(fragment))
        }

        return escapedMessage.innerHTML
      },
      style: function () {
        if (this.message.tags && this.message.tags.color) {
          const style = []
          style.push(`color:${this.message.tags.color}`)
          if (this.$vuetify.theme.dark) {
            style.push('filter:brightness(200%)')
          }
          return style.join(';')
        }
        return ''
      },
      badges: function () {
        if (this.message.tags && this.message.tags.badges) {
          try {
            return this.message.tags.badges.split(',')
              .map(badge => this.twitchChatBadges[badge])
          } catch (err) {
            // maybe chat badges did not load yet, or had an error loading
          }
        }
        return []
      },
    },

  })

  Vue.component('TwitchChat', {
    props: ['height','width'],
    template: /*html*/`
      <div><component v-for="comp of chatComponents()" v-bind="comp" :key="comp.key" /></div>
    `,
    methods: {
      chatComponents: function () {
        const message = this.twitchIrcMessages(15)
        const components = message.map(message => ({
          message,
          is: 'TwitchChatMessage',
          key: message.tags.id,
        }))
        return components.sort((a,b) => a.message.tags['tmi-sent-ts'] > b.message.tags['tmi-sent-ts'])
      }
    },
    computed: {
      ...Vuex.mapGetters(['twitchIrcMessages']),
    }
  })

})()
