// localstorage key

export default {
    MEMBER_INFO: 'MemberInfo',          // 用户登录信息
    DEVICE_INFO: 'deviceInfo',          // 设备信息
    PAGE_DATA: 'pageData',              // open、ready 页面的数据传递
    PAGE_RESULT_CODE: 'pageResultCode', // 使用addEventListener监听storage，用code标记不同的页面
    PAGE_RESULT_DATA: 'pageResultData', // storage发生变化，回调 Data
    TEMP_PAGE_DATA: 'tempPageData',       // 页面操作临时存储
    CHECKIN_HISTORY: 'checkInHistory'  // 保存值机选座历史记录
}