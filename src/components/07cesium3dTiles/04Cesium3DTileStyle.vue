<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'Cesium3DTileStyle',
  data () {
    return {}
  },

  mounted () {
    let viewer = this.initCesium()

    this.addCesium3DTileStyle(viewer)
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      viewer.scene.globe.depthTestAgainstTerrain = false// why
      viewer.scene.logarithmicDepthBuffer = true// why
      return viewer
    },

    addCesium3DTileStyle (viewer) {
      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then((tileset) => {
        // 自定义统一的透明颜色
        var transparentStyle = new Cesium.Cesium3DTileStyle({
          color: "color('white', 0.3)",
          show: true
        })

        // 查看属性信息
        var properties = tileset.properties
        if (Cesium.defined(properties)) {
          for (var name in properties) {
            console.log(properties[name])
          }
        }
        // 使用特定于每个特征的属性来确定颜色值
        var heightStyle = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [
              ['${Height} >= 100', 'rgba(45, 0, 75, 0.5)'],
              ['${Height} >= 75', 'rgb(102, 71, 151)'],
              ['${Height} >= 50', 'rgb(170, 162, 204)'],
              ['${Height} >= 35', 'rgb(224, 226, 238)'],
              ['${Height} >= 25', 'rgb(252, 230, 200)'],
              ['${Height} >= 10', 'rgb(248, 176, 87)'],
              ['${Height} >= 5', 'rgb(198, 106, 11)'],
              ['true', 'rgb(127, 59, 8)']
            ]
          }
        })

        console.log(tileset.boundingSphere.center)
        // 将笛卡尔坐标转化为弧度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
        // 将弧度坐标转换为经纬度坐标
        var longitude = Cesium.Math.toDegrees(cartographic.longitude) // 经度
        var latitude = Cesium.Math.toDegrees(cartographic.latitude) // 纬度
        var distanceStyle = new Cesium.Cesium3DTileStyle({
          defines: {
            distance:
              'distance(vec2(${Longitude}, ${Latitude}), vec2(' + longitude + ',' + latitude + '))'
          },
          color: {
            conditions: [
              ['${distance} > 0.00001', "color('blue')"],
              ['${distance} < 0.00002', "color('green')"],
              ['${distance} < 0.00003', "color('yellow')"],
              ['${distance} < 0.00004', "color('red')"],
              ['true', "color('white')"]
            ]
          }
        })

        var style = new Cesium.Cesium3DTileStyle()
        style.anchorLineEnabled = 'true'
        // Override anchorLineColor expression with a condition
        style.anchorLineColor = {
          conditions: [
            ['${Height} >2', 'color("cyan")'],
            ['true', 'color("blue")']
          ]
        }
        tileset.style = style
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0))
      })
    }
  }
}
</script>
