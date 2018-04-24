var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Debug = (function () {
    function Debug() {
    }
    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    Debug.isOpen = function (flag) {
        this._isOpen = flag;
    };
    Object.defineProperty(Debug, "isDebug", {
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        get: function () {
            return window['isDebug'] ? window['isDebug'] : false;
        },
        enumerable: true,
        configurable: true
    });
    Debug.log = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (Debug.isDebug) {
            egret.log(msg, param);
        }
    };
    Debug.warn = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (Debug.isDebug) {
            egret.warn(msg, param);
        }
    };
    Debug.error = function (msg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        egret.error(msg, param);
    };
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    Debug.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
     *
     */
    Debug.stop = function (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Debug.log(key + ": " + cha);
        }
        return cha;
    };
    /**
     * 设置时间间隔阈值
     * @param value
     */
    Debug.setThreshold = function (value) {
        this._threshold = value;
    };
    Debug._startTimes = {};
    Debug._threshold = 3;
    return Debug;
}());
__reflect(Debug.prototype, "Debug");
