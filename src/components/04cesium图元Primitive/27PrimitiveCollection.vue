<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'PrimitiveCollection',
  mounted () {
    let viewer = this.initCesium()

    this.addPrimitiveCollection(viewer)
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
    addPrimitiveCollection (viewer) {
      // 方式一
      let box1 = new Cesium.BoxGeometry({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        maximum: new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
        minimum: new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)})
      let boxGeometry1 = Cesium.BoxGeometry.createGeometry(box1)

      let boxInstance1 = new Cesium.GeometryInstance({
        geometry: boxGeometry1,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883)), new Cesium.Cartesian3(0.0, 0.0, 1000000.0), new Cesium.Matrix4()),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id: 'bottom'
      })

      // 方式二

      let points = Cesium.AxisAlignedBoundingBox.fromPoints(Cesium.Cartesian3.fromDegreesArray([
        -72.0, 40.0,
        -70.0, 35.0,
        -75.0, 30.0,
        -70.0, 30.0,
        -68.0, 40.0
      ]))
      let boxGeometry2 = Cesium.BoxGeometry.fromAxisAlignedBoundingBox(points)

      let boxInstance2 = new Cesium.GeometryInstance({
        geometry: boxGeometry2,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN)
        },
        id: 'center'
      })

      // 方式三
      let box3 = Cesium.BoxGeometry.fromDimensions({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        dimensions: new Cesium.Cartesian3(500000.0, 500000.0, 500000.0)})
      let boxGeometry3 = Cesium.BoxGeometry.createGeometry(box3)

      let boxInstance3 = new Cesium.GeometryInstance({
        geometry: boxGeometry3,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883)), new Cesium.Cartesian3(0.0, 0.0, 3000000.0), new Cesium.Matrix4()),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE)
        },
        id: 'top'
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: [boxInstance1, boxInstance2, boxInstance3],
        asynchronous: false, // 是否采用多线程
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false,
          closed: true
        })
      })

      console.log(viewer.scene.primitives)
      viewer.scene.primitives.add(primitive)
    }
  }
}
</script>
