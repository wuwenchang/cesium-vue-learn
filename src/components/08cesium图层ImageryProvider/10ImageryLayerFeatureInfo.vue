<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import image from './images/image.jpg'

export default {
  name: 'ImageryLayerFeatureInfo',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addImageryLayerFeatureInfo(viewer)
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
        }),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      viewer.scene.globe.depthTestAgainstTerrain = true
      return viewer
    },
    addImageryLayerFeatureInfo (viewer) {
      // 添加网格
      viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider())

      viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
        url: image,
        rectangle: Cesium.Rectangle.fromDegrees(
          110.0,
          20.0,
          80.0,
          35.0)
      }))

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction((event) => {
        let pickRay = viewer.camera.getPickRay(event.position)
        let featuresPromise = viewer.imageryLayers.pickImageryLayerFeatures(pickRay, viewer.scene)
        debugger
        if (!Cesium.defined(featuresPromise)) {
          console.log('No features picked.')
        } else {
          Cesium.when(featuresPromise, function (features) {
            if (features.length > 0) {
              let properties = features[0].properties
              // 请求查询图层数据
              console.log(features[0])
              console.log(properties)
            }
          })
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
}
</script>
