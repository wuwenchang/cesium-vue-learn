<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'Polygon',
  mounted () {
    let viewer = this.initCesium()

    this.addPolygon(viewer)
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
        shouldAnimate: true, // 自动播放动画控件
        shadows: true, // 是否显示光照投射的阴影
        terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, // 地质接收阴影
        sceneMode: Cesium.SceneMode.SCENE3D,
        clock: new Cesium.Clock(),
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer?f=jsapi'
        }),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addPolygon (viewer) {
      viewer.entities.add({
        name: 'Blue polygon with holes',
        polygon: {
          hierarchy: {// 定义多边形及其孔的线性环的层次结构
            positions: Cesium.Cartesian3.fromDegreesArray([
              -99.0,
              30.0,
              -85.0,
              30.0,
              -85.0,
              40.0,
              -99.0,
              40.0
            ]),
            holes: [
              {
                positions: Cesium.Cartesian3.fromDegreesArray([
                  -97.0,
                  31.0,
                  -97.0,
                  39.0,
                  -87.0,
                  39.0,
                  -87.0,
                  31.0
                ]),
                holes: [
                  {
                    positions: Cesium.Cartesian3.fromDegreesArray([
                      -95.0,
                      33.0,
                      -89.0,
                      33.0,
                      -89.0,
                      37.0,
                      -95.0,
                      37.0
                    ]),
                    holes: [
                      {
                        positions: Cesium.Cartesian3.fromDegreesArray([
                          -93.0,
                          34.0,
                          -91.0,
                          34.0,
                          -91.0,
                          36.0,
                          -93.0,
                          36.0
                        ])
                      }
                    ]
                  }
                ]
              }
            ]
          },
          material: Cesium.Color.BLUE.withAlpha(0.8),
          height: 0,
          outline: true,
          closeTop: true, // 对于拉伸的图形关闭顶部
          closeBottom: true, // 对于拉伸的图形关闭底部
          extrudedHeight: 1000000,
          extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_EDGE// 对于拉伸的图形贴地，RELATIVE_TO_GROUND 位于地形之上
        }
      })
      viewer.zoomTo(viewer.entities)
    }
  }
}
</script>
