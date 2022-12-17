/* eslint-disable no-multi-assign */
/* global PIXI dat */
(function(){
  Vue.component('WebrtcWebcam', {
    props: ['id'],
    data: () => ({
      videoStream: null,
      videoNode: null,
      datui: false,
      datgui: null,
      lastFrameTS: 0,
      frameDelay: 0.05,
      glitchFilter: null,
      noiseFilter: null,
      glowFilter: null,
      // pixelateFilter: null,
      pixiLoaded: false,
      // nextGlitchTS: new Date(Date.now() + 10000),
    }),
    watch: {
      datui: function () {
        if (this.datui) this.datUI()
      },
      videoStream: function () {
        this.updateVideo()
      },
      mediaWebcam: async function () {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
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
          this.videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
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
      updateVideo: function () {
        if (this.videoStream) {
          this.videoNode = document.getElementById(this.id)
          if (this.videoNode) {
            this.videoNode.srcObject = this.videoStream
            // this.videoNode.addEventListener('play', this.timerCallback, false)
            this.videoNode.addEventListener('play', this.pixiFilters, false)
          }
        }
      },
      // eslint-disable-next-line max-statements
      pixiFilters: function () {
        const app = new PIXI.Application({
          type: 'webgl',
          backgroundAlpha: 0,
          width: this.videoNode.videoWidth,
          height: this.videoNode.videoHeight,
          view: document.getElementById(this.id + '-canvas')
        })

        const pixiVideo = PIXI.Texture.from(this.videoNode)
        const pixiVideoSprite = new PIXI.Sprite(pixiVideo)
        pixiVideoSprite.zIndex = 10
        pixiVideoSprite.filters = []

        app.stage.addChild(pixiVideoSprite)

        this.chromaFilter = new PIXI.filters.ChromaFilter(0.1, 0.5, [48, 130, 72])
        this.chromaFilter.enabled = true
        pixiVideoSprite.filters.push(this.chromaFilter)

        // this.colorMatrix = new PIXI.filters.ColorMatrixFilter()
        // pixiVideoSprite.filters.push(this.colorMatrix)

        // this.glowFilter = new PIXI.filters.GlowFilter({
        //   innerStrength: 0.5,
        //   outerStrength: 5.0
        // })
        // pixiVideoSprite.filters.push(this.glowFilter)

        // this.pixelateFilter = new PIXI.filters.PixelateFilter()
        // pixiVideoSprite.filters.push(this.pixelateFilter)
        // this.pixelateFilter.enabled = false

        // this.noiseFilter = new PIXI.filters.NoiseFilter()
        // this.noiseFilter.enabled = false
        // pixiVideoSprite.filters.push(this.noiseFilter)

        // this.glitchFilter = new PIXI.filters.GlitchFilter()
        // this.glitchFilter.enabled = false
        // this.glitchFilter.slices = 3
        // this.glitchFilter.offset = 2
        // pixiVideoSprite.filters.push(this.glitchFilter)

        this.pixiLoaded = true
      },
      timerCallback: function () {
        const { currentTime } = this.videoNode
        if (currentTime >= this.lastFrameTS + this.frameDelay) {
          this.computeFrame()
          this.lastFrameTS = currentTime
        }
        requestAnimationFrame(this.timerCallback)
      },
      computeFrame: function () {
        const ts = new Date()
        // if (ts.getSeconds() > this.nextGlitchTS.getSeconds() + 3) this.nextGlitchTS = new Date(
        //   1000 * 60 * (1 + Math.random() + ts.getTime()
        // ))
        if (!this.pixiLoaded) return
        // if (ts.getTime() >= this.nextGlitchTS.getTime()) {
        //   this.glitchFilter.seed = this.noiseFilter.seed = Math.random()
        //   this.noiseFilter.enabled = this.glitchFilter.enabled = true
        //   if (ts.getTime() % 500 === 0) this.glitchFilter.refresh()
        //   // if (ts.getMinutes() % 4 === 0) this.pixelateFilter.enabled = true
        // } else this.noiseFilter.enabled = this.glitchFilter.enabled = this.pixelateFilter.enabled = false
      },
      datUI: function () {
        this.datgui = new dat.GUI()
        gui.add(this.chromaFilter.uniforms, 'thresholdSensitivity', 0, 2, 0.001)
        gui.add(this.chromaFilter.uniforms, 'smoothing', 0, 10, 0.05)
        gui.addColor(this.chromaFilter.uniforms, 'colorToReplace')
      }
    },
    template: /*html*/`
      <div :id="id + '-container'">
        <video :id="id" style="display:none" autoplay />
        <canvas :id="id + '-canvas'"/>
      </div>
    `,
    activated: function() {
      this.updateVideo()
    },
    computed: {
      ...Vuex.mapGetters(['mediaWebcam'])
    },
    created: async function() {
      return this.integrateVideo()
    }
  })
})()
