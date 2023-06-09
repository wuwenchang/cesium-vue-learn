<template>
    <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PostProcessStageHighlight',
  data () {
    return {

    }
  },
  mounted () {
    this.viewer = this.initCesium()

    this.addPostProcessStageHighlight(this.viewer)
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
    addPostProcessStageHighlight (viewer) {
      viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
        maximumScreenSpaceError: 20, // 最大屏幕空间误差
        maximumNumberOfLoadedTiles: 10000 // 最大加载瓦片个数
      })).readyPromise.then(function (tileset) {
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius))
      })

      // Shade selected model with highlight.
      var fragmentShaderSource =
          'uniform sampler2D colorTexture;\n' +
          'varying vec2 v_textureCoordinates;\n' +
          'uniform vec4 highlight;\n' +
          'void main() {\n' +
          '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
          '    if (czm_selected()) {\n' +
          // mix(color.rgb, highlight.rgb, highlight.a)
          '        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n' +
          '        gl_FragColor = vec4(highlighted, 1.0);\n' +
          '    } else { \n' +
          '        gl_FragColor = color;\n' +
          '    }\n' +
          '}\n'
      var stage = viewer.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
          fragmentShader: fragmentShaderSource,
          uniforms: {
            highlight: function () {
              return new Cesium.Color(0.0, 1.0, 0.0, 0.5)
            }
          }
        })
      )
      stage.selected = []

      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        var pickedObject = viewer.scene.pick(movement.endPosition)
        if (Cesium.defined(pickedObject)) {
          // 选中要素
          stage.selected = [pickedObject]
        } else {
          stage.selected = []
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
  }
}
</script>
