(function(){
  Vue.component('NavMenu', {
    props: [ 'target', 'icon' ],
    data: () => ({
      hover: false,
    }),
    template: /*html*/`
      <v-hover id="hover-menu" v-model="hover">
        <div class="pa-8" style="height:200px;width:200px;position:absolute">
          <v-btn v-if="hover" :to="target" fab><v-icon>{{ icon }}</v-icon></v-btn>
        </div>
      </v-hover>
    `
  })
})()
