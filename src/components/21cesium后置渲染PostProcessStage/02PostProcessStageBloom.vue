<template>
  <div style="height: 100%;width: 100%">
    <div id="cesiumContainer"></div>
    <div class=" slider-right">
      <div class="block">
        <span class="demonstration">contrast</span>
        <el-slider v-model="contrast" @change="this.updatePostProcess" max="200"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">brightness</span>
        <el-slider v-model="brightness" @change="this.updatePostProcess" max="1.0" step="0.01"></el-slider>
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
  name: 'PostProcessStageBloom',
  data () {
    return {
      show: true,
      glowOnly: false,
      contrast: 128,
      brightness: -0.3,
      delta: 1.0,
      sigma: 3.78,
      stepSize: 5.0
    }
  },
  mounted () {
    this.viewer = this.initCesium()

    this.addPostProcessStageBloom(this.viewer)
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
    addPostProcessStageBloom (viewer) {
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
      let viewer = this.viewer
      var bloom = viewer.scene.postProcessStages.bloom
      bloom.enabled = Boolean(this.show)
      bloom.uniforms.glowOnly = Boolean(this.glowOnly)
      bloom.uniforms.contrast = Number(this.contrast)
      bloom.uniforms.brightness = Number(this.brightness)
      bloom.uniforms.delta = Number(this.delta)
      bloom.uniforms.sigma = Number(this.sigma)
      bloom.uniforms.stepSize = Number(this.stepSize)
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
