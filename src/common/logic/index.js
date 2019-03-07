'use strict';

/**
 * juneYaoAir modules is used to separate different device environment to excute the matched invoke function
 * @APP need import JSBridge first
 */

import device from './device';
const juneYaoAirPro = {
    clientType: device,
    clientControl: ({ juneYaoCallback, normalCallback, wxCallback } = {}) => {
        if (juneYaoAirPro.clientType.isApp && typeof juneYaoCallback === 'function') {
            if (!!window.JSBridge) {
                juneYaoCallback();
            } else {
                document.addEventListener('JSBridgeReady', function() {
                    juneYaoCallback();
                }, false);
            }
        }
        if (juneYaoAirPro.clientType.isWeixin && typeof wxCallback === 'function') {
            wxCallback();
        }
        if (juneYaoAirPro.clientType.browser && typeof normalCallback === 'function') {
            normalCallback();
        }
    },
    init: () => {
        (function(w) {
            if (/msie|applewebkit.+ios/i.test(w.navigator.userAgent)) {
                var _sort = Array.prototype.sort,
                    _find = Array.prototype.find,
                    _findIndex = Array.prototype.findIndex;

                Array.prototype.sort = function(a) {
                    if (!a || a.constructor !== Function)
                        return _sort.call(this);

                    if (this.length < 2) return this;
                    for (var i = 0, l = this.length; i < l; i++) {
                        for (var j = i + 1, l = this.length; j < l; j++) {
                            if (a && !!a.call(this, this[i], this[j])) {
                                var tmp = this[i];
                                this[i] = this[j];
                                this[j] = tmp;
                            }
                        }
                    }
                    return this;
                }

                Array.prototype.find = function(a) {
                    if (!a || a.constructor !== Function)
                        return _find.call(this);

                    for (var i = 0, l = this.length; i < l; i++) {
                        if (a && !!a.call(this, this[i], i, this)) return this[i];
                    }
                    return undefined;
                }

                Array.prototype.findIndex = function(a) {
                    if (!a || a.constructor !== Function)
                        return _findIndex.call(this);

                    for (var i = 0, l = this.length; i < l; i++) {
                        if (a && !!a.call(this, this[i], i, this)) return i;
                    }
                    return -1;
                }
            }
        })(window);
        return juneYaoAirPro;
    }
}

window.juneYaoAir = juneYaoAirPro.init();

export { juneYaoAir }
