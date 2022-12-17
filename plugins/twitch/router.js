(function(){
  const routes = [{
    path: '/twitch/oauth',
    component: Vue.component('TwitchOAuth')
  }]
  window.o5.router.addRoutes(routes)
})()
