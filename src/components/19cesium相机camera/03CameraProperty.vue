<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CameraProperty',
  mounted () {
    let viewer = this.initCesium()

    this.addCameraProperty(viewer)
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
    addCameraProperty (viewer) {
      let camera = viewer.scene.camera
      // console.log(camera)
      // Cesium.Camera.DEFAULT_OFFSET
      // Cesium.Camera.DEFAULT_VIEW_FACTOR
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE
      // 相机旋转的限制轴
      // console.log(camera.constrainedAxis)
      // 相机的朝向
      // console.log(camera.direction)
      // console.log(camera.directionWC)
      // camera.direction = new Cesium.Cartesian3(0,0,1)

      // 相机的向上方向
      // console.log(camera.up)
      // console.log(camera.upWC)

      // 相机的向上方向
      // console.log(camera.position )
      // console.log(camera.positionWC)
      // console.log(camera.positionCartographic)

      // 获取摄像机的航向
      // console.log(camera.heading)
      // 获取摄像机的俯仰方向
      // console.log(camera.pitch)
      // 获取摄像机的翻滚方向
      // console.log(camera.roll)

      // 获取摄像机的正确方向
      // console.log(camera.right )
      // console.log(camera.rightWC)

      // 相机的视锥
      // console.log(camera.frustum)
      // 切换到正交相机
      // camera.switchToOrthographicFrustum()
      // console.log(camera.frustum)
      // var frustum = new Cesium.OrthographicFrustum();
      // var maxRadii = viewer.scene.globe.ellipsoid.maximumRadius;
      // frustum.aspectRatio  = viewer.scene.drawingBufferWidth/viewer.scene.drawingBufferHeight;
      // frustum.width  =viewer.scene.drawingBufferWidth;
      // frustum.near = 0.01 * maxRadii;
      // frustum.far = 50.0 * maxRadii;
      // camera.frustum = frustum

      // 获取相机转换逆矩阵
      // console.log(camera.inverseTransform)

      // 获取相机变换矩阵
      console.log(camera.transform)

      // 获取相机视图矩阵
      console.log(camera.viewMatrix)

      // 获取相机视图逆变换矩阵
      console.log(camera.inverseTransform)

      // 获取相机逆视图矩阵
      console.log(camera.inverseViewMatrix)
    }
  }
}
</script>
