(function(){
  Vue.component('NavMenu', {
    data: () => ({
      hover: false,
    }),
    template: /*html*/`
      <v-hover id="hover-menu" v-model="hover">
        <div class="pa-8" style="height:200px;width:200px;position:absolute">
          <v-btn v-if="hover" to="/config" fab><v-icon>settings</v-icon></v-btn>
        </div>
      </v-hover>
    `
  })
})()
