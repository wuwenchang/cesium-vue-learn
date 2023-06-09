<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import billboard from './images/billboard.png'

export default {
  name: 'EntityCluster',
  mounted () {
    let viewer = this.initCesium()

    this.addBillboard(viewer)
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addBillboard (viewer) {
      let customDataSource = new Cesium.CustomDataSource('customDataSource')
      for (let i = 0; i < 250; i++) {
        let entity = new Cesium.Entity()
        entity.position = Cesium.Cartesian3.fromDegrees(Cesium.Math.randomBetween(-180, 180), Cesium.Math.randomBetween(-75, 75))
        entity.billboard = new Cesium.BillboardGraphics()
        entity.billboard.image = billboard
        entity.billboard.color = Cesium.Color.fromRandom().withAlpha(0.8)
        customDataSource.entities.add(entity)
      }
      viewer.dataSources.add(customDataSource)

      let dataSource = customDataSource
      let pixelRange = 5
      let minimumClusterSize = 3
      let enabled = true
      let removeListener = null
      // 开启数据源实体聚合
      dataSource.clustering.enabled = enabled
      // 扩展屏幕空间边框的像素范围
      dataSource.clustering.pixelRange = pixelRange
      // 群集的屏幕空间对象的最小数量
      dataSource.clustering.minimumClusterSize = minimumClusterSize

      // 添加聚合
      function customStyle () {
        if (Cesium.defined(removeListener)) {
          removeListener()
          removeListener = undefined
        } else {
          removeListener = dataSource.clustering.clusterEvent.addEventListener(
            function (clusteredEntities, cluster) {
              cluster.label.show = true
              cluster.label.text = clusteredEntities.length.toString()
              cluster.label.pixelOffset = new Cesium.Cartesian2(-5, 5)
              cluster.label.font = '18px sans-serif'
              cluster.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE
              cluster.label.fillColor = Cesium.Color.RED
              cluster.label.outlineColor = Cesium.Color.BLACK
              cluster.label.outlineWidth = 2
              cluster.billboard.show = true
              cluster.billboard.id = cluster.label.id
              cluster.billboard.image = billboard
            })
        }
        // 强制聚合使用新的样式
        let pixelRange = dataSource.clustering.pixelRange
        dataSource.clustering.pixelRange = 0
        dataSource.clustering.pixelRange = pixelRange
      }

      // 启用自定义样式
      customStyle()
    }
  }
}
</script>
