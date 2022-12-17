(function(){
  window.o5 = window.o5 || {}
  window.o5.router = new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      redirect: '/overlay',
      component: {
        template: /*html*/`<router-view />`
      }
    }, {
      path: '/overlay',
      component: Vue.component('Overlay')
    }, {
      path: '/config',
      component: Vue.component('Config')
    }, {
      path: '/oauth',
      component: Vue.component('OAuthTwitch')
    }, {
      path: '/callback/oauth2',
      component: Vue.component('OAuthSpotify')
    }]
  })
})()
