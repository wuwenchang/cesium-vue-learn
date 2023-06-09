<template>
  <div style="height: 100%;width: 100%">
    <div id="cesiumContainer"></div>
    <div class=" slider-right">
      <div class="block">
        <span class="demonstration">focalDistance</span>
        <el-slider v-model="focalDistance" @change="this.updatePostProcess" max="200"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">delta</span>
        <el-slider v-model="delta" @change="this.updatePostProcess"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">sigma</span>
        <el-slider v-model="sigma" @change="this.updatePostProcess"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">stepSize</span>
        <el-slider v-model="stepSize" @change="this.updatePostProcess"></el-slider>
      </div>
    </div>
  </div>

</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PostProcessStageDepth',
  data () {
    return {
      show: true,
      focalDistance: 87,
      delta: 1,
      sigma: 3.78,
      stepSize: 2.46
    }
  },
  mounted () {
    this.viewer = this.initCesium()

    this.addPostProcessStageDepth(this.viewer)
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
    addPostProcessStageDepth (viewer) {
      if (!Cesium.PostProcessStageLibrary.isDepthOfFieldSupported(viewer.scene)) {
        window.alert('This browser does not support the depth of field post process.')
      }

      this.depthOfField = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createDepthOfFieldStage()
      )

      function createModel (url, x, y, height) {
        var position = Cesium.Cartesian3.fromDegrees(x, y, height)
        viewer.entities.add({
          name: url,
          position: position,
          model: {
            uri: url
          }
        })
      }

      var numberOfBalloons = 13
      var lonIncrement = 0.00025
      var initialLon = -122.99875
      var lat = 44.0503706
      var height = 100.0

      var url = 'http://localhost:8888/Apps/SampleData/models/CesiumBalloon/CesiumBalloon.glb'

      for (var i = 0; i < numberOfBalloons; ++i) {
        var lon = initialLon + i * lonIncrement
        createModel(url, lon, lat, height)
      }

      var target = Cesium.Cartesian3.fromDegrees(
        initialLon + lonIncrement,
        lat,
        height + 7.5
      )
      var offset = new Cesium.Cartesian3(
        -37.048378684557974,
        -24.852967044804245,
        4.352023653686047
      )
      viewer.scene.camera.lookAt(target, offset)
      this.updatePostProcess()
    },
    updatePostProcess () {
      let depthOfField = this.depthOfField
      depthOfField.enabled = Boolean(this.show)
      depthOfField.uniforms.focalDistance = Number(this.focalDistance)
      depthOfField.uniforms.delta = Number(this.delta)
      depthOfField.uniforms.sigma = Number(this.sigma)
      depthOfField.uniforms.stepSize = Number(this.stepSize)
    }
  }
}
</script>

<style scoped>
  .slider-right {
    position: absolute;
    right: 100px;
    bottom: 200px;
    width: 200px;
    color: aqua;
  }
</style>
