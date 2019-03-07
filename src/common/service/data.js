import controller from 'common/logic/controller'
import requesturl from 'common/deploy/requesturl'

export default {
    //获得城市
    getAirLine() {
        return controller.getJSON({
            method: 'POST',
            url: requesturl.FLIGHTLINE
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            return e;
        })
    },
    // 实名认证
    getAuthResult() {
        let params = {};
        if(window._memberInfo){
            params.request = {
                "ffpCardNo": _memberInfo.memberID,
                "ffpId": _memberInfo.id,
                "loginKeyInfo": _memberInfo.loginKeyInfo,
                "token": _memberInfo.token
            }
        }
        return controller.getJSON({
            method: 'POST',
            url: requesturl.AUTH,
            params: params
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            return e;
        })
    },
    // 获取总积分
    getTotalIntegral() {
        let params = {};
        if(window._memberInfo){
            params = {
                "id": _memberInfo.id,
                "loginKeyInfo": _memberInfo.loginKeyInfo
            }
        }
        return controller.getJSON({
            method: 'POST',
            url: requesturl.MYSCORE,
            params: params
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            return e;
        })
    },
    // 获取总积分(new)
    getTotalScore() {
        let params = {};
        if(window._memberInfo){
            params = {
                "ffpId": _memberInfo.id,
                "loginKeyInfo": _memberInfo.loginKeyInfo,
                "memberCardNo": _memberInfo.memberID
            }
        }
        return controller.getJSON({
            method: 'POST',
            url: requesturl.TOTLASCORE,
            params: params
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            return e;
        })
    },
    // 获取可用积分
    getUseIntegral() {
        let params = {};
        if(window._memberInfo){
            params = {
                "ffpId": _memberInfo.id,
                "loginKeyInfo": _memberInfo.loginKeyInfo,
                // "token": "091b75788267907964dd157d0b853464"
            }
        }
        return controller.getJSON({
            method: 'POST',
            url: requesturl.INTEGRAL,
            params: params
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            return e;
        })
    },
    // 获取制作选座信息
    getCheckIn(psg = {}) {
        let params = {};
        //params.withOrder = false;
        if(window._memberInfo){
            //params.withOrder = true;
            params.ffpId = _memberInfo.id;
            params.ffpCardNo = _memberInfo.memberID;
            params.loginKeyInfo = _memberInfo.loginKeyInfo;
        }
        params = Object.assign(params, psg);
        return controller.getJSON({
            method: 'POST',
            url: requesturl.CHECKIN.FLIGHT_TOURS,
            params: params
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            return e;
        })
    },
    // 查询值机信息
    queryBoardingCheck(obj = {}, isloading = true){
        let that = this;
        let params = {}
        if(window._memberInfo){
            params.ffpId = _memberInfo.id;
            params.ffpCardNo = _memberInfo.memberID;
            params.loginKeyInfo = _memberInfo.loginKeyInfo;
        }
        params = Object.assign(params, obj);
        return controller.getJSON({
                method : 'POST',
                url: requesturl.CHECKIN.QUERY_MYCHECKIN,
                params: params,
                isloading: isloading
        })
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e;
        })
    },
    // 查询可改期订单（已登录有数据列表）
    getOrderList(isloading = true) {
        let params = {};
        if(window._memberInfo){
            params.request = {
                ffpId: _memberInfo.id,
                ffpCardNo: _memberInfo.memberID,
                loginKeyInfo: _memberInfo.loginKeyInfo
            }
        }
        return controller.getJSON({
            method: 'POST',
            url: requesturl.CHANGEDATE.ORDER_TICKET_INFO,
            params: params,
            isloading: isloading
        })
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e;
        })
    },
    // 客票查询改期信息（未登录查询、已登录无订单改期信息查询）
    getChangeList(obj) {
        let params = {};
        if(window._memberInfo){
            params.request = {
                ffpId: _memberInfo.id,
                ffpCardNo: _memberInfo.memberID,
                loginKeyInfo: _memberInfo.loginKeyInfo
            }
        }
        Object.assign(params.request, obj)
        return controller.getJSON({
            method: 'POST',
            url: requesturl.CHANGEDATE.CHANGE_TICKET_INFO,
            params: params
        })
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e;
        })
    }
}