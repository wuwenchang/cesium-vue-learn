<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'ParticleSystemRain',
  mounted () {
    let viewer = this.initCesium()

    this.addParticleSystemRain(viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg4ZjljZC1mZGM3LTRlZjEtYjg3MC00MjZkNGU3YjI5ZWUiLCJpZCI6MTU5NTIsImlhdCI6MTYwNTE0ODM5OX0.LjxeKrgAo7Ksk8405kSAhYwF0nKcF2w2DGJnKHh51N8'
      let viewer = new Cesium.Viewer('cesiumContainer', {
        animation: true,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: true,
        sceneModePicker: false,
        navigationHelpButton: false,
        scene3DOnly: true,
        timeline: true,
        selectionIndicator: false, // 是否显示选取指示器组件
        shouldAnimate: true, // 自动播放动画控件
        shadows: true, // 是否显示光照投射的阴影
        terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, // 地质接收阴影
        sceneMode: Cesium.SceneMode.SCENE3D,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addParticleSystemRain (viewer) {
      var scene = viewer.scene
      scene.globe.depthTestAgainstTerrain = true
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          277096.634865404,
          5647834.481964232,
          2985563.7039122293
        ),
        orientation: {
          heading: 4.731089976107251,
          pitch: -0.32003481981370063
        }
      })

      var rainParticleSize = 15.0
      var rainRadius = 100000.0
      var rainImageSize = new Cesium.Cartesian2(
        rainParticleSize,
        rainParticleSize * 2.0
      )

      var rainSystem

      var rainGravityScratch = new Cesium.Cartesian3()
      var rainUpdate = function (particle, dt) {
        rainGravityScratch = Cesium.Cartesian3.normalize(
          particle.position,
          rainGravityScratch
        )
        rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
          rainGravityScratch,
          -1050.0,
          rainGravityScratch
        )

        particle.position = Cesium.Cartesian3.add(
          particle.position,
          rainGravityScratch,
          particle.position
        )

        var distance = Cesium.Cartesian3.distance(
          scene.camera.position,
          particle.position
        )
        if (distance > rainRadius) {
          particle.endColor.alpha = 0.0
        } else {
          particle.endColor.alpha =
              rainSystem.endColor.alpha / (distance / rainRadius + 0.1)
        }
      }

      rainSystem = new Cesium.ParticleSystem({
        modelMatrix: new Cesium.Matrix4.fromTranslation(
          scene.camera.position
        ),
        speed: -1.0,
        lifetime: 15.0,
        emitter: new Cesium.SphereEmitter(rainRadius),
        startScale: 1.0,
        endScale: 0.0,
        image: 'http://localhost:8888/Apps/SampleData/circular_particle.png',
        emissionRate: 9000.0,
        startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
        endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
        imageSize: rainImageSize,
        updateCallback: rainUpdate
      })
      scene.primitives.add(rainSystem)

      scene.skyAtmosphere.hueShift = -0.8
      scene.skyAtmosphere.saturationShift = -0.7
      scene.skyAtmosphere.brightnessShift = -0.33

      scene.fog.density = 0.001
      scene.fog.minimumBrightness = 0.8
    }
  }
}
</script>
