(function(){

  const CLIENT_SCOPES = [
    // API: Undocumented extras
    // 'user_edit', <- INVALID
    // 'user_friends_edit', <- INVALID
    // 'user_friends_read', <- INVALID
    // 'user_presence_edit', <- INVALID
    // 'user_subscriptions_edit', <- INVALID
    // 'channel_feed_report', <- INVALID
    // 'user_entitlements_read', <- INVALID
    // 'user_presence_friends_read', <- INVALID

    // API: New (helix)
    'analytics:read:extensions',
    'analytics:read:games',
    'bits:read',
    'channel:read:subscriptions',
    // 'clips:edit',
    // 'user:edit',
    // 'user:edit:broadcast',
    'user:read:broadcast',
    // 'user:read:email',

    // API: v5 (kraken)
    // 'channel_check_subscription',
    // 'channel_commercial',
    // 'channel_editor',
    // 'channel_feed_edit',
    'channel_feed_read',
    'channel_read',
    // 'channel_stream',
    // 'channel_subscriptions',
    // 'chat_login', // <- Requires the client to be whitelisted
    // 'collections_edit',
    // 'communities_edit',
    // 'communities_moderate',
    // 'openid',
    // 'user_blocks_edit',
    'user_blocks_read',
    // 'user_follows_edit',
    'user_read',
    // 'user_subscriptions',
    'viewing_activity_read',

    // API: Chat & PubSub
    // 'channel:moderate',
    // 'chat:edit',
    'chat:read',
    'whispers:read',
    // 'whispers:edit',

  ].join(' ')

  Vue.component('OAuth', {
    render: (h) => {
      return h()
    },
    created: async function() {
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
      this.audio = this.mediaAudio
      this.camera = this.mediaWebcam
    },
    activated: function () {
      this.audio = this.mediaAudio
      this.camera = this.mediaWebcam
    },
    computed: {
      ...Vuex.mapGetters(['mediaAudio', 'mediaWebcam'])
    },
    methods: {
      saveChanges: function () {
        this.$store.dispatch('mediaSetAudio', this.audio)
        this.$store.dispatch('mediaSetWebcam', this.camera)
      },
      revertChanges: function () {
        this.camera = ''
        this.audio = ''
      },
      checkAccessToken: function () {
        const token = window.localStorage.getItem('access_token')
        if (token) {
          this.twitchConnected = true
        }
      },
      startOAuth: function (event) {
        const client_id = CLIENT_ID
        const redirect_uri = CLIENT_REDIRECT_URI
        const response_type = 'token'
        const scope = CLIENT_SCOPES
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

        <NavMenu @click="revertChanges" target="/overlay" icon="keyboard_return" />

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
                  <v-btn text @click="revertChanges" to="/">back to overlay</v-btn>
                  <v-btn @click="saveChanges" color="primary">save</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </v-content>
    `
  })
})()
