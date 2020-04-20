(function(){
  Vue.component('Overlay', {
    data: () => ({
      webcamStream: null,
      windowCaptureStream: null,
    }),
    watch: {
      webcamStream: function () { this.updateWebcam() },
      windowCaptureStream: function () { this.updateWindowCapture() },
    },
    methods: {
      updateWebcam: function () {
        if (this.webcamStream) {
          document.getElementById('overlay-webcam').srcObject = this.webcamStream
        }
      },
      updateWindowCapture: function () {
        if (this.windowCaptureStream) {
          document.getElementById('overlay-capture').srcObject = this.windowCaptureStream
        }
      }
    },
    template: /*html*/`
      <v-content>
        <NavMenu target="/config" icon="settings" />
        <div class="overlay">
          <div id="particles-js"></div>
          <video id="overlay-capture" autoplay />
          <TwitchChat id="overlay-chat" />
          <video id="overlay-webcam" autoplay />
          <Oscilloscope id="overlay-scope" />
          <div id="overlay-top"></div>
        </div>
      </v-content>
    `,
    activated: function() {
      this.updateWebcam()
      this.updateWindowCapture()
    },
    created: async function() {
      const constraint = {
        video: {
          width: { ideal: 3840 },
          height: { ideal: 2160 }
        }
      }
      this.webcamStream = await navigator.mediaDevices.getUserMedia(constraint)
      this.windowCaptureStream = await navigator.mediaDevices.getDisplayMedia(constraint)
      particlesJS.load('particles-js', 'particles.json')
    }
  })
})()
