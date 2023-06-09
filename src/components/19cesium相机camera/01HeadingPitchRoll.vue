<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'HeadingPitchRoll',
  mounted () {
    let viewer = this.initCesium()

    this.addHeadingPitchRoll(viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg4ZjljZC1mZGM3LTRlZjEtYjg3MC00MjZkNGU3YjI5ZWUiLCJpZCI6MTU5NTIsImlhdCI6MTYwNTE0ODM5OX0.LjxeKrgAo7Ksk8405kSAhYwF0nKcF2w2DGJnKHh51N8'
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url:
            'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
        }),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addHeadingPitchRoll (viewer) {
      let position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706,
        10000
      )
      let heading = Cesium.Math.toRadians(-90) // 航向
      let pitch = Cesium.Math.toRadians(90) // 俯仰角
      let roll = Cesium.Math.toRadians(90) // 翻滚角
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      )
      // 控制的是实体方向
      let entity = viewer.entities.add({
        name: 'model',
        position: position,
        orientation: orientation,
        model: {
          uri:
            'http://localhost:8888/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
          // 模型最小刻度
          scale: 5, // 缩放
          minimumPixelSize: 32, // 指定模型的最小最小像素大小，而不考虑缩放
          maximumSize: 128, // 模型的最大比例尺大小。 minimumPixelSize的上限
          runAnimations: true, // 指定是否应启动模型中指定的glTF动画
          clampAnimations: true, // 指定glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
          silhouetteColor: Cesium.Color.fromAlpha(Cesium.Color.BLUE, 1), // 模型轮廓颜色与透明度
          silhouetteSize: 3, // 模型轮廓大小
          maximumScale: 200, // 设置模型最大放大大小
          color: Cesium.Color.YELLOWGREEN, // 指定与模型的渲染颜色混合的 Color
          show: true, // 模型是否可见
          colorBlendMode: Cesium.ColorBlendMode.MIX, // 颜色混合模式
          colorBlendAmount: 0.6 // 颜色混合比例
        }
      })
      viewer.trackedEntity = entity
    }
  }
}
</script>
