<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'Corridor',
  mounted () {
    let viewer = this.initCesium()

    this.addCorridor(viewer)
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
    addCorridor (viewer) {
      viewer.entities.add({
        name: 'corridor',
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -100.0, 40.0,
            -105.0, 40.0,
            -105.0, 35.0,
            -110.0, 35.0,
            -110.0, 40.0,
            -115.0, 45.0
          ]),
          width: 100000, // 宽度必须设置
          height: 200000, // 高度
          extrudedHeight: 2000, // 拉伸高度
          material: Cesium.Color.RED,
          cornerType: Cesium.CornerType.BEVELED, // 拐角样式
          granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定每个纬度和经度之间的距离
          zIndex: 0// 层级，当未定义height和extrudedHeight且道路为静态时才有效
        }
      })

      viewer.entities.add({
        name: 'corridor',
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -100.0, 40.0,
            -105.0, 40.0,
            -105.0, 35.0,
            -110.0, 35.0,
            -110.0, 40.0,
            -115.0, 40.0
          ]),
          width: 100000, // 宽度必须设置
          height: 200000, // 高度
          extrudedHeight: 2000, // 拉伸高度
          material: Cesium.Color.BLUE,
          cornerType: Cesium.CornerType.BEVELED, // 拐角样式
          granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定每个纬度和经度之间的距离
          zIndex: 1// 层级，当未定义height和extrudedHeight且道路为静态时才有效
        }
      })
    }
  }
}
</script>
