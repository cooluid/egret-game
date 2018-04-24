var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ViewManager = (function (_super) {
    __extends(ViewManager, _super);
    function ViewManager() {
        var _this = _super.call(this) || this;
        _this.filters = ["TipsView"];
        _this._regesterInfo = {};
        _this._views = {};
        _this._hCode2Key = {};
        _this._opens = [];
        return _this;
    }
    ViewManager.ins = function () {
        return _super.ins.call(this);
    };
    /**
     * 清空处理
     */
    ViewManager.prototype.clear = function () {
        this.closeAll();
        this._views = {};
    };
    /**
     * 面板注册
     * @param viewClass 面板类
     * @param layer 层级
     */
    ViewManager.prototype.reg = function (viewClass, layer) {
        if (viewClass == null) {
            return;
        }
        var keys = egret.getQualifiedClassName(viewClass);
        if (this._regesterInfo[keys]) {
            return;
        }
        this._regesterInfo[keys] = [viewClass, layer];
    };
    /**
     * 销毁一个面板
     * @param hCode
     */
    ViewManager.prototype.destroy = function (hCode) {
        var keys = this._hCode2Key[hCode];
        delete this._views[keys];
    };
    ViewManager.prototype.getKey = function (nameOrClass) {
        var key = "";
        if (typeof (nameOrClass) == "string")
            key = nameOrClass;
        else if (typeof (nameOrClass) == "function")
            key = egret.getQualifiedClassName(nameOrClass);
        else if ((nameOrClass) instanceof BaseEuiView) {
            var keys = Object.keys(this._views);
            for (var i = 0, len = keys.length; i < len; i++) {
                var tempKey = keys[i];
                if (this._views[tempKey] == nameOrClass) {
                    key = tempKey;
                    break;
                }
            }
        }
        else
            DebugUtils.log("打开界面只支持类名和类名的字符串形式,关闭界面只支持类名和类名的字符串以及类的实例形式,错误编号:" + nameOrClass);
        return key;
    };
    /**
     * 检测能否开启
     * @param key 类名
     * @param param
     * @returns {boolean}
     */
    ViewManager.prototype.viewOpenCheck = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var result = true; //为什么默认是true，当info为空时应该返回null？
        var info = this._regesterInfo[key];
        if (info != null) {
            var c = info[0];
            var f = c["openCheck"];
            if (f != null) {
                result = f.apply(void 0, param);
            }
        }
        return result;
    };
    ViewManager.prototype.toggleWin = function (nameOrClass) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var isShow = this.isShow(nameOrClass);
        if (isShow) {
            ViewManager.ins().close(nameOrClass);
        }
        else {
            ViewManager.ins().open(nameOrClass);
        }
        return null;
    };
    ViewManager.prototype.openByScript = function (param) {
        if (param.length > 1) {
            var winParam = param.slice(1, param.length);
            ViewManager.ins().open(param[0], winParam);
        }
        else {
            ViewManager.ins().open(param[0]);
        }
    };
    /**
     * 统一打开窗口函数
     * @param nameOrClass 类名,类字符串名,或者类对象
     * @param param 打开窗口传入的参数
     *  */
    ViewManager.prototype.open = function (nameOrClass) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var key = this.getKey(nameOrClass);
        //检测能否开启
        if (this.viewOpenCheck.apply(this, [key].concat(param)) == false) {
            return null;
        }
        var view = this.openEasy(key, param);
        if (view) {
            this.checkOpenView(view);
            DebugUtils.log("成功打开窗口:" + key);
        }
        else {
            // DebugUtils.log("成功打开窗口:" + key);
        }
        return view;
    };
    //简单的打开一个界面
    ViewManager.prototype.openEasy = function (nameOrClass, param) {
        if (param === void 0) { param = null; }
        var keys = this.getKey(nameOrClass);
        var view = this._views[keys];
        var info = this._regesterInfo[keys];
        if (!view) {
            //参数参考this.register函数
            view = new info[0]();
            // view.$setParent(info[1]);
            this._views[keys] = view;
            this._hCode2Key[view.hashCode] = keys;
        }
        if (view == null) {
            Debug.log("UI_" + keys + "不存在");
            return null;
        }
        //关闭互斥窗口
        for (var _i = 0, _a = view.exclusionWins; _i < _a.length; _i++) {
            var exclusionWin = _a[_i];
            this.closeEasy(exclusionWin);
        }
        if (view.isShow() || view.isInit()) {
            view.open.apply(view, param); //第一个参数表示函数运行的作用域，第二个是参数数组
            view.addToParent(info[1]);
        }
        else {
            this.openWin();
            view.loadResource(function () {
                view.addToParent(info[1]);
                view.setVisible(false);
            }.bind(this), function () {
                view.initUI();
                view.initData();
                view.open.apply(view, param);
                view.setVisible(true);
                this.openWinCom();
            }.bind(this));
        }
        if (this._opens.indexOf(keys) == -1)
            this._opens.push(keys);
        return view;
    };
    ViewManager.prototype.checkOpenView = function (view) {
        if (view.isTopLevel) {
            this.openTopWin();
            // GameMap.ins().removeFromParent();
        }
    };
    //----------------------------------------------------关闭-------------------------------------
    /**
     * 统一关闭窗口函数
     * @param nameOrClass 类名,类字符串名,或者类对象
     * @param param 关闭传入的参数
     **/
    ViewManager.prototype.close = function (nameOrClass) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var key = this.getKey(nameOrClass);
        // DebugUtils.log("开始关闭窗口" + key);
        var view = this.closeEasy(key, param);
        if (view) {
            this.checkCloseView();
            // DebugUtils.log("成功关闭窗口" + key);
        }
        else {
            // DebugUtils.log("窗口不存在" + key);
        }
    };
    //简单关闭一个窗口
    ViewManager.prototype.closeEasy = function (nameOrClass) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (!this.isShow(nameOrClass)) {
            return null;
        }
        var key = this.getKey(nameOrClass);
        var view = this.getView(key);
        if (view) {
            var viewIndex = this._opens.indexOf(key);
            if (viewIndex >= 0) {
                this._opens.splice(viewIndex, 1);
            }
            view.close.apply(view, param);
            view.$onClose.apply(view);
            view.removeFromParent();
        }
        return view;
    };
    ViewManager.prototype.checkCloseView = function () {
        var hasTopLevelWin = false; //是否有一级窗口
        for (var _i = 0, _a = this._opens; _i < _a.length; _i++) {
            var key = _a[_i];
            var win = this.getView(key);
            if (win && win.isTopLevel) {
                hasTopLevelWin = true;
                break;
            }
        }
        if (!hasTopLevelWin) {
            this.closeTopWin();
            // GameMap.ins().addToParent();
        }
    };
    ViewManager.prototype.openTopWin = function () {
    };
    ViewManager.prototype.closeTopWin = function () {
    };
    ViewManager.prototype.openWin = function () {
    };
    ViewManager.prototype.openWinCom = function () {
    };
    /**
     * 获取一个UI对象
     * 返回null代表未初始化
     * @param nameOrClass  类名,类字符串名,或者类对象
     * @returns BaseEuiView
     */
    ViewManager.prototype.getView = function (nameOrClass) {
        var keys = this.getKey(nameOrClass);
        // if (this._views[keys] instanceof Array)
        // 	return null;
        return this._views[keys];
    };
    /**
     * 关闭所有开启中的UI
     */
    ViewManager.prototype.closeAll = function () {
        while (this._opens.length) {
            this.closeEasy(this._opens[0], []);
        }
        this.checkCloseView();
    };
    /**
     * 关闭所有一级界面
     */
    ViewManager.prototype.closeTopLevel = function () {
        for (var i = this._opens.length - 1; i >= 0; i--) {
            var keys = this._opens[i];
            var view = this.getView(keys);
            if (view.isTopLevel)
                this.closeEasy(keys, []);
        }
        this.checkCloseView();
    };
    /**
     * 当前ui打开数量
     * @returns {number}
     */
    ViewManager.prototype.openNum = function () {
        return this._opens.length;
    };
    /**
     * 检测一个UI是否开启中
     * @param nameOrClass 类名,类字符串名,或者类对象
     * @returns {boolean}
     */
    ViewManager.prototype.isShow = function (nameOrClass) {
        return this._opens.indexOf(this.getKey(nameOrClass)) >= 0;
    };
    return ViewManager;
}(BaseClass));
__reflect(ViewManager.prototype, "ViewManager");
