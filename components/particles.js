(function(){
  Vue.component('Particles', {
    template: /*html*/`
      <div></div>
    `,
    created: async function() {
      particlesJS.load(this.$attrs.id, 'particles.json')
    }
  })
})()

