<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'RectangleOutlineGeometry',
  mounted () {
    let viewer = this.initCesium()

    this.addRectangleOutlineGeometry(viewer)
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
    addRectangleOutlineGeometry (viewer) {
      // 1. create a rectangle
      let rectangle1 = new Cesium.RectangleOutlineGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: Cesium.Rectangle.fromDegrees(-80.0, 39.0, -74.0, 42.0),
        height: 10000.0
      })
      let geometry1 = Cesium.RectangleOutlineGeometry.createGeometry(rectangle1)

      let rectangleInstance1 = new Cesium.GeometryInstance({
        geometry: geometry1,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE)
        },
        id: 'ellipsoidInstance1'
      })

      // 2. create an extruded rectangle without a top
      let rectangle2 = new Cesium.RectangleOutlineGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: Cesium.Rectangle.fromDegrees(-80.0, 39.0, -74.0, 42.0),
        height: 200000.0,
        extrudedHeight: 300000
      })
      let geometry2 = Cesium.RectangleOutlineGeometry.createGeometry(rectangle2)

      let rectangleInstance2 = new Cesium.GeometryInstance({
        geometry: geometry2,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id: 'ellipsoidInstance2'
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: [rectangleInstance1, rectangleInstance2],
        asynchronous: false, // 是否采用多线程
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false, // 半透明
          flat: true// 当 true 时，片段着色器中将使用平面阴影，这意味着不考虑光照
        })
      })

      viewer.scene.primitives.add(primitive)
    }
  }
}
</script>
