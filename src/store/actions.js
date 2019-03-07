import juneYaoAir from 'common/logic/index'
import { controller } from 'common/logic/controller'
import { isNullOrEmpty, isEmptyObject } from 'common/logic/utils'
import lsKey from 'common/deploy/localstorage'

export default {
    // 页面初始化操作，用来获取 用户登录信息、设备信息、页面间的数据传递
    ready ({ commit, state }) {
        return new Promise((resolve, reject) => {
            juneYaoAir.clientControl({
               juneYaoCallback () {
                    JSBridge.addEvent("ready", function(data) {
                        const dataObj = data && data[0] ? data[0] : {};
                        
                        window._memberInfo = dataObj.memberInfo;
                        window._deviceInfo = dataObj.deviceInfo;
                        window._pageData = dataObj.data;

                        if(!isNullOrEmpty(dataObj.memberInfo)){
                            commit('SET_MEMBERINFO', dataObj.memberInfo);
                        }
                        if(!isNullOrEmpty(dataObj.deviceInfo)){
                            commit('SET_DEVICEINFO', dataObj.deviceInfo);
                        }
                        if(!isNullOrEmpty(dataObj.data)) {
                            commit('SET_PAGEDATA', dataObj.data);
                        }
                        resolve('成功 juneYaoCallback');
                    });
                }, 
                normalCallback () {
                    const memberInfo = controller.getStorage(lsKey.MEMBER_INFO);
                    const pageData = controller.getStorage(lsKey.PAGE_DATA);
                    const deviceInfo = require('common/config');
                    
                    window._memberInfo = memberInfo;
                    window._deviceInfo = deviceInfo;
                    window._pageData = pageData;

                    if(!isNullOrEmpty(memberInfo)){
                        commit('SET_MEMBERINFO', memberInfo);
                    }
                    if(!isNullOrEmpty(deviceInfo)){
                        commit('SET_DEVICEINFO', deviceInfo);
                    }
                    if(!isNullOrEmpty(pageData)) {
                        commit('SET_PAGEDATA', pageData);
                    }
                    controller.clearStorage(lsKey.PAGE_DATA);
                    resolve('成功 normalCallback');
                }, 
                wxCallback () {

                }
            })
        })
    }
}