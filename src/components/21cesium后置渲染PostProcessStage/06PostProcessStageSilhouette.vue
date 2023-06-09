<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PostProcessStageSilhouette',
  data () {
    return {}
  },
  mounted () {
    this.viewer = this.initCesium()

    this.addPostProcessStageSilhouette(this.viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg4ZjljZC1mZGM3LTRlZjEtYjg3MC00MjZkNGU3YjI5ZWUiLCJpZCI6MTU5NTIsImlhdCI6MTYwNTE0ODM5OX0.LjxeKrgAo7Ksk8405kSAhYwF0nKcF2w2DGJnKHh51N8'
      let viewer = new Cesium.Viewer('cesiumContainer', {
        animation: true,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: true,
        sceneModePicker: false,
        navigationHelpButton: false,
        scene3DOnly: true,
        timeline: true,
        selectionIndicator: false, // 是否显示选取指示器组件
        shouldAnimate: true, // 自动播放动画控件
        shadows: true, // 是否显示光照投射的阴影
        terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, // 地质接收阴影
        sceneMode: Cesium.SceneMode.SCENE3D,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      return viewer
    },
    addPostProcessStageSilhouette (viewer) {
      if (!viewer.scene.context.depthTexture) {
        window.alert('This browser does not support the fog post process.')
      }

      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then(function (tileset) {
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius))
      })

      // 当前选中的变量初始信息
      var selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
      }

      // 左键点击处理器
      var clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )

      // 判断是否支持描边，如果支持就使用描边选中，如果不支持就将选中的要素标色
      if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
        // 蓝色描边的边缘检测
        var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
        silhouetteBlue.uniforms.color = Cesium.Color.BLUE
        silhouetteBlue.uniforms.length = 0.01
        silhouetteBlue.selected = []
        // 绿色描边的边缘检测
        var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
        silhouetteGreen.uniforms.color = Cesium.Color.LIME
        silhouetteGreen.uniforms.length = 0.01
        silhouetteGreen.selected = []

        // 将两种边缘检测的后置渲染组合到描边的后置渲染
        viewer.scene.postProcessStages.add(
          Cesium.PostProcessStageLibrary.createSilhouetteStage([
            silhouetteBlue,
            silhouetteGreen
          ])
        )

        // 鼠标移动选中，描边蓝色
        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove (movement) {
          silhouetteBlue.selected = []
          // 移动选中
          var pickedFeature = viewer.scene.pick(movement.endPosition)
          if (!Cesium.defined(pickedFeature)) {
            return
          }

          // 高亮选中为蓝色
          if (pickedFeature !== selected.feature) {
            silhouetteBlue.selected = [pickedFeature]
          }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        // 点击选中描边
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick (movement) {
          silhouetteGreen.selected = []

          // 左键点击选中
          var pickedFeature = viewer.scene.pick(movement.position)
          if (!Cesium.defined(pickedFeature)) {
            clickHandler(movement)
            return
          }

          // 没有点击选中直接返回
          if (silhouetteGreen.selected[0] === pickedFeature) {
            return
          }

          // 保留选中的初始颜色
          var highlightedFeature = silhouetteBlue.selected[0]
          if (pickedFeature === highlightedFeature) {
            silhouetteBlue.selected = []
          }
          // 高亮绿色选中的要素
          silhouetteGreen.selected = [pickedFeature]
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK)
      } else {
        // 如果不支持描边，就直接使用高亮处理
        var highlighted = {
          feature: undefined,
          originalColor: new Cesium.Color()
        }

        // Color a feature yellow on hover.
        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove (movement) {
          // If a feature was previously highlighted, undo the highlight
          if (Cesium.defined(highlighted.feature)) {
            highlighted.feature.color = highlighted.originalColor
            highlighted.feature = undefined
          }
          // Pick a new feature
          var pickedFeature = viewer.scene.pick(movement.endPosition)
          if (!Cesium.defined(pickedFeature)) {
            return
          }
          // Highlight the feature if it's not already selected.
          if (pickedFeature !== selected.feature) {
            highlighted.feature = pickedFeature
            Cesium.Color.clone(
              pickedFeature.color,
              highlighted.originalColor
            )
            pickedFeature.color = Cesium.Color.YELLOW
          }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        // Color a feature on selection and show metadata in the InfoBox.
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick (
          movement
        ) {
          // If a feature was previously selected, undo the highlight
          if (Cesium.defined(selected.feature)) {
            selected.feature.color = selected.originalColor
            selected.feature = undefined
          }
          // Pick a new feature
          var pickedFeature = viewer.scene.pick(movement.position)
          if (!Cesium.defined(pickedFeature)) {
            clickHandler(movement)
            return
          }
          // Select the feature if it's not already selected
          if (selected.feature === pickedFeature) {
            return
          }
          selected.feature = pickedFeature
          // Save the selected feature's original color
          if (pickedFeature === highlighted.feature) {
            Cesium.Color.clone(
              highlighted.originalColor,
              selected.originalColor
            )
            highlighted.feature = undefined
          } else {
            Cesium.Color.clone(pickedFeature.color, selected.originalColor)
          }
          // Highlight newly selected feature
          pickedFeature.color = Cesium.Color.LIME
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK)
      }
    }
  }
}
</script>
