<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CesiumJulianDate',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addCesiumJulianDate(viewer)
  },
  methods: {
    initCesium: function () {
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
    addCesiumJulianDate (viewer) {
      // 使用JavaScript的Date创建JulianDate
      let current = Cesium.JulianDate.now(new Date())
      // let current=Cesium.JulianDate.fromDate(new Date());         //获取当前时间，由js中的UTC标准转换为TAI标准
      console.log(current.dayNumber, current.secondsOfDay)

      let addDays = Cesium.JulianDate.addDays(current, 1, new Cesium.JulianDate())
      console.log('添加天数：', addDays.dayNumber, addDays.secondsOfDay)
      let addHours = Cesium.JulianDate.addHours(current, 1, new Cesium.JulianDate())
      console.log('添加小时：', addHours.dayNumber, addHours.secondsOfDay)
      let addSeconds = Cesium.JulianDate.addSeconds(current, 1, new Cesium.JulianDate())
      console.log('添加秒数：', addSeconds.dayNumber, addSeconds.secondsOfDay)
      let compare = Cesium.JulianDate.compare(current, addDays)
      console.log('如果left小于right，则为负值；如果left大于right，则为正值；如果left和right相等，则为零 ：', compare)
      let daysDifference = Cesium.JulianDate.daysDifference(current, addDays)
      console.log('相差的天数：', daysDifference)
      let equals = Cesium.JulianDate.equals(current, addDays)
      console.log('比较两个时间是否相等：', equals)

      let equalsEpsilon = Cesium.JulianDate.equalsEpsilon(current, addDays, 86300)
      console.log('比较两个时间在公差范围是否相等：', equalsEpsilon)

      let fromIso8601 = Cesium.JulianDate.fromIso8601('2017-07-11T16:00:00Z', new Cesium.JulianDate())
      console.log('从 ISO 8601 日期开始创建新实例：', fromIso8601)

      let greaterThan = Cesium.JulianDate.greaterThan(current, addDays)
      console.log('如果 left 晚于 right ，则返回 true ，否则返回 false ：', greaterThan)
      let greaterThanOrEquals = Cesium.JulianDate.greaterThanOrEquals(current, addDays)
      console.log('如果 left 晚于或等于 right ，则返回 true ，否则返回 false ：', greaterThanOrEquals)

      let lessThan = Cesium.JulianDate.lessThan(current, addDays)
      console.log('如果 left 早于 right ，则返回 true ，否则返回 false ：', lessThan)
      let lessThanOrEquals = Cesium.JulianDate.lessThanOrEquals(current, addDays)
      console.log('如果 left 早于或等于 right ，则返回 true ，否则返回 false ：', lessThanOrEquals)

      let toDate = Cesium.JulianDate.toDate(current)
      console.log('创建JavaScript日期 ：', toDate)

      let toIso8601 = Cesium.JulianDate.toIso8601(current, 3)
      console.log('创建提供日期的ISO8601表示形式 ：', toIso8601)
    }
  }
}
</script>
