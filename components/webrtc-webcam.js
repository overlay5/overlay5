(function(){
  Vue.component('WebrtcWebcam', {
    props: [ 'id' ],
    data: () => ({
      webcamStream: null,
    }),
    watch: {
      webcamStream: function () {
        this.updateWebcam()
      },
      mediaWebcam: async function () {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: this.mediaWebcam },
            width: { ideal: 1920 },
            height: { ideal: 1020 }
          }
        })
      }
    },
    methods: {
      integrateVideo: async function () {
        try {
          this.webcamStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: this.mediaWebcam ? { exact: this.mediaWebcam } : undefined,
              width: { ideal: 1920 },
              height: { ideal: 1020 }
            }
          })
        } catch (err) {
          console.error('Failed to capture the web camera.', { err })
        }
      },
      updateWebcam: function () {
        if (this.webcamStream) {
          const webcamVideoNode = document.getElementById(this.id)
          if (webcamVideoNode) {
            webcamVideoNode.srcObject = this.webcamStream
            webcamVideoNode.addEventListener('play', () => {
              this.timerCallback()
            }, false)
          }
        }
      },
      timerCallback: function () {
        this.computeFrame()
        setTimeout(() => this.timerCallback(), 3)
      },
      computeFrame: function () {
        let canvasZ = document.getElementById(this.id + '-canvas-z')
        let context = canvasZ.getContext('2d')
        let video = document.getElementById(this.id)
        canvasZ.width = video.videoWidth
        canvasZ.height = video.videoHeight
        context.drawImage(video, 0, 0, video.videoWidth/4, video.videoHeight/4)
        let frame = context.getImageData(0, 0, video.videoWidth, video.videoHeight)
        let l = frame.data.length / 4
        function rgb2hsv(r,g,b) {
          let v = Math.max(r,g,b), c = v - Math.min(r,g,b)
          let h = c && ((v == r) ? (g-b)/c : ((b==g) ? 2 + (b-r)/c : 4 +(r-g)/c))
          return [ 60*(h<0 ? h+6 : h), v && c/v, v]
        }
        for (let i = 0; i < l; i++) {
          let hsv = rgb2hsv(frame.data[i*4+0],frame.data[i*4+1],frame.data[i*4+2])
          if (hsv[0] == 180 && hsv[2] > 60 && hsv[2] < 260) {
            frame.data[i*4+3] = 0
          }
        }
        canvas = document.getElementById(this.id + '-canvas')
        // canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').putImageData(frame, 0, 0)
        return
      }
    },
    template: /*html*/`
      <v-sheet color="transparent" :id="id + '-container'" elevation="0">
        <video style="display:none" :id="id" autoplay />
        <canvas style="display:none" :id="id + '-canvas-z'"/>
        <canvas :id="id + '-canvas'"/>
      </v-sheet>
    `,
    activated: function() {
      this.updateWebcam()
    },
    computed: {
      ...Vuex.mapGetters(['mediaWebcam'])
    },
    created: async function() {
      await this.integrateVideo()
    }
  })
})()
