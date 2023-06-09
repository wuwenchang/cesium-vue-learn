<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'ParticleSystemSnow',
  mounted () {
    let viewer = this.initCesium()

    this.addParticleSystemSnow(viewer)
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
    addParticleSystemSnow (viewer) {
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

      var snowParticleSize = 12.0
      var snowRadius = 100000.0
      var minimumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize,
        snowParticleSize
      )
      var maximumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize * 2.0,
        snowParticleSize * 2.0
      )
      var snowSystem

      var snowGravityScratch = new Cesium.Cartesian3()
      var snowUpdate = function (particle, dt) {
        snowGravityScratch = Cesium.Cartesian3.normalize(
          particle.position,
          snowGravityScratch
        )
        Cesium.Cartesian3.multiplyByScalar(
          snowGravityScratch,
          Cesium.Math.randomBetween(-30.0, -300.0),
          snowGravityScratch
        )
        particle.velocity = Cesium.Cartesian3.add(
          particle.velocity,
          snowGravityScratch,
          particle.velocity
        )

        var distance = Cesium.Cartesian3.distance(
          scene.camera.position,
          particle.position
        )
        if (distance > snowRadius) {
          particle.endColor.alpha = 0.0
        } else {
          particle.endColor.alpha =
              snowSystem.endColor.alpha / (distance / snowRadius + 0.1)
        }
      }

      snowSystem = new Cesium.ParticleSystem({
        modelMatrix: new Cesium.Matrix4.fromTranslation(
          scene.camera.position
        ),
        minimumSpeed: -1.0,
        maximumSpeed: 0.0,
        lifetime: 15.0,
        emitter: new Cesium.SphereEmitter(snowRadius),
        startScale: 0.5,
        endScale: 1.0,
        image: 'http://localhost:8888/Apps/SampleData/snowflake_particle.png',
        emissionRate: 7000.0,
        startColor: Cesium.Color.WHITE.withAlpha(0.0),
        endColor: Cesium.Color.WHITE.withAlpha(1.0),
        minimumImageSize: minimumSnowImageSize,
        maximumImageSize: maximumSnowImageSize,
        updateCallback: snowUpdate
      })
      scene.primitives.add(snowSystem)

      scene.skyAtmosphere.hueShift = -0.8
      scene.skyAtmosphere.saturationShift = -0.7
      scene.skyAtmosphere.brightnessShift = -0.33

      scene.fog.density = 0.001
      scene.fog.minimumBrightness = 0.8
    }
  }
}
</script>
