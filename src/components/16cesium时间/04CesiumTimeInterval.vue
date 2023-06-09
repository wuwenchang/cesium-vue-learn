<template>
  <div style="height: 100%; width: 100%">
    <div id="cesiumContainer"></div>
    <div id="animationContainer"></div>
  </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import './cesium.css'

export default {
  name: 'CesiumAnimation',
  data () {
    return {}
  },
  mounted () {
    let viewer = this.initCesium()
    this.addCesiumTimeInterval(viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlOTExNTU4NC1lMDFlLTRiYTYtOTRmZi0zNDAwZWFjMjMxNDAiLCJpZCI6MTU5NTIsImlhdCI6MTYwNjY0MDc4MH0.DEgc4-h5oyP530dPxa1YKpXqzCAzUagibRB9bHm5QQs'
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
        // clock: new Cesium.Clock(),//不用自己创建，使用系统默认时钟
        imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.CesiumTerrainProvider({// 地质开挖必须是cesium提供的地形
          url: Cesium.IonResource.fromAssetId(1),
          requestVertexNormals: true, // 顶点法线效果
          requestWaterMask: true// 水效果
        })
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 去除版权信息
      // 地质开挖不能有深度测试，有深度测试会被遮盖
      viewer.scene.globe.depthTestAgainstTerrain = false
      return viewer
    },
    addCesiumTimeInterval (viewer) {
      viewer.scene.globe.enableLighting = true
      let data = [
        {
          longitude: 116.405419,
          dimension: 39.918034,
          height: 0,
          time: 0
        }, {
          longitude: 116.2821,
          dimension: 39.918145,
          height: 0,
          time: 40
        }, {
          longitude: 115.497402,
          dimension: 39.344641,
          height: 70000,
          time: 100
        }, {
          longitude: 107.942392,
          dimension: 29.559967,
          height: 70000,
          time: 280
        }, {
          longitude: 106.549265,
          dimension: 29.559967,
          height: 0,
          time: 360
        }
      ]

      // 起始时间
      let start = Cesium.JulianDate.fromDate(new Date(2019, 12, 9))
      // 结束时间
      let stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate())

      // 设置始时钟始时间
      viewer.clock.startTime = start.clone()
      // 设置时钟当前时间
      viewer.clock.currentTime = start.clone()
      // 设置始终停止时间
      viewer.clock.stopTime = stop.clone()
      // 时间速率，数字越大时间过的越快
      viewer.clock.multiplier = 10
      // 时间轴
      viewer.timeline.zoomTo(start, stop)
      // 循环执行,即为2，到达终止时间，重新从起点时间开始
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP

      let property = computeFlight(data)
      // 添加模型
      let planeModel = viewer.entities.add({
        // 和时间轴关联
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
          start: start,
          stop: stop
        })]),
        position: property,
        // 根据所提供的速度计算模型的朝向
        orientation: new Cesium.VelocityOrientationProperty(property),
        // 模型数据
        model: {
          uri: 'http://localhost:8888/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
          minimumPixelSize: 128
        },
        path: new Cesium.PathGraphics({
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            glowColor: Cesium.Color.YELLOWGREEN,
            color: Cesium.Color.WHITE
          }),
          width: 3
        })
      })

      viewer.trackedEntity = planeModel

      /**
         * 计算飞行
         * @param source 数据坐标
         * @returns {SampledPositionProperty|*}
         */
      function computeFlight (source) {
        // 取样位置 相当于一个集合
        let property = new Cesium.SampledPositionProperty()
        for (let i = 0; i < source.length; i++) {
          let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate())
          let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height)
          // 添加位置，和时间对应
          property.addSample(time, position)
        }
        return property
      }

      // 每一帧的渲染监听
      let cartographic = null
      let animationContainer = document.getElementById('animationContainer')
      viewer.clock.onTick.addEventListener(function (clock) {
        var position = planeModel.position.getValue(clock.currentTime)
        cartographic = Cesium.Cartographic.fromCartesian(position)
        animationContainer.innerHTML = '经度：' + cartographic.longitude.toFixed(2) + '<br/>' + '纬度：' + cartographic.latitude.toFixed(2) + '<br/>' + '高度：' + cartographic.height.toFixed(2) + '<br/>'
      })

      // clock结束的时间触发
      viewer.clock.onStop.addEventListener(function (clock) {
      })
    }
  }
}
</script>
