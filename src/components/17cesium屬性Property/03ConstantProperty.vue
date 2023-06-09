<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'ConstantProperty',
  mounted () {
    let viewer = this.initCesium()

    this.addConstantProperty(viewer)
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
        clock: new Cesium.Clock(),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addConstantProperty (viewer) {
      // 创建一个动态变化的盒子
      const start = Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z')
      const stop = Cesium.JulianDate.fromIso8601('2019-01-01T00:00:10.00Z')
      viewer.clock.startTime = start.clone()
      viewer.clock.stopTime = stop.clone()
      viewer.clock.currentTime = start.clone()
      viewer.timeline.zoomTo(start, stop)
      // Speed up the playback speed 50x.
      viewer.clock.multiplier = 1
      // Start playing the scene.
      viewer.clock.shouldAnimate = true
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP

      let entity = viewer.entities.add({
        name: 'Blue box',
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 200000.0), // 尺寸，长宽高，随着时间动态取样变化
          material: Cesium.Color.BLUE, // 材质
          fill: true, // 是否填充
          shadows: Cesium.ShadowMode.ENABLED// 开启接收并且投射阴影
        }
      })

      console.log(entity.box.dimensions)
      viewer.trackedEntity = entity

      viewer.clock.onTick.addEventListener(function (clock) {
        let currentTime = clock.currentTime
        console.log(currentTime.equalsEpsilon(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:05.00Z'), 2))
        if (currentTime.equalsEpsilon(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:05.00Z'), 2)) {
          console.log(currentTime)
          entity.box.dimensions.setValue(new Cesium.Cartesian3(400000.0, 300000.0, 700000.0))
        }
      })
    }
  }
}
</script>
