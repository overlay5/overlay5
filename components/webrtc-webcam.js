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
          document.getElementById(this.id).srcObject = this.webcamStream
        }
      }
    },
    template: /*html*/`
      <v-sheet :id="id + '-container'" elevation="3">
        <video :id="id" autoplay />
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
