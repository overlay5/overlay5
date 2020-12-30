(function(){
  Vue.component('WebrtcWindowCapture', {
    props: [ 'id' ],
    data: () => ({
      windowCaptureStream: null,
    }),
    watch: {
      windowCaptureStream: function () { this.updateWindowCapture() }
    },
    methods: {
      integrateVideo: async function () {
        try {
          this.windowCaptureStream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: {
              resizeMode: 'crop-and-scale',
              frameRate: { ideal: 30.0 },
              width: { ideal: 3840 },
              height: { ideal: 2160 },
              cursor: 'motion',
            },
          })
        } catch (err) {
          console.error('Failed to capture the screen display or window.', { err })
        }
      },
      updateWindowCapture: function () {
        if (this.windowCaptureStream) {
          const captureVideo = document.getElementById(this.id + '-video')
          captureVideo.srcObject = this.windowCaptureStream
          captureVideo.addEventListener('play', () => {
            const pixiVideo = PIXI.Texture.from(captureVideo)
            const pixiVideoSprite = new PIXI.Sprite(pixiVideo)
            const app = new PIXI.Application({
              type: 'webgl',
              width: captureVideo.videoWidth,
              height: captureVideo.videoHeight,
              view: document.getElementById(this.id + '-canvas')
            })
            window.captureSprite = pixiVideoSprite
            app.stage.addChild(pixiVideoSprite)
            pixiVideoSprite.filters = []

            let colorMatrix = new PIXI.filters.ColorMatrixFilter()
            pixiVideoSprite.filters.push(colorMatrix)
          })
        }
      }
    },
    template: /*html*/`
      <div :id="this.id">
        <video :id="this.id + '-video'" autoplay />
        <canvas :id="this.id + '-canvas'" />
      </div>
    `,
    activated: function() {
      this.updateWindowCapture()
    },
    created: async function() {
      await this.integrateVideo()
    }
  })
})()
