(function(){
  Vue.component('WebrtcWindowCapture', {
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
            video: {
              width: { ideal: 3840 },
              height: { ideal: 2160 }
            }
          })
        } catch (err) {
          console.error('Failed to capture the screen display or window.', { err })
        }
      },
      updateWindowCapture: function () {
        if (this.windowCaptureStream) {
          document.getElementById(this.$attrs.id).srcObject = this.windowCaptureStream
        }
      }
    },
    template: /*html*/`
      <video autoplay />
    `,
    activated: function() {
      this.updateWindowCapture()
    },
    created: async function() {
      await this.integrateVideo()
    }
  })
})()
