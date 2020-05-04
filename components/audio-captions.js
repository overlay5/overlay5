(function(){
  const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)

  Vue.component('AudioCaptions', {
    data: () => ({
      finalText: '',
      interimText: '',
    }),
    template: /*html*/`
    <v-sheet class="px-2 d-inline-flex flex-column-reverse align-end" elevation="3">
      <span class="grey--text text--lighten-2">{{ finalText }} &bull; <span class="grey--text text--lighten-1">{{ interimText }}</span></span>
    </v-sheet>
    `,
    methods: {
      recognitionResult: function (event) {
        let final = "", interim = ""
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript
          } else {
            interim += event.results[i][0].transcript
          }
        }
        for (let [cmd, fn] of Object.entries(window.VOICE_COMMANDS_RE)) {
          if (RegExp(cmd + '$', 'ig').test(interim)) {
            fn(recognition)
          }
        }
        this.finalText = ' | ' + final
        this.interimText = interim
      },
      startCaptions: function () {
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.onresult = this.recognitionResult.bind(this)
        recognition.onend = () => {
          setTimeout(function () { recognition.start() }, 1000)
        }
        recognition.onerror = (err) => {
          if (err.error !== 'no-speech') {
            console.error('recognition error', err)
          }
        }
        recognition.start()
      }
    },
    created: function () {
      this.startCaptions()
    }
  })

})()
