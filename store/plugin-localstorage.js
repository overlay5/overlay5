(function(){
  const LOCALSTORAGE_ITEM_NAME = 'o5-store'

  const VuexLocalStorage = (store) => {
    let previous = localStorage.getItem(LOCALSTORAGE_ITEM_NAME)
    if (previous) {
      store.replaceState(JSON.parse(previous))
    }
    store.subscribe((mutation, state) => {
      localStorage.setItem(LOCALSTORAGE_ITEM_NAME, JSON.stringify(state))
    })
  }

  VuexLocalStorage(o5.store)
})()
