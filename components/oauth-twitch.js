(function(){
Vue.component('OAuthTwitch', {
  render: (h) => {
    return h()
  },
  created: async function() {
    const oauth = Object.fromEntries(
      window.location.hash.slice(1).split('&').map(x => x.split('=')))
    window.localStorage.setItem('twitch_access_token', oauth.access_token)
    window.close()
  }
})
}())
