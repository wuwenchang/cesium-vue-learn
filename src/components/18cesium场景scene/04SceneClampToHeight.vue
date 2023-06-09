<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'SceneClampToHeight',
  mounted () {
    let viewer = this.initCesium()

    this.addSceneClampToHeight(viewer)
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
    addSceneClampToHeight (viewer) {
      var start = new Cesium.Cartesian3(1214211.0985420858, -4735962.959214372, 4081229.5976894656)
      var end = new Cesium.Cartesian3(1215699.9457442, -4735655.319680445, 4081143.746460487)

      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        show: true, // 是否显示
        // modelMatrix://模型矩阵，用来做平移，旋转，缩放
        // clippingPlanes://剖切面
        backFaceCulling: true// 背面绘制
      })).readyPromise.then((tileset) => {
        // Position tileset
        let heightOffset = 0
        // 包围球
        var boundingSphere = tileset.boundingSphere
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center)
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset)
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        viewer.zoomTo(tileset)
      })
      // 插值500个点
      let count = 500
      let positions = []
      let heights = []
      for (let i = 0; i < count; i++) {
        positions.push(Cesium.Cartesian3.lerp(start, end, i / count, new Cesium.Cartesian3()))
      }
      viewer.entities.add({
        name: 'Red line on terrain',
        polyline: {
          positions: positions,
          width: 5,
          material: Cesium.Color.RED,
          depthFailMaterial: Cesium.Color.BLUE, // 位于地下的材质,不给地下的材质，位于地下的线就不可见
          clampToGround: true, // 折线固定在地面
          arcType: Cesium.ArcType.GEODESIC// 定义连接点采用的路径
        }
      })
      // 对单个位置采样
      let clampToHeight = viewer.scene.clampToHeight(positions[0])
      console.log(clampToHeight)
      // 3dtiles模型 高度多个位置采样
      viewer.scene.clampToHeightMostDetailed(positions).then(function (clamps) {
        for (let i = 0; i < clamps.length; i++) {
          console.log(clamps[i])
          if ((clamps[i])) {
            heights.push(Cesium.Cartographic.fromCartesian(clamps[i]).height)
          }
        }
        console.log(heights)
      })
    }
  }
}
</script>
