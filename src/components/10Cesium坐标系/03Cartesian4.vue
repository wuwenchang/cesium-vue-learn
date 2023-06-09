<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import YanShi from './images/YanShi.jpeg'
import ZhuanKuai from './images/ZhuanKuai.jpeg'

export default {
  name: 'Cartesian4',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addCartesian4(viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlOTExNTU4NC1lMDFlLTRiYTYtOTRmZi0zNDAwZWFjMjMxNDAiLCJpZCI6MTU5NTIsImlhdCI6MTYwNjY0MDc4MH0.DEgc4-h5oyP530dPxa1YKpXqzCAzUagibRB9bHm5QQs'
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
        terrainProvider: new Cesium.CesiumTerrainProvider({// 地质开挖必须是cesium提供的地形
          url: Cesium.IonResource.fromAssetId(1),
          requestVertexNormals: true, // 顶点法线效果
          requestWaterMask: true// 水效果
        })
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      // 地质开挖不能有深度测试，有深度测试会被遮盖
      viewer.scene.globe.depthTestAgainstTerrain = false
      return viewer
    },
    addCartesian4 (viewer) {

    }

  }
}
</script>
