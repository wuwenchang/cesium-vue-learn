<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'GeoJsonDataSource',
  mounted () {
    let viewer = this.initCesium()

    this.addGeoJsonDataSource(viewer)
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
        timeline: false,
        selectionIndicator: false, // 是否显示选取指示器组件
        shouldAnimate: false, // 自动播放动画控件
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
    addGeoJsonDataSource (viewer) {
      // 加载中国数据
      let promise1 = Cesium.GeoJsonDataSource.load('http://localhost:8888/Apps/SampleData/china.json', {
        fill: Cesium.Color.GREENYELLOW,
        markerSize: 10, // 给点使用的
        markerColor: Cesium.Color.RED, // 给点使用的
        stroke: Cesium.Color.RED, // 折线和多边形轮廓的颜色
        strokeWidth: 20, // 折线和多边形轮廓的宽度
        clampToGround: false// geojson的outline不能贴地,如果设置true，边框线将被禁用
      })

      promise1.then(function (dataSource) {
        viewer.dataSources.add(dataSource)
      }).otherwise(function (error) {
        console.log(error)
      })

      let promise2 = Cesium.GeoJsonDataSource.load('http://localhost:8888/Apps/SampleData/usa.topojson')
      promise2
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource)

          let entities = dataSource.entities.values

          let colorHash = {}
          for (let i = 0; i < entities.length; i++) {
            // 遍历所有的entity,随机给颜色
            let entity = entities[i]
            let name = entity.name
            let color = colorHash[name]
            if (!color) {
              color = Cesium.Color.fromRandom({
                alpha: 1.0
              })
              colorHash[name] = color
            }

            // Set the polygon material to our random color.
            entity.polygon.material = color
            // Remove the outlines.
            entity.polygon.outline = false

            // 根据人口给拉伸高度
            entity.polygon.extrudedHeight = entity.properties.Population / 50.0
          }
        })
        .otherwise(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
