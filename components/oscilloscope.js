(function(){
  Vue.component('Oscilloscope', {
    data: () => ({
      audioStream: null
    }),
    template: /*html*/`
      <canvas />
    `,
    methods: {
      connect: function (analyser) {
        analyser.fftSize = 4096 // 2048
        analyser.minDecibels = -90
        analyser.maxDecibels = -10
        analyser.smoothingTimeConstant = 0.85

        const WIDTH = this.$el.width
        const HEIGHT = this.$el.height
        const NORMALISATION = HEIGHT/256
        const TRIGGER = 134  // 128 == zero. this is the "trigger" level.

        var dataArray = new Uint8Array(analyser.fftSize)
        var canvasCtx = this.$el.getContext('2d')
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

        function findZeroCrossing(buf, buflen) {
            let t, i = 0, last_zero = -1

            // Increment until <= 0 or we reach the end of the buffer
            while (i < buflen && (buf[i] > 128)) {
                i++
            }

            // Increment until we're above TRIGGER, keeping track of last zero.
            while (i < buflen && ((t = buf[i]) < TRIGGER)) {
                if (t >= 128) {
                    if (last_zero == -1) {
                        last_zero = i
                    }
                } else {
                    last_zero = -1
                }
                i++
            }

            // we may have jumped over TRIGGER in one sample.
            if (last_zero === -1) {
                last_zero = i
            }

            // We didn't find any positive zero crossings
            if (i >= buflen) {
                return 0
            }

            return last_zero
        }

        function draw() {
            requestAnimationFrame(draw)

            analyser.getByteTimeDomainData(dataArray)
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

            canvasCtx.lineWidth = 2
            canvasCtx.strokeStyle = '#ffff00'
            canvasCtx.beginPath()

            const zeroCross = findZeroCrossing(dataArray, WIDTH)

            canvasCtx.moveTo(0, (256 - dataArray[zeroCross])*NORMALISATION)
            for (let i = zeroCross, j=0; (j < WIDTH) && (i < dataArray.length); i++, j++) {
    	        canvasCtx.lineTo(j, (256 - dataArray[i])*NORMALISATION)
            }

            canvasCtx.stroke()
        }

        draw()
      }
    },
    created: async function() {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      window.audioStream = this.audioStream
      let context = new AudioContext()
      input = context.createMediaStreamSource(this.audioStream)
      let analyser = context.createAnalyser()
      input.connect(analyser)
      this.connect(analyser)
    }
  })
})()
