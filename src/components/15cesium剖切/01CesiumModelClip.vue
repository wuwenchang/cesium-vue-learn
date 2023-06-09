<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'CesiumModelClip',
  data () {
    return {
      distance: 1000
    }
  },
  mounted () {
    let viewer = this.initCesium()
    console.log('wwc')
    this.addCesiumModelClip(viewer)
  },
  methods: {
    initCesium: function () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlOTExNTU4NC1lMDFlLTRiYTYtOTRmZi0zNDAwZWFjMjMxNDAiLCJpZCI6MTU5NTIsImlhdCI6MTYwNjY0MDc4MH0.DEgc4-h5oyP530dPxa1YKpXqzCAzUagibRB9bHm5QQs'
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
        timeline: true,
        selectionIndicator: false, // 是否显示选取指示器组件
        shouldAnimate: true, // 自动播放动画控件
        shadows: true, // 是否显示光照投射的阴影
        terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, // 地质接收阴影
        sceneMode: Cesium.SceneMode.SCENE3D,
        clock: new Cesium.Clock(),
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
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
    addCesiumModelClip (viewer) {
      let targetY = 0.0
      let planeEntities = []
      let selectedPlane
      let clippingPlanes
      let scene = viewer.scene

      // Select plane when mouse down
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        let pickedObject = scene.pick(movement.position)
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
          selectedPlane = pickedObject.id.plane
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05)
          selectedPlane.outlineColor = Cesium.Color.WHITE
          scene.screenSpaceCameraController.enableInputs = false
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

      // Release plane on mouse up
      handler.setInputAction(function () {
        if (Cesium.defined(selectedPlane)) {
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1)
          selectedPlane.outlineColor = Cesium.Color.WHITE
          selectedPlane = undefined
        }

        scene.screenSpaceCameraController.enableInputs = true
      }, Cesium.ScreenSpaceEventType.LEFT_UP)

      // Update plane on mouse move
      handler.setInputAction(function (movement) {
        if (Cesium.defined(selectedPlane)) {
          let deltaY = movement.startPosition.y - movement.endPosition.y
          targetY += deltaY
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      function createPlaneUpdateFunction (plane) {
        console.log(targetY, 'start')
        return function () {
          console.log(targetY, 'end')
          plane.distance = targetY
          return plane
        }
      }

      let tileset

      function loadTileset (url) {
        clippingPlanes = new Cesium.ClippingPlaneCollection({
          planes: [
            new Cesium.ClippingPlane(
              new Cesium.Cartesian3(0.0, 0.0, -1.0),
              0.0
            )
          ],
          edgeWidth: 1.0
        })

        tileset = viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: url,
            clippingPlanes: clippingPlanes
          })
        )

        return tileset.readyPromise
          .then(function () {
            let boundingSphere = tileset.boundingSphere
            let radius = boundingSphere.radius

            viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0))

            if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
              // The clipping plane is initially positioned at the tileset's root transform.
              // Apply an additional matrix to center the clipping plane on the bounding sphere center.
              let transformCenter = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3())
              let transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter)
              let boundingSphereCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
              let height = boundingSphereCartographic.height - transformCartographic.height
              clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, height))
            }
            console.log(clippingPlanes)
            for (let i = 0; i < clippingPlanes.length; ++i) {
              let plane = clippingPlanes.get(i)
              let planeEntity = viewer.entities.add({
                position: boundingSphere.center,
                plane: {
                  dimensions: new Cesium.Cartesian2(
                    radius * 2.5,
                    radius * 2.5
                  ),
                  material: Cesium.Color.WHITE.withAlpha(0.1),
                  plane: new Cesium.CallbackProperty(
                    createPlaneUpdateFunction(plane),
                    false
                  ),
                  outline: true,
                  outlineColor: Cesium.Color.WHITE
                }
              })

              planeEntities.push(planeEntity)
            }
            return tileset
          })
          .otherwise(function (error) {
            console.log(error)
          })
      }
      loadTileset('http://localhost:8888/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json')
    }
  }
}
</script>
