(function () {
  Vue.component('Spotify', {
    name: 'Spotify',
    template: /*html*/`
      <v-card>
        <v-img class="rounded-image" v-bind:src="albumImage" alt="Album Cover" />
        <v-card-title>{{ trackName }}</v-card-title>
        <v-card-subtitle>{{ artistName }}</v-card-subtitle>
        <v-progress-linear v-bind:value="progress" color="dark"></v-progress-linear>
      </v-card>
    `,
    data() {
      return {
        albumImage: '',
        trackName: '',
        artistName: '',
        progress: 0,
      };
    },
    async created() {
      await this.refreshToken();
      await this.updateWidget();
    },
    methods: {
      async refreshToken() {
        // https://developer.spotify.com/documentation/general/guides/authorization/code-flow/#request-a-refreshed-access-token
        if (!window.localStorage.spotify_refresh_token)
          return;
        const queryString = {
          grant_type: 'refresh_token',
          refresh_token: localStorage.spotify_refresh_token
        }
        const body = Object.keys(queryString).map(q => q + '=' + encodeURIComponent(queryString[q])).join('&')
        const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
        const response = await fetch(`https://accounts.spotify.com/api/token`, {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`,
          }
        });
        const tokenInfo = await response.json();
        if (tokenInfo.access_token)
          window.localStorage.setItem('spotify_access_token', tokenInfo.access_token);
      },
      async updateWidget() {
        // repeat this in 5 seconds
        setTimeout(this.updateWidget, 5000);

        if (!localStorage.spotify_access_token)
          return;

        try {
          // Send a request to the Spotify API to get the currently playing track
          const response = await fetch(
            'https://api.spotify.com/v1/me/player/currently-playing',
            {
              headers: {
                Authorization: `Bearer ${localStorage.spotify_access_token}`,
              }
            }
          );

          // Get the track information from the response
          const trackInfo = await response.json();

          if (trackInfo.error && trackInfo.error.status == 401 && trackInfo.error.message == 'The access token expired')
            return this.refreshToken();

          if (response.status != 200) {
            window.localStorage.removeItem('spotify_access_token');
            return;
          }

          this.albumImage = trackInfo.item.album.images[0].url;
          this.trackName = trackInfo.item.name;
          this.artistName = trackInfo.item.artists[0].name;
          this.progress = (trackInfo.progress_ms / trackInfo.item.duration_ms) * 100;
        } catch (error) {
          // If there was an error, clear the track information
          this.albumImage = '';
          this.trackName = '';
          this.artistName = '';
          this.progress = 0;
        }
      },
    },
  })
})()
