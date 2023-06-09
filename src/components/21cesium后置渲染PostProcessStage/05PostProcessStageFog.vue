<template>
    <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'PostProcessStageFog',
  data () {
    return {

    }
  },
  mounted () {
    this.viewer = this.initCesium()

    this.addPostProcessStageFog(this.viewer)
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
    addPostProcessStageFog (viewer) {
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

      var fragmentShaderSource =
          // 计算每个渲染顶点和视点（相机）的距离
          'float getDistance(sampler2D depthTexture, vec2 texCoords) \n' +
          '{ \n' +
          '    float depth = czm_unpackDepth(texture2D(depthTexture, texCoords)); \n' +
          '    if (depth == 0.0) { \n' +
          '        return czm_infinity; \n' +
          '    } \n' +
          // 將片元的x，y坐标与纹理坐标深度值计算出视点的四元坐标vec4
          '    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); \n' +
          '    return -eyeCoordinate.z / eyeCoordinate.w; \n' +// 视点的z分量除以视点坐标的w分量就是视点到渲染顶点的距离
          '} \n' +
          // 根据距离计算出雾化混合权重值
          'float interpolateByDistance(vec4 nearFarScalar, float distance) \n' +
          '{ \n' +
          '    float startDistance = nearFarScalar.x; \n' +// 雾化开始距离
          '    float startValue = nearFarScalar.y; \n' +// 雾化开始值
          '    float endDistance = nearFarScalar.z; \n' +// 雾化结束距离
          '    float endValue = nearFarScalar.w; \n' +// 雾化结束值
          // 当前距离到开始距离与雾化起始位置的比例，夹紧在0到1
          '    float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); \n' +
          // 雾化线性混合，即startValue*(1-t)+endValue*t
          '    return mix(startValue, endValue, t); \n' +
          '} \n' +
          // 目标颜色与源颜色混合
          'vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) \n' +
          '{ \n' +
          '    return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); \n' +
          '} \n' +
          'uniform sampler2D colorTexture; \n' +
          'uniform sampler2D depthTexture; \n' +
          'uniform vec4 fogByDistance; \n' +
          'uniform vec4 fogColor; \n' +
          'varying vec2 v_textureCoordinates; \n' +
          'void main(void) \n' +
          '{ \n' +
          '    float distance = getDistance(depthTexture, v_textureCoordinates); \n' +
          '    vec4 sceneColor = texture2D(colorTexture, v_textureCoordinates); \n' +
          '    float blendAmount = interpolateByDistance(fogByDistance, distance); \n' +
          '    vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); \n' +
          '    gl_FragColor = alphaBlend(finalFogColor, sceneColor); \n' +
          '} \n'

      viewer.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
          fragmentShader: fragmentShaderSource,
          uniforms: {
            fogByDistance: new Cesium.Cartesian4(10, 0.0, 2000, 1.0),
            fogColor: Cesium.Color.WHITE
          }
        })
      )
    }
  }
}
</script>
