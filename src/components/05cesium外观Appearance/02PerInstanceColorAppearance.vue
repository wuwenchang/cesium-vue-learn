<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'PerInstanceColorAppearance',
  mounted () {
    let viewer = this.initCesium()

    this.addPerInstanceColorAppearance(viewer)
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
    addPerInstanceColorAppearance (viewer) {
      let instance = new Cesium.GeometryInstance({
        geometry: new Cesium.WallGeometry({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            109.0, 37.0, 10000.0,
            109.0, 38.0, 10000.0,
            105.0, 38.0, 10000.0,
            105.0, 37.0, 10000.0,
            109.0, 37.0, 10000.0
          ])
        }),
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 0.0, 0.2)
        }
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false, // 是否对透明有影响
          closed: false, // false 两面绘制，true单面绘制
          faceForward: false, // 为false，不收光照控制
          renderState: {
            depthTest: {
              enabled: true // 开启深度测试
            }
            /* cull : {
              enabled : true,
              face : Cesium.CullFace.BACK//只绘制背面
            } */

          }})
      })

      viewer.scene.primitives.add(primitive)

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105, 38.0, 20000),
        orientation: {// 设置相机的Heading，Pitch，Roll
          heading: Cesium.Math.toRadians(90.0),
          pitch: Cesium.Math.toRadians(-40),
          roll: 0.0
        },
        duration: 3
      })
    }
  }
}
</script>
