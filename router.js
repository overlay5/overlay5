(function(){
  window.vueRouter = new VueRouter({
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
      component: Vue.component('OAuth')
    }]
  })
})()
