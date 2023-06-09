// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui' // 新添加
import ECharts from 'vue-echarts' // refers to components/ECharts.vue in webpack
// import ECharts modules manually to reduce bundle size
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
// If you want to use ECharts extensions, just import the extension package and it will work
// Taking ECharts-GL as an example:
// You only need to install the package with `npm install --save echarts-gl` and import it as follows
// import 'echarts-gl'
import 'element-ui/lib/theme-chalk/index.css' // 新添加

Vue.config.productionTip = false
Vue.use(ElementUI) // 新添加
// register component to use
Vue.component('ECharts', ECharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
