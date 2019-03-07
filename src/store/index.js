import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
const state = {
    memberInfo: {}, // 用户登录信息
    deviceInfo: {}, // 设备信息
    pageData: {}    // 页面之间的数据传递
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: process.env.NODE_ENV !== 'production'
})