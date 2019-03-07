'use strict';

export const formatPsgTitle = (value = '', isDetail = false) => {
    if(isDetail){
        return value;
    } else {
        return value + '申请';
    }
}