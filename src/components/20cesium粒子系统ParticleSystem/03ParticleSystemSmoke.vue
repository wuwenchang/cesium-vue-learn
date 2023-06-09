<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'ParticleSystemSmoke',
  mounted () {
    let viewer = this.initCesium()

    this.addParticleSystemSmoke(viewer)
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
    addParticleSystemSmoke (viewer) {
      Cesium.Math.setRandomNumberSeed(3)

      var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
      var stop = Cesium.JulianDate.addSeconds(
        start,
        120,
        new Cesium.JulianDate()
      )

      viewer.clock.startTime = start.clone()
      viewer.clock.stopTime = stop.clone()
      viewer.clock.currentTime = start.clone()
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop at the end
      viewer.clock.multiplier = 0.5
      viewer.clock.shouldAnimate = true
      viewer.timeline.zoomTo(start, stop)

      var viewModel = {
        emissionRate: 5.0,
        gravity: 0.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.2,
        minimumSpeed: 1.0,
        maximumSpeed: 4.0,
        startScale: 1.0,
        endScale: 5.0,
        particleSize: 25.0
      }

      function computeModelMatrix (entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4())
      }

      var emitterModelMatrix = new Cesium.Matrix4()
      var translation = new Cesium.Cartesian3()
      var rotation = new Cesium.Quaternion()
      var hpr = new Cesium.HeadingPitchRoll()
      var trs = new Cesium.TranslationRotationScale()

      function computeEmitterModelMatrix () {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr)
        trs.translation = Cesium.Cartesian3.fromElements(
          -4.0,
          0.0,
          1.4,
          translation
        )
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation)

        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        )
      }

      var pos1 = Cesium.Cartesian3.fromDegrees(
        -75.15787310614596,
        39.97862668312678
      )
      var pos2 = Cesium.Cartesian3.fromDegrees(
        -75.1633691390455,
        39.95355089912078
      )
      var position = new Cesium.SampledPositionProperty()

      position.addSample(start, pos1)
      position.addSample(stop, pos2)

      var entity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop
          })
        ]),
        model: {
          uri: 'http://localhost:8888/Apps/SampleData/models/CesiumMilkTruck/CesiumMilkTruck.glb',
          minimumPixelSize: 64
        },
        viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position)
      })
      viewer.trackedEntity = entity

      var scene = viewer.scene
      var particleSystem = scene.primitives.add(
        new Cesium.ParticleSystem({
          image: 'http://localhost:8888/Apps/SampleData/smoke.png',

          startColor: Cesium.Color.WHITE.withAlpha(1.0),
          endColor: Cesium.Color.WHITE.withAlpha(0.0),

          startScale: viewModel.startScale,
          endScale: viewModel.endScale,

          minimumParticleLife: viewModel.minimumParticleLife,
          maximumParticleLife: viewModel.maximumParticleLife,

          minimumSpeed: viewModel.minimumSpeed,
          maximumSpeed: viewModel.maximumSpeed,

          imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
          ),

          emissionRate: viewModel.emissionRate,

          bursts: [
            // these burst will occasionally sync to create a multicolored effect
            new Cesium.ParticleBurst({
              time: 5.0,
              minimum: 10,
              maximum: 100
            }),
            new Cesium.ParticleBurst({
              time: 10.0,
              minimum: 50,
              maximum: 100
            }),
            new Cesium.ParticleBurst({
              time: 15.0,
              minimum: 200,
              maximum: 300
            })
          ],
          lifetime: 16.0,
          emitter: new Cesium.CircleEmitter(2.0),
          emitterModelMatrix: computeEmitterModelMatrix(),
          updateCallback: applyGravity
        })
      )

      var gravityScratch = new Cesium.Cartesian3()

      function applyGravity (p, dt) {
        // We need to compute a local up vector for each particle in geocentric space.
        var position = p.position

        Cesium.Cartesian3.normalize(position, gravityScratch)
        Cesium.Cartesian3.multiplyByScalar(
          gravityScratch,
          viewModel.gravity * dt,
          gravityScratch
        )

        p.velocity = Cesium.Cartesian3.add(
          p.velocity,
          gravityScratch,
          p.velocity
        )
      }

      viewer.scene.preUpdate.addEventListener(function (scene, time) {
        particleSystem.modelMatrix = computeModelMatrix(entity, time)

        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix()
      })
    }
  }
}
</script>
