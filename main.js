(function(){
  const vuetify = new Vuetify({
    theme: { dark: true }
  })

  const vue = new Vue({
    store: window.o5.store,
    router: window.o5.router,
    vuetify,
    template: /*html*/`
      <div id="app">
        <v-app>
          <keep-alive>
            <router-view :key="$route.fullPath" />
          </keep-alive>
        </v-app>
      </div>
    `
  })

  if (document.getElementById('app')) {
    vue.$mount('#app')
  }

  window.o5 = window.o5 || {}
  window.o5.vue = vue
  window.o5.vuetify = vuetify
})()
