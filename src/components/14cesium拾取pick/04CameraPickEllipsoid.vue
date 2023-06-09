<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CameraPickEllipsoid',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addCameraPickEllipsoid(viewer)
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
        selectionIndicator: true, // 是否显示选取指示器组件
        shouldAnimate: false, // 自动播放动画控件
        shadows: true, // 是否显示光照投射的阴影
        terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, // 地质接收阴影
        sceneMode: Cesium.SceneMode.SCENE3D,
        clock: new Cesium.Clock(),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'})
        /* terrainProvider: new Cesium.CesiumTerrainProvider({//地质开挖必须是cesium提供的地形
            url: Cesium.IonResource.fromAssetId(1),
            requestVertexNormals: true,//顶点法线效果
            requestWaterMask: true,//水效果
          }), */
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      // 地质开挖不能有深度测试，有深度测试会被遮盖
      viewer.scene.globe.depthTestAgainstTerrain = false
      return viewer
    },
    addCameraPickEllipsoid (viewer) {
      viewer.entities.add({
        name: 'Blue box',
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 0.0),
        description: '<h1>Blue box</h1>',
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500.0), // 尺寸，长宽高
          material: Cesium.Color.BLUE, // 材质
          fill: true, // 是否填充
          outline: true, // 是否绘制边框
          outlineColor: Cesium.Color.RED, // 边框颜色
          outlineWidth: 10, // 边框线宽
          shadows: Cesium.ShadowMode.ENABLED// 开启接收并且投射阴影
        }
      })

      let rectangle = new Cesium.RectangleGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: Cesium.Rectangle.fromDegrees(-80.0, 39.0, -74.0, 42.0),
        height: 0.0,
        extrudedHeight: 500
      })
      let geometry = Cesium.RectangleGeometry.createGeometry(rectangle)

      let rectangleInstance = new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id: 'ellipsoidInstance'
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: [rectangleInstance],
        asynchronous: false, // 是否采用多线程
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false, // 半透明
          flat: true// 当 true 时，片段着色器中将使用平面阴影，这意味着不考虑光照
        })
      })

      viewer.scene.primitives.add(primitive)

      // 加载中国数据
      let promise = Cesium.GeoJsonDataSource.load('http://localhost:8888/Apps/SampleData/china.json', {
        fill: Cesium.Color.GREENYELLOW,
        markerSize: 10, // 给点使用的
        markerColor: Cesium.Color.RED, // 给点使用的
        stroke: Cesium.Color.RED, // 折线和多边形轮廓的颜色
        strokeWidth: 20, // 折线和多边形轮廓的宽度
        clampToGround: false// geojson的outline不能贴地,如果设置true，边框线将被禁用
      })

      promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource)
      }).otherwise(function (error) {
        console.log(error)
      })

      let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json'
      }))

      viewer.zoomTo(tileset)

      let handler = viewer.screenSpaceEventHandler

      // 左键点击事件
      handler.setInputAction(function (event) {
        // 获取鼠标点的对应椭球面位置
        let position = viewer.scene.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
        console.log(position)
        viewer.entities.add({
          position: position,
          point: {
            color: Cesium.Color.RED, // 颜色
            pixelSize: 50, // 像素大小
            outlineColor: Cesium.Color.YELLOWGREEN, // 边框颜色
            outlineWidth: 2, // 边框大小
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        })
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

  }
}
</script>
