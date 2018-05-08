var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DebugUtils = (function () {
    function DebugUtils() {
    }
    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    DebugUtils.isOpen = function (flag) {
        this._isOpen = flag;
    };
    Object.defineProperty(DebugUtils, "isDebug", {
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        get: function () {
            return window['isDebug'] ? window['isDebug'] : false;
        },
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        set: function (value) {
            window['isDebug'] = value;
        },
        enumerable: true,
        configurable: true
    });
    DebugUtils.log = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (DebugUtils.isDebug)
            console.log.apply(console, [msg].concat(param));
    };
    DebugUtils.warn = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (DebugUtils.isDebug)
            console.warn.apply(console, [msg].concat(param));
    };
    DebugUtils.error = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (DebugUtils.isDebug)
            console.error.apply(console, [msg].concat(param));
    };
    DebugUtils.info = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (DebugUtils.isDebug)
            console.info.apply(console, [msg].concat(param));
    };
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    DebugUtils.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
     *
     */
    DebugUtils.stop = function (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            console.log(key + ": " + cha);
        }
        return cha;
    };
    /**
     * 设置时间间隔阈值
     * @param value
     */
    DebugUtils.setThreshold = function (value) {
        this._threshold = value;
    };
    DebugUtils._startTimes = {};
    DebugUtils._threshold = 3;
    return DebugUtils;
}());
__reflect(DebugUtils.prototype, "DebugUtils");
