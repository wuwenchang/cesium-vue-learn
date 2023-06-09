<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'PolylineArrowMaterial',
  mounted () {
    let viewer = this.initCesium()

    this.addPolylineArrowMaterial(viewer)
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
    addPolylineArrowMaterial (viewer) {
      viewer.entities.add({
        name: 'Red line on terrain',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            90.82436,
            38.071506,
            112.82742,
            23.067512
          ]),
          width: 20,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
          depthFailMaterial: Cesium.Color.BLUE, // 位于地下的材质,不给地下的材质，位于地下的线就不可见
          clampToGround: false, // 折线固定在地面
          arcType: Cesium.ArcType.GEODESIC// 定义连接点采用的路径
        }
      })
      viewer.zoomTo(viewer.entities)
    }
  }
}
</script>
