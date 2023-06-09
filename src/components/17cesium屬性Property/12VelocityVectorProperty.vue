<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import billboard from './images/billboard.jpg'

export default {
  name: 'PropertyArray',
  mounted () {
    let viewer = this.initCesium()

    this.addVelocityVectorProperty(viewer)
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
    addVelocityVectorProperty (viewer) {
      let result = new Cesium.Cartesian3(0, 0, 0)
      let longitude = 80.0
      let latitude = 10.0
      let height = 3000.0

      function changePosition () {
        longitude += 0.1
        latitude += 0.1
        if (longitude > 150.0) {
          longitude = 80.0
        }
        if (latitude > 80.0) {
          latitude = 10.0
        }
        result = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
        return result
      }

      // billboard的特性是无论地球怎么选择，billboard都会对准视角，
      // 也就是会随着场景的旋转移动来改变自身的朝向
      let entity = viewer.entities.add({
        id: 1, // id不能重复
        name: 'billboard', // 可以重复
        position: new Cesium.CallbackProperty(changePosition, false), // 指定经纬度来确定世界坐标的位置
        point: {
          color: Cesium.Color.RED, // 点位颜色
          pixelSize: 10 // 像素点大小
        },
        billboard: {
          image: billboard,
          show: true, // 是否显示
          scale: 1, // 放大倍数
          horizontalOrigin: Cesium.HorizontalOrigin.RIGHT, // 相对于对象的原点的水平位置
          verticalOrigin: Cesium.VerticalOrigin.TOP, // 相对于对象的原点的垂直位置
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // 表示相对于地形的位置。CLAMP_TO_GROUND 位置固定在地形上。RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
          color: Cesium.Color.YELLOW.withAlpha(0.8), // 指定图像的颜色
          // rotation:Cesium.Math.PI_OVER_TWO,//旋转角度
          width: 96, // 广告牌的宽度，覆盖之前默认的像素值
          height: 96, // 广告牌的高度，覆盖之前默认的像素值
          disableDepthTestDistance: Number.POSITIVE_INFINITY// 获取或设置与相机的距离，在深度处禁用深度测试,Number.POSITIVE_INFINITY无穷大，不会应用深度测试，0始终应用深度测试，应用深度测试避免地形的遮挡

        }
      })
      // billboard旋转轴
      entity.billboard.alignedAxis = new Cesium.VelocityVectorProperty(entity.position, true)

      viewer.trackedEntity = entity
    }
  }
}
</script>
