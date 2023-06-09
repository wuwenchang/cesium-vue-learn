<template>
  <div style="width: 100%;height: 100%">
    <div id="cesiumContainer"></div>
    <div id="toolbar">
      <video id="video" muted autoplay loop crossorigin controls>
        <source src="http://localhost:8888/video/kl.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CesiumVideo',
  data () {
    return {}
  },

  mounted () {
    let viewer = this.initCesium()

    this.addVideo(viewer)
  },
  methods: {
    initCesium: function () {
      let tdtUrl = 'https://t2.tianditu.com/'
      let token = 'a8717fe01f7e279e746360b988f4bfa'
      let subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
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

        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      let imgMap = new Cesium.UrlTemplateImageryProvider({
        url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
        subdomains: subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18
      })
      viewer.imageryLayers.addImageryProvider(imgMap)
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      viewer.scene.globe.depthTestAgainstTerrain = false// why
      viewer.scene.logarithmicDepthBuffer = true// why
      return viewer
    },

    addVideo (viewer) {
      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then(function (tileset) {
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0))
      })

      let vid = document.getElementById('video')
      viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
            /* 100.17405263300155, 41.02717587110589,
              100.17974749683258, 41.026804599888344,
              100.17761353130237, 41.024437670100184,
              100.17438314930104, 41.02427837056658, */
            -75.61624258093384, 40.04529252303976,
            -75.60840755744098, 40.044998364483384,
            -75.60974857977195, 40.04107654882398,
            -75.61456198007131, 40.041150985945414
          ])),
          material: vid,
          classificationType: Cesium.ClassificationType.TERRAIN
        }
      })
      /* viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(100.17761353130237, 41.024437670100184, 50.0),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
          }
        }); */

      new Cesium.VideoSynchronizer({
        clock: viewer.clock,
        element: vid
      })
      viewer.clock.shouldAnimate = true
      vid.style.display = 'none'

      // 定义canvas屏幕点击事件
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      // 注册鼠标事件,event参数是点击的地方是在哪里
      handler.setInputAction(function (event) {
        // 定义一个屏幕点击的事件，pickPosition封装的是获取点击的位置的坐标
        var position = viewer.scene.pickPosition(event.position)
        // 输出之后我们发现如前言所说的坐标都是笛卡尔坐标，所以我们需要转换笛卡尔坐标

        // 将笛卡尔坐标转化为弧度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(position)
        // 将弧度坐标转换为经纬度坐标
        var longitude = Cesium.Math.toDegrees(cartographic.longitude) // 经度
        var latitude = Cesium.Math.toDegrees(cartographic.latitude) // 纬度
        var height = cartographic.height // 高度
        console.log('经纬度：' + longitude, latitude, height)

        // 同时也可以将经度度转回为笛卡尔
        var ellipsoid = viewer.scene.globe.ellipsoid
        // 定义84坐标为一个Cartesian值
        var wgs84 = Cesium.Cartographic.fromDegrees(longitude, latitude, height)

        // 将84坐标转换为笛卡尔
        var dikaer = ellipsoid.cartographicToCartesian(wgs84)
        // 赋值
        var longitude = dikaer.x
        var latitude = dikaer.y
        var height = dikaer.z
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
}
</script>
