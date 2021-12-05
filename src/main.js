import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Canvas from '@/assets/js/canvas-nest.min.js'
// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import echarts from 'echarts'
import ECharts from 'vue-echarts'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Viewer from 'v-viewer' // 图片预览
import 'viewerjs/dist/viewer.css'

import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control
import JsonViewer from 'vue-json-viewer'

Vue.use(JsonViewer);
Vue.use(Canvas)
Vue.use(ElementUI, { size: 'small' })
Vue.use(Viewer)
Vue.prototype.$echarts = echarts
Vue.component('v-chart',ECharts)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
