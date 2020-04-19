(function(){
  Vue.component('Overlay', {
    template: /*html*/`
      <v-content>
        <div class="overlay">
          <video id="overlay-capture"></video>
          <video id="overlay-webcam"></video>
          <div id="overlay-top"></div>
        </div>
      </v-content>
    `,
    mounted: async function () {
      const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true })
      const webcamEL = document.getElementById('overlay-webcam')
      webcamEL.srcObject = webcamStream
      webcamEL.play()
      const windowCaptureEL = document.getElementById('overlay-capture')
      const windowCaptureStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      windowCaptureEL.srcObject = windowCaptureStream
      windowCaptureEL.play()
    }
  })
})()
