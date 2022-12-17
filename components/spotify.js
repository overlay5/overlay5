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
    created() {
      this.updateWidget();
      setInterval(() => {
        this.updateWidget();
      }, 5000);
    },
    methods: {
      async updateWidget() {
        try {
          // Replace SPOTIFY_AUTH_TOKEN with your own Spotify authentication token
          const authHeader = {
            headers: {
              Authorization: `Bearer ${localStorage.spotify_access_token}`,
            },
          };

          // Send a request to the Spotify API to get the currently playing track
          const response = await fetch(
            'https://api.spotify.com/v1/me/player/currently-playing',
            authHeader
          );

          // Get the track information from the response
          const trackInfo = await response.json();
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
