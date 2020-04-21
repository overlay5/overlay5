(function(){
  Vue.component('TwitchChatMessage', {
    props: ['message'],
    template: /*html*/`
      <v-list-item subheader>
        <v-list-item-content>
          <v-list-item-title>
            <img v-for="badge in badges" :src="badge" :key="badge"
            /><span v-if="badges.length > 0">&nbsp;</span><span :style="style">{{ message.username }}</span>
          </v-list-item-title>
          <v-list-item-content v-html="emotiMessage"/>
        </v-list-item-content>
      </v-list-item>`,
    computed: {
      ...Vuex.mapGetters(['twitchChatBadges']),
      emotiMessage: function () {
        const escapedMessage = document.createElement('span')
        if (!this.message.tags.emotes || this.message.tags.emotes.length <= 0) {
          escapedMessage.textContent = this.message.message
          return escapedMessage.innerHTML
        }

        let idx = 0
        for (let emote of this.message.tags.emotes.split('/')) {
          const [ id, range ] = emote.split(':')
          const [ start, finish ] = range.split('-').map(x => parseInt(x))
          const fragment = this.message.message.slice(idx, start)
          const img = document.createElement('img')
          img.src = `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`
          escapedMessage.appendChild(document.createTextNode(fragment))
          escapedMessage.appendChild(img)
          idx = finish + 1
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
            return this.message.tags.badges.split(' ')
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
      <v-list dense :height='height' :width='width'>
        <TwitchChatMessage v-for="message of twitchIrcMessages(15)" :message="message" :key="JSON.stringify(message)" />
      </v-list>
    `,
    computed: {
      ...Vuex.mapGetters(['twitchIrcMessages']),
    }
  })

})()
