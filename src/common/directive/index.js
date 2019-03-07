'use strict';

export const inputfocus = {
    bind(el, binding, vnode) {
        console.log('bind')
    },
    inserted(el, binding, vnode) {
        console.log('inserted')
    },
    update(el, binding, vnode) {
        console.log('update')
    },
    componentUpdated(el, binding, vnode) {
        console.log('componentUpdated')
    },
    unbind(el, binding, vnode) {
        console.log('unbind')
    }
}