<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import ellipse from './images/ellipse.jpg'
export default {
  name: 'Ellipse',
  mounted () {
    let viewer = this.initCesium()

    this.addEllipse(viewer)
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
    addEllipse (viewer) {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-111.0, 40.0, 150000.0),
        name: 'ellipse',
        ellipse: {
          semiMinorAxis: 300000.0, // 短半轴
          semiMajorAxis: 300000.0, // 长半轴,注意长半轴和短半轴相等才是圆
          height: 200000.0,
          material: Cesium.Color.GREEN,
          rotation: Cesium.Math.PI_OVER_FOUR
        }
      })

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 150000.0),
        name: 'ellipse',
        ellipse: {
          semiMinorAxis: 200000.0, // 短半轴,注意短半轴如果比长半轴短就是椭圆
          semiMajorAxis: 300000.0, // 长半轴,注意长半轴如果比短半轴短就会报错
          height: 200000.0,
          material: ellipse,
          rotation: Cesium.Math.toRadians(90), // 实体旋转旋转90度
          stRotation: Cesium.Math.toRadians(90)// 纹理旋转90度,注意纹理旋转要与实体旋转同步
        }
      })
    }
  }
}
</script>
