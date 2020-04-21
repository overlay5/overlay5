(function(){
  const vuetify = new Vuetify({
    theme: { dark: true }
  })

  const vue = new Vue({
    store: window.vueStore,
    router: window.vueRouter,
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

  window.vue = vue
})()
