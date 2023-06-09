<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CameraMethod',
  mounted () {
    let viewer = this.initCesium()

    this.addCameraMethod(viewer)
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
    addCameraMethod (viewer) {
      let camera = viewer.scene.camera

      let computeViewRectangle = camera.computeViewRectangle(viewer.scene.globe.ellipsoid)
      console.log(computeViewRectangle)

      let boundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(1000, 1000, 1000), 1000)
      let distanceToBoundingSphere = camera.distanceToBoundingSphere(boundingSphere)
      console.log(distanceToBoundingSphere)

      // 获取摄像机位置的大小
      let magnitude = camera.getMagnitude()
      console.log(magnitude)

      // 获取摄像机位置的大小
      let cartesian3 = new Cesium.Cartesian3(1000, 1000, 1000)
      let ray = camera.getPickRay(cartesian3)
      console.log(ray)

      // 获取查看整个rectangle相机所需要在的位置
      let rectangle = new Cesium.Rectangle(-Cesium.Math.PI, -Cesium.Math.PI_OVER_TWO, Cesium.Math.PI, Cesium.Math.PI_OVER_TWO)
      let rectangleCameraCoordinates = camera.getRectangleCameraCoordinates(rectangle)
      console.log(rectangleCameraCoordinates)

      // 把相机设置在包围球视口
      let headingPitchRange = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(90), Cesium.Math.toRadians(90), boundingSphere.radius * 2)
      camera.viewBoundingSphere(boundingSphere, headingPitchRange)
    }
  }
}
</script>
