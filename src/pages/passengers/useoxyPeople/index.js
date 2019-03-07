import Vue from 'vue'
import App from './app.vue'
import { DatePicker } from 'cube-ui'
import * as filters from 'common/filter'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(DatePicker)
Vue.prototype.$filters = filters

new Vue({
  el: '#app',
  render: h => h(App)
})
