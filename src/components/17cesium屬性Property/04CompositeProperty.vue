<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CompositeProperty',
  mounted () {
    let viewer = this.initCesium()

    this.addCompositeProperty(viewer)
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
    addCompositeProperty (viewer) {
      // 创建一个动态变化的盒子
      const start = Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z')
      const stop = Cesium.JulianDate.fromIso8601('2019-01-03T00:00:00.00Z')
      viewer.clock.startTime = start.clone()
      viewer.clock.stopTime = stop.clone()
      viewer.clock.currentTime = start.clone()
      viewer.timeline.zoomTo(start, stop)
      // Speed up the playback speed 50x.
      viewer.clock.multiplier = 3600
      // Start playing the scene.
      viewer.clock.shouldAnimate = true
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP

      var sampledProperty = new Cesium.SampledProperty(Cesium.Cartesian3)

      sampledProperty.addSample(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'),
        new Cesium.Cartesian3(400000.0, 300000.0, 200000.0))

      sampledProperty.addSample(Cesium.JulianDate.fromIso8601('2019-01-02T00:00:00.00Z'),
        new Cesium.Cartesian3(600000.0, 400000.0, 500000.0))

      var timeIntervalCollectionProperty = new Cesium.TimeIntervalCollectionProperty(Cesium.Cartesian3)

      timeIntervalCollectionProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601: '2019-01-02T00:00:00.00Z/2019-01-02T12:00:00.00Z',
        isStartIncluded: false,
        isStopIncluded: true,
        data: new Cesium.Cartesian3(400000.0, 300000.0, 200000.0)
      }))
      timeIntervalCollectionProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601: '2019-01-02T12:00:01.00Z/2019-01-03T00:00:00.00Z',
        isStartIncluded: false,
        isStopIncluded: true,
        data: new Cesium.Cartesian3(400000.0, 300000.0, 400000.0)
      }))
      timeIntervalCollectionProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601: '2019-01-03T00:00:01.00Z/2019-01-03T12:00:00.00Z',
        isStartIncluded: false,
        isStopIncluded: true,
        data: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
      }))

      var compositeProperty = new Cesium.CompositeProperty()
      compositeProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601: '2019-01-01T00:00:00.00Z/2019-01-02T00:00:00.00Z',
        data: sampledProperty
      }))
      compositeProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601: '2019-01-02T00:00:00.00Z/2019-01-03T12:00:00.00Z',
        isStartIncluded: false,
        isStopIncluded: false,
        data: timeIntervalCollectionProperty
      }))

      let entity = viewer.entities.add({
        name: 'Blue box',
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
        box: {
          dimensions: compositeProperty, // 尺寸，长宽高，随着时间动态取样变化
          material: Cesium.Color.BLUE, // 材质
          fill: true, // 是否填充
          shadows: Cesium.ShadowMode.ENABLED// 开启接收并且投射阴影
        }
      })

      viewer.trackedEntity = entity
    }
  }
}
</script>
