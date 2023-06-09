<template>
    <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'Cesium3DTile',
  data () {
    return {}
  },

  mounted () {
    let viewer = this.initCesium()

    this.addCesium3DTile(viewer)
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      viewer.scene.globe.depthTestAgainstTerrain = false// why
      viewer.scene.logarithmicDepthBuffer = true// why
      return viewer
    },

    addCesium3DTile (viewer) {
      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then(function (tileset) {
        let heightOffset = 1000
        // 包围球
        var boundingSphere = tileset.boundingSphere
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center)
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset)
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
        let fromTranslation = Cesium.Matrix4.fromTranslation(translation)
        tileset.modelMatrix = fromTranslation

        // 获取到Cesium3DTile的根
        let cesium3dTile = tileset._root
        // 获取到自身的变换矩阵
        let computedMatrix = cesium3dTile.computedTransform
        // 获取到自身的本地变换矩阵
        let transformMatrix = cesium3dTile.transform
        // 获取到父级
        let parent = cesium3dTile.parent
        // 获取到子级
        let children = cesium3dTile.children
        console.log(fromTranslation)
        console.log(computedMatrix)
        console.log(transformMatrix)
        console.log(parent)
        console.log(children)
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0))
      })
    }
  }
}
</script>
