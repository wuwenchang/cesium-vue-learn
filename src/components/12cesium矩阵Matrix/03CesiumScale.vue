<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CesiumScale',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.add3DTileset(viewer)
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
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer?f=jsapi'
        }),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    add3DTileset (viewer) {
      let box1 = new Cesium.BoxGeometry({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        maximum: new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
        minimum: new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)})
      let boxGeometry1 = Cesium.BoxGeometry.createGeometry(box1)

      let boxInstance1 = new Cesium.GeometryInstance({
        geometry: boxGeometry1,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883)), new Cesium.Cartesian3(0.0, 0.0, 0.0), new Cesium.Matrix4()),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id: 'bottom'
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: [boxInstance1],
        asynchronous: false, // 是否采用多线程
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false,
          closed: true
        })
      })

      // 方式一创建缩放矩阵

      const scaleMat41 = Cesium.Matrix4.fromArray([
        1.0, 0.0, 0.0, 0.0,
        0.0, 2.0, 0, 0.0,
        0.0, 0, 1.0, 0.0,
        0, 0, 0, 1.0
        // 2000000, 2000000, 2000000, 1.0
      ])

      const scaleMat44 = Cesium.Matrix4.fromArray([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0, 0.0,
        0.0, 0, 1.0, 0.0,
        1000000, 1000000, 1000000, 1.0
        // 2000000, 2000000, 2000000, 1.0
      ])

      // 方式二创建缩放矩阵
      var scaleMat42 = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1.0, 2.0, 3.0))

      let modelMatrix = boxInstance1.modelMatrix
      let matrix4 = new Cesium.Matrix4()
      Cesium.Matrix4.multiply(modelMatrix, scaleMat41, matrix4)
      Cesium.Matrix4.multiply(matrix4, scaleMat44, matrix4)
      Cesium.Matrix4.multiply(matrix4, scaleMat44, matrix4)

      boxInstance1.modelMatrix = matrix4
      viewer.scene.primitives.add(primitive)
    }

  }
}
</script>
