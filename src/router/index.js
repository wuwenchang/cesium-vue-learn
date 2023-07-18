import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "../components/03cesium材质/03CheckerboardMaterial.vue";
// import HelloWorld from "../components/04cesium图元Primitive/26Primitive与Entity效率对比.vue";
// import HelloWorld from "../components/04cesium图元Primitive/01CesiumModelClip.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/0303",
      name: "0303",
      component: () =>
        import("../components/03cesium材质/03CheckerboardMaterial.vue")
    },
    //
    {
      path: "/0305",
      name: "0305",
      component: () => import("../components/03cesium材质/05GridMaterial.vue")
    },
    {
      path: "/0426",
      name: "0426",
      component: () =>
        import(
          "../components/04cesium图元Primitive/26Primitive与Entity效率对比.vue"
        )
    },
    {
      path: "/0411",
      name: "0411",
      component: () =>
        import("../components/04cesium图元Primitive/11EllipsoidGeometry.vue")
    },
    {
      path: "/0501",
      name: "0501",
      component: () =>
        import(
          "../components/05cesium外观Appearance/01EllipsoidSurfaceAppearance.vue"
        )
    },
    {
      path: "/0601",
      name: "0601",
      component: () =>
        import("../components/06cesium数据源DataSource/01CzmlDataSource.vue")
    },
    {
      path: "/0701",
      name: "0701",
      component: () =>
        import("../components/07cesium3dTiles/01Cesium3DTileset.vue") //
    },
    {
      path: "/0703",
      name: "0703",
      component: () =>
        import("../components/07cesium3dTiles/03Cesium3DTile.vue")
    },
    {
      path: "/0801",
      name: "0801",
      component: () =>
        import(
          "../components/08cesium图层ImageryProvider/01ArcGisMapServerImageryProvider.vue"
        )
    },
    {
      path: "/0901",
      name: "0901",
      component: () =>
        import(
          "../components/09cesium地质TerrainProvider/01CesiumTerrainProvider.vue"
        )
    },
    {
      path: "/0902",
      name: "0902",
      component: () =>
        import(
          "../components/09cesium地质TerrainProvider/02EllipsoidTerrainProvider.vue"
        )
    },
    {
      path: "/1201",
      name: "1201",
      component: () =>
        import("../components/12cesium矩阵Matrix/01CesiumTranslation.vue")
    },
    {
      path: "/1203",
      name: "1203",
      component: () =>
        import("../components/12cesium矩阵Matrix/03CesiumScale.vue")
    },
    {
      path: "/1202",
      name: "1202",
      component: () =>
        import("../components/12cesium矩阵Matrix/02CesiumRotation.vue")
    },
    {
      path: "/1301",
      name: "1301",
      component: () =>
        import("../components/13cesuim鼠标事件/01ScreenSpaceEventHandler.vue")
    },
    {
      path: "/1401",
      name: "1401",
      component: () => import("../components/14cesium拾取pick/01ScenePick.vue")
    },
    {
      path: "/1801",
      name: "1801",
      component: () =>
        import("../components/18cesium场景scene/03SceneMorphTo.vue")
    },
    {
      path: "/1901",
      name: "1901",
      component: () =>
        import(
          "../components/19cesium相机camera/07CameraFlyToBoundingSphere.vue"
        )
    },
    {
      path: "/2001",
      name: "2001",
      component: () =>
        import(
          "../components/20cesium粒子系统ParticleSystem/03ParticleSystemSmoke.vue"
        )
    },
    {
      path: "/2101",
      name: "2101",
      component: () =>
        import(
          "../components/21cesium后置渲染PostProcessStage/02PostProcessStageBloom.vue"
        )
    }
  ]
});
