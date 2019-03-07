import Vue from 'vue'
import App from './app.vue'
import { DatePicker, Picker } from 'cube-ui'

Vue.use(Picker)
Vue.use(DatePicker)
new Vue({
  el: '#app',
  render: h => h(App)
})
