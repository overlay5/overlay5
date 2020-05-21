(function() {
  Vue.component('Time', {
    data: () => ({
      now: new Date()
    }),
    template: /*html*/`
      <v-chip pill color="grey--text">
        <v-avatar left><v-icon dense small>fa-clock</v-icon></v-avatar>
        {{ now.getHours().toString() }}:{{ now.getMinutes().toString().padStart(2,'0') }}:{{ now.getSeconds().toString().padStart(2,'0') }}
      </v-chip>
    `,
    created () {
      setInterval(() => this.now = new Date(), 1000)
    }
  })
})()
