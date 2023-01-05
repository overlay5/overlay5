(function(){
Vue.component('OAuthSpotify', {
  render: (h) => {
    return h()
  },
  created: async function() {
    const oauth = Object.fromEntries(
      window.location.hash.slice(1).split('&').map(x => x.split('=')))
    oauth.code = new URL(window.location).searchParams.get('code');
    if (oauth.access_token) {
      window.localStorage.setItem('spotify_access_token', oauth.access_token)
      window.close()
    }
    if (oauth.code) {
      const queryString = {
        grant_type: 'authorization_code',
        code: oauth.code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      }
      const body = Object.keys(queryString).map(q => q + '=' + encodeURIComponent(queryString[q])).join('&')
      const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        }
      });
      const tokens = await response.json()
      window.localStorage.setItem('spotify_access_token', tokens.access_token)
      window.localStorage.setItem('spotify_refresh_token', tokens.refresh_token)
      window.close()
    }
  }
})
}())
