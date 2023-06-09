<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import billboard from './images/ganhan.png'
export default {
  name: 'PathGraphics',
  mounted () {
    let viewer = this.initCesium()

    this.addPath(viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg4ZjljZC1mZGM3LTRlZjEtYjg3MC00MjZkNGU3YjI5ZWUiLCJpZCI6MTU5NTIsImlhdCI6MTYwNTE0ODM5OX0.LjxeKrgAo7Ksk8405kSAhYwF0nKcF2w2DGJnKHh51N8'
      let viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
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
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer?f=jsapi'
        }),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addPath (viewer) {
      // 起始时间
      let start = Cesium.JulianDate.now()
      // 结束时间
      let stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate())
      // 设置时钟开始时间
      viewer.clock.startTime = start.clone()
      // 设置始终停止时间
      viewer.clock.stopTime = stop.clone()
      // 设置时钟当前时间
      viewer.clock.currentTime = start.clone()
      // 循环执行,即为2，到达终止时间，重新从起点时间开始
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
      // 时间速率，数字越大时间过的越快
      viewer.clock.multiplier = 10
      // 时间轴
      viewer.timeline.zoomTo(start, stop)
      function computePath (lon, lat) {
        let property = new Cesium.SampledPositionProperty()
        for (let i = 0; i < 10; i++) {
          let time = Cesium.JulianDate.addSeconds(start, i * 60, new Cesium.JulianDate())
          let position = Cesium.Cartesian3.fromDegrees(lon, lat + i * 0.1, 1750)
          property.addSample(time, position)
        }
        return property
      }
      let position = computePath(-120, 40)

      let path = viewer.entities.add({
        position: position, // 这里的position为new Cesium.SampledPositionProperty
        orientation: new Cesium.VelocityOrientationProperty(position), // 根据所提供的速度计算模型的朝向
        /* viewFrom: new Cesium.Cartesian3(0.0, 0.0, 0.0), */
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ // 和时间轴关联
          start: start,
          stop: stop
        })]),
        model: {
          uri: 'http://localhost:8888/Apps/SampleData/models/CesiumAir/Cesium_Air.glb'
        },
        path: {
          resolution: 600, // 指定在对该位置进行采样时要移动的最大秒数
          leadTime: 0, // 显示path前面的秒数
          trailTime: 1, // 显示path尾部的秒数
          material: new Cesium.PolylineGlowMaterialProperty({ // 发光线
            glowPower: 1,
            color: Cesium.Color.ORANGE
          }),
          width: 3
        }
      })
      viewer.trackedEntity = path
    }
  }
}
</script>
