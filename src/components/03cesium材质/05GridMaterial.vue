<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'GridMaterial',
  mounted () {
    let viewer = this.initCesium()

    this.addGridMaterial(viewer)
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
    addGridMaterial (viewer) {
      let entity = viewer.entities.add({
        name: 'plane',
        position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
        plane: {
          plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 100000.0), // 指定平面的法线和距离
          dimensions: new Cesium.Cartesian2(400000.0, 300000.0), // 指定平面的宽度和高度。
          material: new Cesium.GridMaterialProperty({
            color: Cesium.Color.YELLOW, // 网格颜色
            cellAlpha: 0.2, // 单元格透明度
            lineCount: new Cesium.Cartesian2(8, 8), // 行列个数
            lineThickness: new Cesium.Cartesian2(2.0, 2.0), // 线粗细
            lineOffset: new Cesium.Cartesian2(2.0, 2.0)// 线偏移
          })
        }
      })
      console.log(entity.plane.material)
      viewer.zoomTo(viewer.entities)
    }
  }
}
</script>
