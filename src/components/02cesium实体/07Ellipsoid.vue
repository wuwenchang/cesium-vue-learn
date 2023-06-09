<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import ellipse from './images/ellipse.jpg'
export default {
  name: 'Ellipsoid',
  mounted () {
    let viewer = this.initCesium()

    this.addEllipsoid(viewer)
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
    addEllipsoid (viewer) {
      viewer.entities.add({
        name: 'Blue sphere',
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0), // 用于指定椭球的半径，三个方向半径不相等就是椭球体
          material: Cesium.Color.BLUE
        }
      })

      viewer.entities.add({
        name: 'Red sphere',
        position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(300000.0, 300000.0, 300000.0), // 用于指定椭球的半径,三个方向半径相等就是球形
          material: Cesium.Color.RED.withAlpha(0.5),
          innerRadii: new Cesium.Cartesian3(100000.0, 100000.0, 100000.0)// 球体的内半径，也就是挖掉内球
        }
      })

      viewer.entities.add({
        name: 'Yellow ellipsoid',
        position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0),
          fill: false,
          outline: true,
          outlineColor: Cesium.Color.YELLOW,
          slicePartitions: 64, // 指定径向切片数量
          stackPartitions: 64, // 指定堆栈数
          subdivisions: 256// 指定每个轮廓环的样本数，确定曲率的粒度
        }
      })
    }
  }
}
</script>
