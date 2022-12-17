/* eslint-disable no-multi-assign */
/* global PIXI */
(function(){
  Vue.component('WebrtcWindowCapture', {
    props: ['id'],
    data: () => ({
      videoStream: null,
      videoNode: null,
      lastFrameTS: 0,
      frameDelay: 0.05,
      datui: false,
      datgui: null,
      // glitchFilter: null,
      chromaFilter: null,
      // noiseFilter: null,
      // glowFilter: null,
      pixelateFilter: null,
      pixiLoaded: false,
      nextGlitchTS: new Date(Date.now() + 10000),
    }),
    watch: {
      videoStream: function () {
        this.updateVideo()
      }
    },
    methods: {
      integrateVideo: async function () {
        try {
          this.videoStream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: {
              resizeMode: 'crop-and-scale',
              frameRate: { ideal: 30.0 },
              width: { ideal: 3840 },
              height: { ideal: 2160 },
              // cursor: 'motion',
            }
          })
        } catch (err) {
          console.error('Failed to capture the screen display or window.', { err })
        }
      },
      updateVideo: function () {
        if (this.videoStream) {
          this.videoNode = document.getElementById(this.id)
          if (this.videoNode) {
            this.videoNode.srcObject = this.videoStream
            this.videoNode.addEventListener('play', this.timerCallback, false)
            this.videoNode.addEventListener('play', this.pixiFilters, false)
          }
        }
      },
      pixiFilters: function () {
        const app = new PIXI.Application({
          type: 'webgl',
          backgroundAlpha: 0,
          hello: true,
          width: this.videoNode.videoWidth,
          height: this.videoNode.videoHeight,
          view: document.getElementById(this.id + '-canvas')
        })

        PIXI.settings.PRECISION_FRAGMENT = "highp"

        const pixiVideo = PIXI.Texture.from(this.videoNode)
        const pixiVideoSprite = new PIXI.Sprite(pixiVideo)
        pixiVideoSprite.zIndex = 10
        pixiVideoSprite.filters = []

        app.stage.addChild(pixiVideoSprite)

        this.chromaFilter = new PIXI.filters.ChromaFilter()
        this.chromaFilter.uniforms.thresholdSensitivity = 0
        this.chromaFilter.uniforms.smoothing = 0.15
        this.chromaFilter.uniforms.colorToReplace = [1, 2, 3]
        this.chromaFilter.enabled = true
        pixiVideoSprite.filters.push(this.chromaFilter)

        // this.colorMatrix = new PIXI.filters.ColorMatrixFilter()
        // pixiVideoSprite.filters.push(this.colorMatrix)

        // this.glowFilter = new PIXI.filters.GlowFilter({
        //   innerStrength: 0.5,
        //   outerStrength: 5.0
        // })
        // pixiVideoSprite.filters.push(this.glowFilter)

        this.pixelateFilter = new PIXI.filters.PixelateFilter()
        pixiVideoSprite.filters.push(this.pixelateFilter)
        this.pixelateFilter.enabled = false

        // this.noiseFilter = new PIXI.filters.NoiseFilter()
        // this.noiseFilter.enabled = false
        // pixiVideoSprite.filters.push(this.noiseFilter)

        // this.glitchFilter = new PIXI.filters.GlitchFilter()
        // this.glitchFilter.enabled = false
        // this.glitchFilter.slices = 3
        // this.glitchFilter.offset = 2
        // pixiVideoSprite.filters.push(this.glitchFilter)

        this.pixiLoaded = true
        if (this.datui) {
          this.datgui = new dat.GUI()
          this.datgui.addColor(this.chromaFilter.uniforms, 'colorToReplace')
          this.datgui.add(this.chromaFilter.uniforms, 'thresholdSensitivity', 0, 2, 0.00001)
          this.datgui.add(this.chromaFilter.uniforms, 'smoothing', 0, 10, 0.0001)
        }
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
        // if (ts.getTime() >= this.nextGlitchTS.getTime() && ts.getSeconds() >= 1 && ts.getSeconds() <= 3 && ts.getMinutes() % 5 === 0) {
        //   this.glitchFilter.seed = this.noiseFilter.seed = Math.random()
        //   this.noiseFilter.enabled = this.glitchFilter.enabled = true
        // } else if (ts.getSeconds() >= 1 && ts.getSeconds() <= 3 && ts.getMinutes() % 15 === 0) {
        //   this.glitchFilter.seed = Math.random()
        //   this.glitchFilter.enabled = true
        //   if (ts.getMilliseconds() === 100) this.glitchFilter.refresh()
        // } else
        // this.noiseFilter.enabled = this.glitchFilter.enabled = false

        // if (ts.getTime() >= this.nextGlitchTS.getTime() && ts.getSeconds() >= 1 && ts.getSeconds() <= 3 && ts.getMinutes() % 5 === 0) {
        //   this.glitchFilter.seed = this.noiseFilter.seed = Math.random()
        // } else this.noiseFilter.enabled = false
      },
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
    created: async function() {
      return this.integrateVideo()
    }
  })
})()
