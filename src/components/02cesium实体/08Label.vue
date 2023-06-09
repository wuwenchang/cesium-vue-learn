<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import billboard from './images/ganhan.png'
export default {
  name: 'Label',
  mounted () {
    let viewer = this.initCesium()

    this.addLabel(viewer)
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
    addLabel (viewer) {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300.0),
        point: {
          color: Cesium.Color.RED,    // 点位颜色
          pixelSize: 10                // 像素点大小
        },
        label: {
          pixelOffset: new Cesium.Cartesian2(155, -97), // 偏移量
          text: 'Hello Cesium\nLabelGraphics', // 文本内容，\n标识换行
          font: '14pt Source Han Sans CN', // 字体样式
          fillColor: Cesium.Color.BLACK, // 字体颜色
          backgroundColor: Cesium.Color.RED, // 背景颜色
          showBackground: true, // 是否显示背景颜色
          style: Cesium.LabelStyle.FILL, // label样式
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 水平位置
          pixelOffset: new Cesium.Cartesian2(10, 0)// 偏移
        }
      })
    }
  }
}
</script>
