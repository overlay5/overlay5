(function(){
  Vue.component('TwitchChatMessage', {
    props: ['message'],
    template: /*html*/`
      <v-list-item twoline subheader>
        <v-list-item-content>
          <v-list-item-title :style="style"
            ><img v-for="badge in badges" :src="badge" :key="badge"
            /><span v-if="badges.length > 0">&nbsp;</span>{{ message.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ message.message }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>`,
    computed: {
      ...Vuex.mapGetters(['twitchChatBadges']),
      style: function () {
        if (this.message.tags && this.message.tags.color) {
          const style = []
          style.push(`color:${this.message.tags.color}`)
          if (this.$vuetify.theme.dark) {
            style.push('filter:brightness(300%)')
          }
          return style.join(';')
        }
        return ''
      },
      badges: function () {
        if (this.message.tags && this.message.tags.badges) {
          try {
            return this.message.tags.badges.split(' ')
              .map(badge =>
                this.twitchChatBadges[badge.split('/')[0]].svg)
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
