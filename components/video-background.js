(function () {
  Vue.component('Background', {
    name: 'Background',
    props: ['id'],
    data: () => ({
      videoNode: document.getElementById(this.id),
      // videoFile: '/video-bg/mylivewallpapers.com-Green-Particles-4k.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Color-Wave.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Hexagon.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Particle-Earth.mp4'
      videoFile: '/video-bg/mylivewallpapers.com-Polygon-Lines-Dark.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Space-Travel.mp4'

      // videoFile: '/video-bg/mylivewallpapers.com-Cthulhu.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Apocalyptic-Ruin.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Asteroids-Incoming.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Bliss-Tree.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Blue-Abstract.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Blue-Galaxy.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-BlueParticles.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Blue-Retro-Moon.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Castlevania-Castle.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Code-Is-Life.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Crystal-Cube.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Cyber-City.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Cyber-Globe-1.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Cyber-Interface.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Cyberpunk-2077-City.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Cyberpunk-Chinatown.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Digital-Grapes.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Elvenar-Landscape.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Fantasy-Waterfall.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Fire-Demon-1.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Fireflies-Forest.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Floating-Cube.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Floating-Cubes.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-ForgeOfEmpires-Village.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Hex-Grid.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-High-Hrothgar-Skyrim.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Japanese-Village.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Liyue-Whale-Airship.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Lonely-Dog.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Magic-Ritual.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Monolith-Fantasy.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Particle-Wave.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Pixel-City.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Pixel-Street-Night.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Portal.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Post-Apocalyptic-Fireplace.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Princess-Mononoke-Moon.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Purple-Blocks.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Rainbow-Ring.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Recharge.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Red-Planet.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Rotating-Digital-Earth.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Sea-Village.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Shattered-Monolith.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Skull-River.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-SOMA.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Space-Accident.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Star-Gaze.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Stars-Fall.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Strange-Place.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Underground-Village.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Viking-War-Of-Clans.mp4'
      // videoFile: '/video-bg/mylivewallpapers.com-Waterfall-Palace.mp4'
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
