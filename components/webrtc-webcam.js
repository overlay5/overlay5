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
          this.webcamVideoNode = webcamVideoNode
          if (webcamVideoNode) {
            webcamVideoNode.srcObject = this.webcamStream
            // webcamVideoNode.addEventListener('play', this.timerCallback, false)
            webcamVideoNode.addEventListener('play', () => {
              /* PIXI Video */
              let video = document.getElementById('camera')
              let app = new PIXI.Application({
                type: 'webgl',
                transparent: true,
                width: webcamVideoNode.videoWidth,
                height: webcamVideoNode.videoHeight,
                view: document.getElementById(this.id + '-canvas')
              })
              let pixiVideo = PIXI.Texture.from(webcamVideoNode)
              let pixiVideoSprite = new PIXI.Sprite(pixiVideo)
              app.stage.addChild(pixiVideoSprite)
              pixiVideoSprite.filters = []

              let chromaFilter = new PIXI.filters.ChromaFilter()
              pixiVideoSprite.filters.push(chromaFilter)

              let colorMatrix = new PIXI.filters.ColorMatrixFilter()
              pixiVideoSprite.filters.push(colorMatrix)

              // pixiVideoSprite.filters.push(new PIXI.filters.AlphaFilter())
              // pixiVideoSprite.filters.push(new PIXI.filters.FXAAFilter())

              // pixiVideoSprite.filters.push(new PIXI.filters.PixelateFilter())
              // pixiVideoSprite.filters.push(new PIXI.filters.AsciiFilter())

              // const gui = new dat.GUI()
              // gui.add(chromaFilter.uniforms, 'thresholdSensitivity', 0, 2, 0.001)
              // gui.add(chromaFilter.uniforms, 'smoothing', 0, 10, 0.05)
              // gui.addColor(chromaFilter.uniforms, 'colorToReplace')
            }, false)
          }
        }
      },
      timerCallback: async function () {
        /* compute things on each video frame */
        requestAnimationFrame(this.timerCallback)
        await this.computeFrame()
      },
      computeFrame: async function () {
        /* video = this.webcamVideoNode */
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
