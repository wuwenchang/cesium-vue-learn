<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";

export default {
  name: "PrimitiveAndEntity",
  mounted() {
    let viewer = this.initCesium();

    this.addPrimitiveAndEntity(viewer);
  },
  methods: {
    initCesium: function() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg4ZjljZC1mZGM3LTRlZjEtYjg3MC00MjZkNGU3YjI5ZWUiLCJpZCI6MTU5NTIsImlhdCI6MTYwNTE0ODM5OX0.LjxeKrgAo7Ksk8405kSAhYwF0nKcF2w2DGJnKHh51N8";
      let viewer = new Cesium.Viewer("cesiumContainer", {
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
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'}),
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      });
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 去除版权信息
      return viewer;
    },
    addPrimitiveAndEntity(viewer) {
      let id = "primitive";
      let i = 0;
      // 一起渲染
      // let instances = [];
      // for (let lon = -180.0; lon < 180.0; lon += 5.0) {
      //   for (let lat = -85.0; lat < 85.0; lat += 5.0) {
      //     i++;
      //     instances.push(
      //       new Cesium.GeometryInstance({
      //         geometry: new Cesium.RectangleGeometry({
      //           rectangle: Cesium.Rectangle.fromDegrees(
      //             lon,
      //             lat,
      //             lon + 5.0,
      //             lat + 5.0
      //           ),
      //           vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      //         }),
      //         id: id + i,
      //         attributes: {
      //           color: Cesium.ColorGeometryInstanceAttribute.fromColor(
      //             // Cesium.Color.fromRandom({ alpha: 0.5 })
      //             Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.01)
      //           )
      //         }
      //       })
      //     );
      //   }
      // }
      // const primitive = new Cesium.Primitive({
      //   // 几何实例
      //   geometryInstances: instances,
      //   appearance: new Cesium.PerInstanceColorAppearance()
      // });
      // viewer.scene.primitives.add(primitive);
      // 分开渲染
      for (let lon = -180.0; lon < 180.0; lon += 5.0) {
        for (let lat = -85.0; lat < 85.0; lat += 5.0) {
          i++;
          let instances = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
              rectangle: Cesium.Rectangle.fromDegrees(
                lon,
                lat,
                lon + 5.0,
                lat + 5.0
              ),
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            id: id + i,
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                // Cesium.Color.fromRandom({ alpha: 0.5 })
                Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.01)
              )
            }
          })
          const primitive = new Cesium.Primitive({
            // 几何实例
            geometryInstances: [instances],
            appearance: new Cesium.PerInstanceColorAppearance()
          });
          viewer.scene.primitives.add(primitive);
        }
      }
      
      // console.log(i);

      /*  for (let lon = -180.0; lon < 180.0; lon += 5.0) {
          for (let lat = -85.0; lat < 85.0; lat += 5.0) {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(lon, lat),
              rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(
                  lon, lat, lon + 5.0, lat + 5.0
                ),
                material: Cesium.Color.fromRandom({alpha: 0.5}),
              }
            })
          }
        } */

      // let dataSource = new Cesium.CustomDataSource('myData')

      // for (let lon = -180.0; lon < 180.0; lon += 5.0) {
      //   for (let lat = -85.0; lat < 85.0; lat += 5.0) {
      //     i++
      //     let entity = new Cesium.Entity({
      //       position: Cesium.Cartesian3.fromDegrees(lon, lat),
      //       id: id + i,
      //       rectangle: {
      //         coordinates: Cesium.Rectangle.fromDegrees(
      //           lon, lat, lon + 5.0, lat + 5.0
      //         ),
      //         material: Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.01)
      //       }
      //     })

      //     dataSource.entities.add(entity)
      //   }
      // }

      // viewer.dataSources.add(dataSource)
      // console.log(viewer.dataSources)

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(movement => {
        // console.log(movement)
        if (!movement.endPosition) return
        var pick = viewer.scene.pick(movement.endPosition);
        // console.log(pick)
        if (Cesium.defined(pick)) {
          // console.log(primitive._instanceIds)
          // 设置primitive颜色（一起渲染）
          // primitive._instanceIds.forEach(item => {
          //   const attributes = primitive.getGeometryInstanceAttributes(item)
          //   attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          //     Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.01)
          //   );
          // })
          // 设置primitive颜色（分开渲染）
          viewer.scene.primitives._primitives.forEach(item => {
            item.getGeometryInstanceAttributes(
              item._instanceIds[0]
            ).color = Cesium.ColorGeometryInstanceAttribute.toValue(
              Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.01)
            );
          });
          const attributes = pick.primitive.getGeometryInstanceAttributes(
            pick.id
          );
          attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
            Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.5)
          );
          // // 设置entitys的颜色
          // viewer.dataSources._dataSources[0].entities.values.forEach(item => {
          //   item.rectangle.material = Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.01)
          // })
          //   // console.log(pick.id)
          // pick.id.rectangle.material = Cesium.Color.fromCssColorString("#00A1FF").withAlpha(0.5)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }
};
</script>
