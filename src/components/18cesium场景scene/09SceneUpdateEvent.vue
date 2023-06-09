<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'SceneUpdateEvent',
  mounted () {
    let viewer = this.initCesium()

    this.addSceneUpdateEvent(viewer)
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
    addSceneUpdateEvent (viewer) {
      Cesium.Math.setRandomNumberSeed(3)

      // Set bounds of our simulation time
      var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
      var stop = Cesium.JulianDate.addSeconds(
        start,
        360,
        new Cesium.JulianDate()
      )

      // Make sure viewer is at the desired time.
      viewer.clock.startTime = start.clone()
      viewer.clock.stopTime = stop.clone()
      viewer.clock.currentTime = start.clone()
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop at the end
      viewer.clock.multiplier = 10

      // Set timeline to simulation bounds
      viewer.timeline.zoomTo(start, stop)

      // Generate a random circular pattern with varying heights.
      function computeCirclularFlight (lon, lat, radius) {
        var property = new Cesium.SampledPositionProperty()
        for (var i = 0; i <= 360; i += 45) {
          var radians = Cesium.Math.toRadians(i)
          var time = Cesium.JulianDate.addSeconds(
            start,
            i,
            new Cesium.JulianDate()
          )
          var position = Cesium.Cartesian3.fromDegrees(
            lon + radius * 1.5 * Math.cos(radians),
            lat + radius * Math.sin(radians),
            Cesium.Math.nextRandomNumber() * 500 + 1750
          )
          property.addSample(time, position)

          // Also create a point for each sample we generate.
          viewer.entities.add({
            position: position,
            point: {
              pixelSize: 8,
              color: Cesium.Color.TRANSPARENT,
              outlineColor: Cesium.Color.YELLOW,
              outlineWidth: 3
            }
          })
        }
        return property
      }

      // Compute the entity position property.
      var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03)

      // Actually create the entity
      var entity = viewer.entities.add({
        // Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop
          })
        ]),

        // Use our computed positions
        position: position,

        // Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(position),

        // Load the Cesium plane model to represent the entity
        model: {
          uri: 'http://localhost:8888/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
          minimumPixelSize: 64
        },

        // Show the path as a pink line sampled in 1 second increments.
        path: {
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Cesium.Color.YELLOW
          }),
          width: 10
        }
      })

      // 实时渲染
      viewer.scene.postRender.addEventListener(function () {
        console.log('实时更新')
      })

      let hpRange = new Cesium.HeadingPitchRange()
      viewer.scene.preRender.addEventListener(function () {
        console.log('更新之前执行')
        if (entity) {
          hpRange.heading = Cesium.Math.toRadians(-90)
          hpRange.pitch = Cesium.Math.toRadians(-45)
          hpRange.range = 100
          var center = entity.position.getValue(viewer.clock.currentTime)
          if (center) {
            viewer.camera.lookAt(center, hpRange)
          }
        }
      })
    }
  }
}
</script>
