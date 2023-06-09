<template>
    <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'Cesium3DTileFeature',
  data () {
    return {}
  },

  mounted () {
    let viewer = this.initCesium()

    this.addCesium3DTileFeature(viewer)
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

    addCesium3DTileFeature (viewer) {
      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then(function (tileset) {
        // 将笛卡尔坐标转化为弧度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
        // 将弧度坐标转换为经纬度坐标
        var longitude = Cesium.Math.toDegrees(cartographic.longitude) // 经度
        var latitude = Cesium.Math.toDegrees(cartographic.latitude) // 纬度

        var distanceStyle = new Cesium.Cesium3DTileStyle({
          defines: {
            distance:
              "distance(vec2(${feature['Longitude']}, ${feature['Latitude']}), vec2(" + longitude + ',' + latitude + '))'
          },
          color: {
            conditions: [
              ['${distance} < 0.00001', "color('blue')"],
              ['${distance} > 0.00002', "color('green')"],
              ['${distance} < 0.00003', "color('yellow')"],
              ['${distance} < 0.00004', "color('red')"],
              ['true', "color('white')"]
            ]
          }
        })

        tileset.style = distanceStyle
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0))
      })

      // 高亮显示代码
      var previousPickedEntity = {
        feature: undefined,
        originalColor: undefined
      }

      var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

      /* viewer.screenSpaceEventHandler */handler.setInputAction(function (movement) {
        debugger
        var pickingEntity = viewer.scene.pick(movement.position)
        // 判断选择是否为Cesium3DTileFeature

        if (pickingEntity instanceof Cesium.Cesium3DTileFeature) {
          var propertyNames = pickingEntity.getPropertyNames()
          var length = propertyNames.length
          for (var i = 0; i < length; ++i) {
            var propertyName = propertyNames[i]
            console.log(propertyName + ': ' + pickingEntity.getProperty(propertyName))
          }
          // 判断以前是否选择要素
          if (pickingEntity != previousPickedEntity.feature) {
            if (previousPickedEntity.feature != undefined) {
              // 还原前选择要素的本颜色
              previousPickedEntity.feature.color = previousPickedEntity.originalColor
              // 将当前选择要素及其颜色添加到previousPickedEntity
              previousPickedEntity.feature = pickingEntity
              previousPickedEntity.originalColor = pickingEntity.color
            }
            // 将当前选择要素及其颜色添加到previousPickedEntity
            previousPickedEntity.feature = pickingEntity
            previousPickedEntity.originalColor = pickingEntity.color
          }
          // 将模型变为黄色高亮
          pickingEntity.color = Cesium.Color.YELLOW
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
}
</script>
