(function(){
  Vue.component('TwitchChat', {
    props: ['height','width'],
    template: /*html*/`
      <v-list dense :height='height' :width='width'>
        <v-list-item :key="JSON.stringify(message)" v-for="message of twitchIrcMessages(15)">{{ message.username }}: {{ message.message }}</v-list-item>
      </v-list>
    `,
    computed: {
      ...Vuex.mapGetters(['twitchIrcMessages'])
    }
  })
})()
