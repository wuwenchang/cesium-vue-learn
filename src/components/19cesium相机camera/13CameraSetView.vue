<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CameraSetView',
  mounted () {
    let viewer = this.initCesium()

    this.addCameraSetView(viewer)
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
    addCameraSetView (viewer) {
      let camera = viewer.scene.camera
      setTimeout(() => {
        // 设置视图的位置
        // camera.setView({
        //   destination : Cesium.Cartesian3.fromDegrees(116.38971057, 39.90454564, 500)
        // });
        // 设置视图位置与 heading, pitch and roll
        // viewer.camera.setView({
        //   destination : Cesium.Cartesian3.fromDegrees(116.38971057, 39.90454564, 500),
        //   orientation: {
        //     heading : Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
        //     pitch : Cesium.Math.toRadians(-40),    // default value (looking down)
        //     roll : 0.0                             // default value
        //   }});
        // 设置视图 heading, pitch and roll
        // camera.setView({
        //   orientation: {
        //     heading : Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
        //     pitch : Cesium.Math.toRadians(-90),    // default value (looking down)
        //     roll : 0.0                             // default value
        //   }});

        // 设置视图 rectangle
        // viewer.camera.setView({
        //   destination : Cesium.Rectangle.fromDegrees(116.389710570, 39.90454560, 116.389710575, 39.90454564)
        // });

        // 设置视图的位置，朝向使用向量设置
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
          orientation: {
            direction: new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
            up: new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
          }})
      }, 5000)
    }
  }
}
</script>
