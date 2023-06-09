<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import Circle from './images/Circle.png'

export default {
  name: 'CallbackProperty',
  mounted () {
    let viewer = this.initCesium()

    this.addCallbackProperty(viewer)
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
    addCallbackProperty (viewer) {
      let result = new Cesium.Cartesian3(0, 0, 0)
      let longitude = 80.0
      let latitude = 40.0
      let height = 300000.0

      function changePosition () {
        longitude += 0.1
        if (longitude > 150.0) {
          longitude = 80.0
        }
        result = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
        return result
      }

      let entity = viewer.entities.add({
        name: 'Blue box',
        position: new Cesium.CallbackProperty(changePosition, false),
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 200000.0), // 尺寸，长宽高
          material: Cesium.Color.BLUE, // 材质
          fill: true, // 是否填充
          shadows: Cesium.ShadowMode.ENABLED// 开启接收并且投射阴影
        }
      })

      viewer.clock.onTick.addEventListener(function (clock) {
        var position = entity.position.getValue(clock.currentTime)
        console.log(position)
      })
    }
  }
}
</script>
