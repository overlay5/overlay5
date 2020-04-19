(function(){

  const CLIENT_ID = '1s5g4rqwrwegxjj0hrngszflirdqh7'

  Vue.component('OAuth', {
    render: (h) => {
      return h()
    },
    created: function() {
      const oauth = Object.fromEntries(
        window.location.hash.slice(1).split('&').map(x => x.split('=')))
      window.localStorage.setItem('access_token', oauth.access_token)
      window.close()
    }
  })

  Vue.component('Config', {
    data: () => ({
      cameras: [],
      audioin: [],
      camera: '',
      audio: '',
      twitchLoading: false,
      twitchConnected: false,
      twitchDialog: false,
    }),
    created: async function () {
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.cameras = devices.filter(device => device.kind === 'videoinput')
      this.audioin = devices.filter(device => device.kind === 'audioinput')
      window.addEventListener('focus', this.checkAccessToken)
      this.checkAccessToken()
    },
    methods: {
      checkAccessToken: function () {
        const token = window.localStorage.getItem('access_token')
        if (token) {
          this.twitchConnected = true
        }
      },
      startOAuth: function (event) {
        const client_id = CLIENT_ID
        const redirect_uri = 'https://overlay5.local:9999/oauth'
        const response_type = 'token'
        const scope = 'bits:read channel_feed_read channel_read channel_subscriptions chat:read'
        const queryString = {
          client_id,
          redirect_uri,
          response_type,
          scope
        }
        const qs = Object.keys(queryString).map(q => q + '=' + encodeURIComponent(queryString[q])).join('&')
        const url = 'https://id.twitch.tv/oauth2/authorize'
        window.open(url + '?' + qs, "_blank");
      },
      integrateTwitch: function (event) {
        if (!this.twitchConnected) {
          return this.startOAuth()
        }
        this.twitchDialog = true
      },
      disconnectTwitch: function (event) {
        window.localStorage.removeItem('access_token')
        this.twitchConnected = false
        this.twitchDialog = false
      },
      twitchBtnStyle: function () {
        if (this.twitchConnected) {
          return {
            color: '#6441A4',
            outlined: false,
            disabled: true
          }
        }
        return {
          color: 'white',
          outlined: true
        }
      }
    },
    template: /*html*/`
      <v-content>

        <v-dialog raised v-model="twitchDialog" :value="twitchDialog" width="500">
          <v-card raised>
            <v-card-title primary-title>
              Disconnect from Twitch
            </v-card-title>
            <v-card-text class="headline">Are you sure?</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click.native.stop="twitchDialog = false">cancel</v-btn>
              <v-btn color="error" @click.native.stop="disconnectTwitch()">disconnect twitch</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card>
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Configuration</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    Integrations:
                    <v-spacer/>
                      <v-btn class="mt-2 mb-4" :loading="twitchLoading" :disabled="twitchLoading" @click.native.stop="integrateTwitch()" v-bind="twitchBtnStyle()">
                        <v-icon :left="true" >fab fa-twitch</v-icon>
                        Twitch
                      </v-btn>
                    <v-spacer />
                    <v-select v-model="camera" :items="cameras" item-text="label" item-value="deviceId" prepend-icon="camera_alt" label="Select the camera device to use:"/>
                    <v-select v-model="audio"  :items="audioin" item-text="label" item-value="deviceId" prepend-icon="mic" label="Select the microphone device to use:"/>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text to="/">back to overlay</v-btn>
                  <v-btn color="primary">save</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </v-content>
    `
  })
})()
