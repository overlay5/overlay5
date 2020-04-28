(function() {
  Vue.component('TwitchViewers', {
    template: /*html*/`
      <v-chip pill v-if="twitchViewers > 0">
        <v-avatar color="primary" left><v-icon dense small>fa-users</v-icon></v-avatar>
        {{ twitchViewers }} viewers
      </v-chip>
    `,
    computed: Vuex.mapState(['twitchViewers'])
  })
})()
