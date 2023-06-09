<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'GroundPrimitive',
  mounted () {
    let viewer = this.initCesium()

    this.addGroundPrimitive(viewer)
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
    addGroundPrimitive (viewer) {
      let rectangleInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(-140.0, 30.0, -100.0, 40.0)
        }),
        id: 'rectangle',
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5)
        }
      })

      let color = new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5) // Both instances must have the same color.

      let ellipseInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.EllipseGeometry({
          center: Cesium.Cartesian3.fromDegrees(-115.0, 50.0),
          semiMinorAxis: 300000.0,
          semiMajorAxis: 400000.0
        }),
        id: 'ellipse',
        attributes: {
          color: color
        }
      })

      let groundPrimitive = new Cesium.GroundPrimitive({
        geometryInstances: [rectangleInstance, ellipseInstance]
      })
      viewer.scene.primitives.add(groundPrimitive)

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-115.0, 50.0, 1000),
        orientation: {// 设置相机的Heading，Pitch，Roll
          heading: Cesium.Math.toRadians(90.0),
          pitch: Cesium.Math.toRadians(-20),
          roll: 0.0
        },
        duration: 3
      })
    }
  }
}
</script>
