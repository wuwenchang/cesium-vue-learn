<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import CustomAppearance from './CustomAppearance'

export default {
  name: 'CustomAppearance',
  mounted () {
    let viewer = this.initCesium()

    this.addCustomAppearance(viewer)
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
    addCustomAppearance (viewer) {
      let positions = []
      for (let i = 0; i < 40; ++i) {
        positions.push(Cesium.Cartesian3.fromDegrees(-100.0 + i, 48.0))
      }

      let polyline = new Cesium.PolylineGeometry({
        positions: positions,
        width: 10.0,
        materialSupport: Cesium.Appearance.vertexFormat
      })
      let geometry = Cesium.PolylineGeometry.createGeometry(polyline)

      let polygonInstance1 = new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 1.0))
        },
        id: 'polygonInstance1'
      })

      let primitive = new Cesium.Primitive({
        geometryInstances: [polygonInstance1],
        asynchronous: false, // 是否采用多线程
        appearance: new CustomAppearance({
          vertexShaderSource: 'attribute vec3 position3DHigh;\
                        attribute vec3 position3DLow;\
                        attribute vec2 st;\
                        attribute float batchId;\
                        varying vec2 v_st;\
                        void main()\
                        {\
                            vec4 p = czm_computePosition();\
                            v_st=st;\
                            p = czm_modelViewProjectionRelativeToEye * p;\
                            gl_Position = p;\
                        }\
                        ',
          fragmentShaderSource: 'varying vec2 v_st;\
                        void main()\
                        {\
                            czm_materialInput materialInput;\
                            czm_material material=czm_getMaterial(materialInput,v_st);\
                            vec4 color=vec4(material.diffuse + material.emission,material.alpha);\
                            if(color.x==1.0&&color.y==1.0&&color.z==1.0&&color.w==1.0) color=vec4(vec3(0.0,0.0,0.0),0.0);\
                            gl_FragColor =color;\
                        }\
                        '
        })
      })

      viewer.scene.primitives.add(primitive)

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-105.0, 48.0, 20000),
        orientation: {// 设置相机的Heading，Pitch，Roll
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0
        },
        duration: 3
      })
    },
    createGeometry (positions, sts, indices) {
      return new Cesium.Geometry({
        attributes: {
          position: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: positions
          }),
          st: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: sts
          })
        },
        indices: indices,
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
      })
    },
    createAppearence (fs, vs, ms, url) {
      return new Cesium.Appearance({
        material: new Cesium.Material({
          fabric: {
            uniforms: {
              image: url
            },
            source: ms
          }
        }),
        aboveGround: true,
        faceForward: true,
        flat: true,
        translucent: false,
        renderState: {
          blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
          depthTest: { enabled: true },
          depthMask: true
        },
        fragmentShaderSource: fs,
        vertexShaderSource: vs
      })
    }
  }
}
</script>
