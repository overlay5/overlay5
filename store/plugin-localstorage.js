(function(){
  window.VuexLocalStorage = (store) => {
    let previous = localStorage.getItem('overlay5-store')
    if (previous) {
      store.replaceState(JSON.parse(previous))
    }
    store.subscribe((mutation, state) => {
      localStorage.setItem('overlay5-store', JSON.stringify(state))
    })
  }
})()
