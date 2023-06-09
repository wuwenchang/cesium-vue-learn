<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PolygonGeometry',
  mounted () {
    let viewer = this.initCesium()

    this.addPolygonGeometry(viewer)
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
    addPolygonGeometry (viewer) {
      let polygon1 = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            -109.0, 30.0,
            -95.0, 30.0,
            -95.0, 40.0,
            -109.0, 40.0
          ]),
          [new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray([
              -107.0, 31.0,
              -107.0, 39.0,
              -97.0, 39.0,
              -97.0, 31.0
            ]),
            [new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray([
                -105.0, 33.0,
                -99.0, 33.0,
                -99.0, 37.0,
                -105.0, 37.0
              ]),
              [new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray([
                  -103.0, 34.0,
                  -101.0, 34.0,
                  -101.0, 36.0,
                  -103.0, 36.0
                ])
              )]
            )]
          )]
        )
      })
      let geometry1 = Cesium.PolygonGeometry.createGeometry(polygon1)

      let polygonInstance1 = new Cesium.GeometryInstance({
        geometry: geometry1,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE)
        },
        id: 'polygonInstance1'
      })

      // create a polygon from points
      let polygon2 = Cesium.PolygonGeometry.fromPositions({
        positions: Cesium.Cartesian3.fromDegreesArray([
          -72.0, 40.0,
          -70.0, 35.0,
          -75.0, 30.0,
          -70.0, 30.0,
          -68.0, 40.0
        ]),
        extrudedHeight: 300000
      })
      let geometry2 = Cesium.PolygonGeometry.createGeometry(polygon2)

      let polygonInstance2 = new Cesium.GeometryInstance({
        geometry: geometry2,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id: 'polygonInstance2'
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: [polygonInstance1, polygonInstance2],
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
