<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'GroundPolylineGeometry',
  mounted () {
    let viewer = this.initCesium()

    this.addGroundPolylineGeometry(viewer)
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
    addGroundPolylineGeometry (viewer) {
      let instance2 = new Cesium.GeometryInstance({
        geometry: new Cesium.GroundPolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray([
            -112.1340164450331, 36.05494287836128,
            -112.08821010582645, 36.097804071380715,
            -112.13296079730024, 36.168769146801104
          ]),
          loop: true,
          width: 10.0
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('Yellow').withAlpha(1.0)),
          distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0, 30000)
        },
        id: 'object returned when this instance is picked and to get/set per-instance attributes'
      })
      let groundPolylinePrimitive2 = new Cesium.GroundPolylinePrimitive({
        geometryInstances: instance2,
        appearance: new Cesium.PolylineColorAppearance()
      })
      viewer.scene.primitives.add(groundPolylinePrimitive2)
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-112.1340164450331, 36.05494287836128, 2000),
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
