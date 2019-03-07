import Vue from 'vue'
import App from './app.vue'
import { DatePicker, Picker  } from 'cube-ui'
import * as filters from 'common/filter'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(DatePicker)
Vue.use(Picker)
Vue.prototype.$filters = filters

new Vue({
  el: '#app',
  render: h => h(App)
})
