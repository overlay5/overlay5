(function(){
  Vue.component('Overlay', {
    computed: {
      ...Vuex.mapGetters(['mediaRecognition']),
    },
    template: /*html*/`
      <v-content>
        <NavMenu target="/config" icon="settings" />
        <div id="overlay">
          <!-- <Particles id="overlay-particles"/> -->
          <Background id="overlay-bg"/>
          <WebrtcWindowCapture id="overlay-capture"/>
          <TwitchChat id="overlay-chat" />
          <WebrtcWebcam id="overlay-webcam"/>
          <TwitchViewers id="overlay-viewers"/>
          <Time id="overlay-time"/>
          <AudioCaptions v-if="mediaRecognition" id="overlay-captions"/>
          <Spotify id="overlay-spotify"/>
        </div>
        <div id="overlay-top"></div>
      </v-content>
    `
  })
})()
