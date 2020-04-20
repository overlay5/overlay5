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
          <video id="overlay-webcam" autoplay />
          <Oscilloscope width="640" height="300" />
          <div id="overlay-top"></div>
        </div>
      </v-content>
    `,
    activated: function() {
      this.updateWebcam()
      this.updateWindowCapture()
    },
    created: async function() {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true })
      this.windowCaptureStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      particlesJS.load('particles-js', 'particles.json')
    }
  })
})()
