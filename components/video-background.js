(function () {
  Vue.component('Background', {
    name: 'Background',
    props: ['id'],
    data: () => ({
      videoNode: document.getElementById(this.id),
      videoFile: '/video-bg/mylivewallpapers.com-Green-Particles-4k.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Color-Wave.mp4'
    }),
    methods: {
      updateVideo: async function () {
        const videoNode = this.$el.getElementsByTagName('video')[0]
        if (!videoNode)
          return
        if (videoNode)
          document.addEventListener('click', async function () {
            await videoNode.play()
            videoNode.addEventListener('pause', () => videoNode.play())
          })
      },
    },
    mounted: async function () {
      return this.updateVideo();
    },
    template: /*html*/`
      <div :id="id + '-container'" style="height:100vh;width:100vw">
        <video :id="id" autoplay loop :src="videoFile" />
      </div>
    `
  })
})()
