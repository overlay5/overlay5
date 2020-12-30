(function(){
  Vue.component('WebrtcWebcam', {
    props: ['id'],
    data: () => ({
      webcamStream: null,
      lastFrameTS: 0,
      frameDelay: 0.05, // seconds
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
          this.webcamVideoNode = webcamVideoNode
          if (webcamVideoNode) {
            webcamVideoNode.srcObject = this.webcamStream
            // webcamVideoNode.addEventListener('play', this.timerCallback, false)
            webcamVideoNode.addEventListener('play', async () => {

              /* pIXI Video */
              const app = new PIXI.Application({
                type: 'webgl',
                transparent: true,
                width: webcamVideoNode.videoWidth,
                height: webcamVideoNode.videoHeight,
                view: document.getElementById(this.id + '-canvas')
              })

              window.webcamApp = app
              const pixiVideo = PIXI.Texture.from(webcamVideoNode)

              const pixiVideoSprite = new PIXI.Sprite(pixiVideo)
              pixiVideoSprite.zIndex = 10
              pixiVideoSprite.filters = []

              window.webcamSprite = pixiVideoSprite
              app.stage.addChild(pixiVideoSprite)

              const chromaFilter = new PIXI.filters.ChromaFilter()
              pixiVideoSprite.filters.push(chromaFilter)

              const colorMatrix = new PIXI.filters.ColorMatrixFilter()
              pixiVideoSprite.filters.push(colorMatrix)



              // let noiseFilter = new PIXI.filters.NoiseFilter()
              // app.ticker.add(() => {
              //   noiseFilter.seed = Math.random()
              // })
              // pixiVideoSprite.filters.push(noiseFilter)
            }, false)
          }
        }
      },

      timerCallback: function () {
        const { currentTime } = this.webcamVideoNode
        if (currentTime >= this.lastFrameTS + this.frameDelay) {
          this.computeFrame()
          this.lastFrameTS = currentTime
        }
        requestAnimationFrame(this.timerCallback)
      },
      computeFrame: function () {
        return
      }
    },
    template: /*html*/`
      <v-sheet color="transparent" :id="id + '-container'" elevation="0">
        <video style="display:none" :id="id" autoplay />
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
