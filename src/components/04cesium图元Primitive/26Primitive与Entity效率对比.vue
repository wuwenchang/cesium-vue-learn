<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PrimitiveAndEntity',
  mounted () {
    let viewer = this.initCesium()

    this.addPrimitiveAndEntity(viewer)
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
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addPrimitiveAndEntity (viewer) {
      let instances = []
      for (let lon = -180.0; lon < 180.0; lon += 5.0) {
        for (let lat = -85.0; lat < 85.0; lat += 5.0) {
          instances.push(new Cesium.GeometryInstance({
            geometry : new Cesium.RectangleGeometry({
              rectangle : Cesium.Rectangle.fromDegrees(lon, lat, lon + 5.0, lat + 5.0),
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes : {
              color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha : 0.5}))
            }
          }));
        }
      }

      viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instances,
        appearance : new Cesium.PerInstanceColorAppearance()
      }));

      /*  for (let lon = -180.0; lon < 180.0; lon += 5.0) {
          for (let lat = -85.0; lat < 85.0; lat += 5.0) {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(lon, lat),
              rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(
                  lon, lat, lon + 5.0, lat + 5.0
                ),
                material: Cesium.Color.fromRandom({alpha: 0.5}),
              }
            })
          }
        } */

      // let dataSource = new Cesium.CustomDataSource('myData')

      // for (let lon = -180.0; lon < 180.0; lon += 5.0) {
      //   for (let lat = -85.0; lat < 85.0; lat += 5.0) {
      //     let entity = new Cesium.Entity({
      //       position: Cesium.Cartesian3.fromDegrees(lon, lat),
      //       rectangle: {
      //         coordinates: Cesium.Rectangle.fromDegrees(
      //           lon, lat, lon + 5.0, lat + 5.0
      //         ),
      //         material: Cesium.Color.fromRandom({alpha: 0.5})
      //       }
      //     })

      //     dataSource.entities.add(entity)
      //   }
      // }

      // viewer.dataSources.add(dataSource)
    }
  }
}
</script>
