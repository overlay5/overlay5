(function(){
  window.vueStore = new Vuex.Store({
    plugins: [ window.VuexLocalStorage, window.VuexWebSocket ]
  })
})()
