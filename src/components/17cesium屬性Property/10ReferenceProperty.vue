<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import Circle from './images/Circle.png'

export default {
  name: 'ReferenceProperty',
  mounted () {
    let viewer = this.initCesium()

    this.addReferenceProperty(viewer)
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
        clock: new Cesium.Clock(),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addReferenceProperty (viewer) {
      let blueEntity = viewer.entities.add({
        id: 'blueBox',
        name: 'Blue box',
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 200000.0), // 尺寸，长宽高
          material: Cesium.Color.BLUE, // 材质
          fill: true, // 是否填充
          shadows: Cesium.ShadowMode.ENABLED// 开启接收并且投射阴影
        }
      })

      let redEntity = viewer.entities.add({
        id: 'redBox',
        name: 'Red box',
        position: Cesium.Cartesian3.fromDegrees(-120.0, 40.0, 300000.0),
        box: {
          // dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 200000.0),//尺寸，长宽高
          material: Cesium.Color.RED, // 材质
          fill: true, // 是否填充
          shadows: Cesium.ShadowMode.ENABLED// 开启接收并且投射阴影
        }
      })

      var collection = viewer.entities
      redEntity.box.dimensions = new Cesium.ReferenceProperty(collection, blueEntity.id, ['box', 'dimensions'])
    }
  }
}
</script>
