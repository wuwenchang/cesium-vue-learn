<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CameraFlyToBoundingSphere',
  mounted () {
    let viewer = this.initCesium()

    this.addCameraFlyToBoundingSphere(viewer)
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
    addCameraFlyToBoundingSphere (viewer) {
      var boundingSphere = null
      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then(function (tileset) {
        // 包围球
        boundingSphere = tileset.boundingSphere
      })

      let camera = viewer.scene.camera

      // 回到初始化的主视图
      setTimeout(() => {
        camera.flyToBoundingSphere(boundingSphere, {
          orientation: {
            heading: Cesium.Math.toRadians(0.0), // 方向
            pitch: Cesium.Math.toRadians(-30.0), // 倾斜角度
            roll: 0
          },
          duration: 5, // 设置飞行持续时间，默认会根据距离来计算
          complete: function () {
            // 到达位置后执行的回调函数
            console.log('到达目的地')
          },
          cancel: function () {
            // 如果取消飞行则会调用此函数
            console.log('飞行取消')
          },
          pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
          maximumHeight: 5000 // 相机最大飞行高度
          // flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
        })
      }, 5000)

      setTimeout(() => {
        camera.cancelFlight()
        console.log(camera)
      }, 6000)
    }
  }
}
</script>
