(function(){
  const recognition = new (window['SpeechRecognition'] || window['webkitSpeechRecognition'])

  Vue.component('AudioCaptions', {
    data: () => ({
      finalText: '',
      interimText: '',
    }),
    template: /*html*/`
    <v-sheet class="px-2 d-inline-flex flex-column-reverse align-end" elevation="3">
      <span class="grey--text text--lighten-2">{{ finalText }}<span class="grey--text text--lighten-1">{{ interimText }}</span></span>
    </v-sheet>
    `,
    methods: {
      recognitionResult: function (event) {
        let final = "", interim = ""
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' • '
          } else {
            interim += event.results[i][0].transcript
          }
        }
        this.finalText = final
        this.interimText = interim
      },
      startCaptions: function () {
        recognition.continuous = true
        recognition.interimResults = true
        recognition.onresult = this.recognitionResult
        recognition.start()
      }
    },
    created: function () {
      this.startCaptions()
    }
  })

})()
