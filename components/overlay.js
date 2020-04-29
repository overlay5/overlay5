(function(){
  Vue.component('Overlay', {
    template: /*html*/`
      <v-content>
        <NavMenu target="/config" icon="settings" />
        <div id="overlay">
          <Particles id="overlay-particles"/>
          <WebrtcWindowCapture id="overlay-capture"/>
          <TwitchChat id="overlay-chat" />
          <WebrtcWebcam id="overlay-webcam"/>
          <TwitchViewers id="overlay-viewers"/>
          <AudioCaptions id="overlay-captions"/>
        </div>
        <div id="overlay-top"></div>
      </v-content>
    `
  })
})()
