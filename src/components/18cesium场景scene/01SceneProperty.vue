<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'SceneProperty',
  mounted () {
    let viewer = this.initCesium()

    this.addSceneProperty(viewer)
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
    addSceneProperty (viewer) {
      // 只有天空盒关闭背景色才有效
      // viewer.scene.skyBox.show = false;
      // viewer.scene.backgroundColor = Cesium.Color.WHITE
      // viewer.scene.sun.show = false;
      // viewer.scene.moon.show = false;
      // //获取到相机
      // console.log(viewer.scene.camera)
      // console.log(viewer.scene.canvas)
      //
      // console.log(viewer.scene.drawingBufferHeight)
      // console.log(viewer.scene.drawingBufferWidth)
      // console.log(viewer.scene.imageryLayers)
      // viewer.scene.morphTime = 1.0
      // viewer.scene.morphTo2D()
      // viewer.scene.globe.show = false; // 不显示地球
      viewer.scene.useWebVR = true
    }
  }
}
</script>
