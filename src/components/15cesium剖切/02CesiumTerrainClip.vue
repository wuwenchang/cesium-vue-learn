<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
// import YanShi from './images/YanShi.jpeg'
import ZhuanKuai from './images/ZhuanKuai.jpeg'

let points = []
let polygon = null
export default {
  name: 'CesiumTerrainClip',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addCesiumTerrainClip(viewer)
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
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
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
    addCesiumTerrainClip (viewer) {
      /**
         * https://blog.csdn.net/renkangever/article/details/109739366
           https://www.cnblogs.com/wanghui2011/articles/12924464.html
         * @type {Globe|*|globe|{get, set}|{get}}
         */
      let globe = viewer.scene.globe

      // 定义canvas屏幕点击事件
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      // 注册鼠标事件,event参数是点击的地方是在哪里
      handler.setInputAction((event) => {
        let pickRay = viewer.camera.getPickRay(event.position)
        var position = globe.pick(pickRay, viewer.scene)
        points.push(position)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 注册鼠标事件,event参数是点击的地方是在哪里
      handler.setInputAction((event) => {
        if (polygon) {
          viewer.entities.remove(polygon)
        }
        let hierarchy = []
        let clippingPlanes = []
        for (let i = 0; i < points.length; i++) {
          let point = points[i]
          // 将笛卡尔坐标转化为弧度坐标
          var cartographic = Cesium.Cartographic.fromCartesian(point)
          // 将弧度坐标转换为经纬度坐标
          var longitude = Cesium.Math.toDegrees(cartographic.longitude) // 经度
          var latitude = Cesium.Math.toDegrees(cartographic.latitude) // 纬度
          var height = cartographic.height // 高度
          hierarchy.push(longitude)
          hierarchy.push(latitude)
          hierarchy.push(height)
        }
        polygon = viewer.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(hierarchy),
            material: new Cesium.ImageMaterialProperty({
              image: ZhuanKuai,
              repeat: new Cesium.Cartesian2(3.0, 3.0)
            }),
            closeTop: false, // 顶部不关闭
            extrudedHeight: 0,
            perPositionHeight: true // 使用每个位置的高度
          }
        })

        var pointsLength = points.length

        for (var i = 0; i < pointsLength; i++) {
          var nextIndex = (i + 1) % pointsLength

          var midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3())
          midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)

          var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3())
          var right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3())
          right = Cesium.Cartesian3.normalize(right, right)

          var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
          normal = Cesium.Cartesian3.normalize(normal, normal)

          var originCenteredPlane = new Cesium.Plane(normal, 0.0)
          var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint)

          clippingPlanes.push(new Cesium.ClippingPlane(normal, distance))
        }
        globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
          planes: clippingPlanes,
          edgeColor: Cesium.Color.RED,
          edgeWidth: 2.0,
          enabled: true,
          unionClippingRegions: false// 设置为true，即取并集,false 交集
        })
        // 初始化取点数据
        points.splice(0, points.length)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }

  }
}
</script>
