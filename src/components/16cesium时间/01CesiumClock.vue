<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CesiumClock',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addClock(viewer)
  },
  methods: {
    initCesium: function () {
      // 方式一
      var clock = new Cesium.Clock({
        startTime: Cesium.JulianDate.fromIso8601('2018-12-25'),
        currentTime: Cesium.JulianDate.fromIso8601('2018-12-25'),
        stopTime: Cesium.JulianDate.fromIso8601('2018-12-26'),
        clockRange: Cesium.ClockRange.CLAMPED,
        clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        multiplier: 10000.0, // how much time to advance each tick
        shouldAnimate: true // Animation on by default
      })
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlOTExNTU4NC1lMDFlLTRiYTYtOTRmZi0zNDAwZWFjMjMxNDAiLCJpZCI6MTU5NTIsImlhdCI6MTYwNjY0MDc4MH0.DEgc4-h5oyP530dPxa1YKpXqzCAzUagibRB9bHm5QQs'
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
        // clock: new Cesium.Clock(),//不用自己创建，使用系统默认时钟
        clockViewModel: new Cesium.ClockViewModel(clock),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.CesiumTerrainProvider({// 地质开挖必须是cesium提供的地形
          url: Cesium.IonResource.fromAssetId(1),
          requestVertexNormals: true, // 顶点法线效果
          requestWaterMask: true// 水效果
        })
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      // 地质开挖不能有深度测试，有深度测试会被遮盖
      viewer.scene.globe.depthTestAgainstTerrain = false
      return viewer
    },
    addClock (viewer) {
      // Set up clock and timeline. 方式二
      /* viewer.clock.shouldAnimate = true; // make the animation play when the viewer starts
        viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
        viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
        viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
        viewer.clock.multiplier = 200; // sets a speedup
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
        viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range */

      // 每一帧渲染的时间
      viewer.clock.onTick.addEventListener(function (clock) {
        console.log(clock)
      })

      // clock结束的时间触发
      viewer.clock.onStop.addEventListener(function (clock) {
        console.log(clock)
      })
    }
  }
}
</script>
