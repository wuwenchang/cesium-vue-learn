<template>
  <div style="height: 100%;width: 100%;position: relative">
    <div id="cesiumContainer"></div>
    <div id = "echarts" style="position: absolute;bottom: 0px;width: 100%;height: 25%;background: white">
      <ECharts ref="echarts" :options="orgOptions" :auto-resize="true"></ECharts>
    </div>
  </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'SampleTerrainMostDetailed',
  data () {
    return {
      orgOptions: {}
    }
  },
  mounted () {
    let viewer = this.initCesium()

    this.addSampleTerrainMostDetailed(viewer)
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
    addSampleTerrainMostDetailed (viewer) {
      // 取两个地利位置的高度
      let start = Cesium.Cartesian3.fromDegrees(90.0, 25.0)
      let end = Cesium.Cartesian3.fromDegrees(105.0, 30.0)
      var terrainProvider = Cesium.createWorldTerrain()
      /* var positions = [
          Cesium.Cartographic.fromCartesian(start),
          Cesium.Cartographic.fromCartesian(end)
        ];
        var promise = Cesium.sampleTerrain(terrainProvider, 12, positions);
        Cesium.when(promise, function(updatedPositions) {
         console.log(updatedPositions)
        }); */

      let cartographics = [Cesium.Cartographic.fromCartesian(start)]
      let positions = [start]
      // 插值100个点
      let count = 100
      for (let i = 1; i < count; i++) {
        let lerp = Cesium.Cartesian3.lerp(start, end, i / count, new Cesium.Cartesian3())
        cartographics.push(Cesium.Cartographic.fromCartesian(lerp))
        positions.push(lerp)
      }
      cartographics.push(Cesium.Cartographic.fromCartesian(end))
      positions.push(end)

      let entity = viewer.entities.add({
        name: 'Red line on terrain',
        position: positions[0],
        polyline: {
          positions: positions,
          width: 5,
          material: Cesium.Color.RED,
          depthFailMaterial: Cesium.Color.BLUE, // 位于地下的材质,不给地下的材质，位于地下的线就不可见
          clampToGround: true, // 折线固定在地面
          arcType: Cesium.ArcType.GEODESIC// 定义连接点采用的路径
        }
      })
      viewer.trackedEntity = entity

      let promise = Cesium.sampleTerrainMostDetailed(terrainProvider, cartographics)
      Cesium.when(promise, function (updatedPositions) {
        console.log(updatedPositions)
        // 每个点的高度
        let height = []
        for (let i = 0; i < updatedPositions.length; i++) {
          height.push(updatedPositions[i].height)
        }
        console.log(height)
      })
      this.orgOptions = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
        }]
      }
    }
  }
}
</script>
