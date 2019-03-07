import Vue from 'vue'
import App from './app.vue'
import { Scroll } from "cube-ui"
Vue.use(Scroll)

new Vue({
  el: '#app',
  render: h => h(App)
})
