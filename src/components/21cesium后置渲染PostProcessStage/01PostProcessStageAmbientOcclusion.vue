<template>
  <div style="height: 100%;width: 100%">
    <div id="cesiumContainer"></div>
    <div class=" slider-right">
      <div class="block">
        <span class="demonstration">intensity</span>
        <el-slider v-model="intensity" @change="this.updatePostProcess"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">bias</span>
        <el-slider v-model="bias" @change="this.updatePostProcess"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">lengthCap</span>
        <el-slider v-model="lengthCap" @change="this.updatePostProcess"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">stepSize</span>
        <el-slider v-model="stepSize" @change="this.updatePostProcess"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">blurStepSize</span>
        <el-slider v-model="blurStepSize" @change="this.updatePostProcess"></el-slider>
      </div>
    </div>
  </div>

</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PostProcessStageAmbientOcclusion',
  data () {
    return {
      show: true,
      ambientOcclusionOnly: true,
      intensity: 100,
      bias: 0.0,
      lengthCap: 0.03,
      stepSize: 0.1,
      blurStepSize: 0.86
    }
  },
  mounted () {
    this.viewer = this.initCesium()

    this.addPostProcessStageAmbientOcclusion(this.viewer)
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
    addPostProcessStageAmbientOcclusion (viewer) {
      if (!Cesium.PostProcessStageLibrary.isAmbientOcclusionSupported(viewer.scene)) {
        window.alert('This browser does not support the ambient occlusion post process.')
      }
      let position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706,
        10000
      )
      let heading = Cesium.Math.toRadians(135)
      let pitch = 0
      let roll = 0
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      )

      let entity = viewer.entities.add({
        name: 'model',
        position: position,
        orientation: orientation,
        model: {
          uri: 'http://localhost:8888/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
          // 模型最小刻度
          scale: 5, // 缩放
          minimumPixelSize: 32, // 指定模型的最小最小像素大小，而不考虑缩放
          maximumSize: 128, // 模型的最大比例尺大小。 minimumPixelSize的上限
          runAnimations: true, // 指定是否应启动模型中指定的glTF动画
          clampAnimations: true, // 指定glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
          // silhouetteColor: Cesium.Color.fromAlpha(Cesium.Color.BLUE, 1),// 模型轮廓颜色与透明度
          // silhouetteSize:3,//模型轮廓大小
          maximumScale: 200, // 设置模型最大放大大小
          // color: Cesium.Color.YELLOWGREEN, // 指定与模型的渲染颜色混合的 Color
          show: true// 模型是否可见
          // colorBlendMode:Cesium.ColorBlendMode.MIX,//颜色混合模式
          // colorBlendAmount:0.6,//颜色混合比例
        }
      })
      viewer.trackedEntity = entity
      viewer.zoomTo(entity)

      this.updatePostProcess()
    },
    updatePostProcess () {
      let viewer = this.viewer
      console.log(this.intensity)
      var ambientOcclusion = viewer.scene.postProcessStages.ambientOcclusion
      console.log(ambientOcclusion)
      ambientOcclusion.enabled = Boolean(this.show) || Boolean(this.ambientOcclusionOnly)
      ambientOcclusion.uniforms.ambientOcclusionOnly = Boolean(this.ambientOcclusionOnly)
      ambientOcclusion.uniforms.intensity = Number(this.intensity)
      ambientOcclusion.uniforms.bias = Number(this.bias)
      ambientOcclusion.uniforms.lengthCap = Number(this.lengthCap)
      ambientOcclusion.uniforms.stepSize = Number(this.stepSize)
      ambientOcclusion.uniforms.blurStepSize = Number(this.blurStepSize)
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
