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
      let data = {
        deviationR: 20,
        maxR: 2000,
        minR: 0,
        eachInterval: 2000,
        rotation: 90
      }
      var r1 = data.minR, r2 = data.minR

      function changeR1 () { // 这是callback，参数不能内传
        r1 = r1 + data.deviationR
        if (r1 >= data.maxR) {
          r1 = data.minR
        }

        return r1
      }
      function changeR2 () {
        r2 = r2 + data.deviationR
        if (r2 >= data.maxR) {
          r2 = data.minR
        }
        return r2
      }
      let entity = viewer.entities.add({
        name: '扩大圈',
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 0.0),
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(changeR1, false), // 每次回调函数返回相同值时，为 true ，如果值将更改，则为 false
          semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
          height: 1000,
          material: new Cesium.ImageMaterialProperty({
            image: Circle,
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: true,
            color: new Cesium.CallbackProperty(function () {
              var alp = 1 - r1 / data.maxR
              return Cesium.Color.WHITE.withAlpha(alp) // entity的颜色透明 并不影响材质，并且 entity也会透明
            }, false)
          })
        }
      })
      viewer.trackedEntity = entity
    }
  }
}
</script>
