// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import cookies from 'vue-cookies'
// import Amap from 'vue-amap'
// 配置字体图标
import '@/common/css/style.css'

Vue.config.productionTip = false

Vue.use(cookies)
// Vue.use(Amap)

// Amap.initAMapApiLoader({
//   key: '18d247e53e61bf2b4ac3b0bf31669d8b',
//   plugin: [
//     'AMap.Autocomplete',
//     'AMap.PlaceSearch',
//     'AMap.Scale',
//     'AMap.OverView',
//     'AMap.ToolBar',
//     'AMap.MapType',
//     'AMap.PolyEditor',
//     'AMap.CircleEditor'
//   ]
// })

// eslint-disable-next-line handle-callback-err
Vue.config.errorHandler = function (err, vm, info) {
  console.log(vm.errorHandler)
  vm.errorHandler && vm.errorHandler(vm)
  console.error(err)
  console.log(info)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
