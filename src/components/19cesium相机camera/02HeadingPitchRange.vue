<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'HeadingPitchRange',
  mounted () {
    let viewer = this.initCesium()

    this.addHeadingPitchRange(viewer)
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
    addHeadingPitchRange (viewer) {
      // Example 2. Create model and provide all properties and events
      var origin = Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 200000.0)
      var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

      var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url: 'http://localhost:8888/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
        show: true, // default
        modelMatrix: modelMatrix,
        scale: 2.0, // double size
        minimumPixelSize: 128, // never smaller than 128 pixels
        maximumScale: 20000, // never larger than 20000 * model size (overrides minimumPixelSize)
        allowPicking: false, // not pickable
        debugShowBoundingVolume: false, // default
        debugWireframe: false
      }))

      model.readyPromise.then(function (model) {
        // Play all animations when the model is ready to render
        model.activeAnimations.addAll({
          multiplier: 1.0, // Play at half-speed
          loop: Cesium.ModelAnimationLoop.REPEAT // Loop the animations
        })

        // 控制的是相机的方向
        let hpRange = new Cesium.HeadingPitchRange()
        hpRange.heading = Cesium.Math.toRadians(90)// 航向
        hpRange.pitch = Cesium.Math.toRadians(-40)
        hpRange.range = model.boundingSphere.radius * 2.5
        var center = Cesium.Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center, new Cesium.Cartesian3())
        viewer.camera.lookAt(center, hpRange)
      })
    }
  }
}
</script>
