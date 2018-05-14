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
var BaseEuiView = (function (_super) {
    __extends(BaseEuiView, _super);
    /**
     * 构造函数
     * @param $controller 所属模块
     * @param $parent 父级
     */
    function BaseEuiView() {
        var _this = _super.call(this) || this;
        _this._resources = null;
        /**是否一级窗口,一级窗口会把部分主界面遮挡 */
        _this.isTopLevel = false;
        /** 互斥窗口,类名或者类字符串的数组,打开某些窗口会关闭互斥的窗口*/
        _this.exclusionWins = [];
        _this._isInit = false;
        _this.percentHeight = 100;
        _this.percentWidth = 100;
        return _this;
    }
    /**
     * 添加互斥窗口
     * @classOrName 类名或者类字符串
     * */
    BaseEuiView.prototype.addExclusionWin = function (classOrName) {
        if (this.exclusionWins.indexOf(classOrName) == -1)
            this.exclusionWins.push(classOrName);
    };
    /**
     * 获取我的父级
     * @returns {egret.DisplayObjectContainer}
     */
    // public get myParent(): egret.DisplayObjectContainer {
    // 	return this._myParent;
    // }
    /**
     * 设置初始加载资源
     * @param resources
     */
    // public setResources(resources: string[]): void {
    // 	this._resources = resources;
    // }
    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    BaseEuiView.prototype.isInit = function () {
        return this._isInit;
    };
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    // public applyFunc(key: any, ...param: any[]): any {
    // 	return this._controller.applyFunc.apply(this._controller, arguments);
    // }
    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    // public applyControllerFunc(controllerKey: number, key: any, ...param: any[]): any {
    // 	return this._controller.applyControllerFunc.apply(this._controller, arguments);
    // }
    /**
     * 面板是否显示
     * @return
     *
     */
    BaseEuiView.prototype.isShow = function () {
        return this.stage != null && this.visible;
    };
    /**
     * 添加到父级
     */
    BaseEuiView.prototype.addToParent = function (p) {
        p.addChild(this);
    };
    /**
     * 从父级移除
     */
    BaseEuiView.prototype.removeFromParent = function () {
        DisplayUtils.removeFromParent(this);
        this.destoryView();
    };
    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    BaseEuiView.prototype.initUI = function () {
        this._isInit = true;
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    BaseEuiView.prototype.initData = function () {
    };
    /**
     * 销毁
     */
    BaseEuiView.prototype.destroy = function () {
    };
    BaseEuiView.prototype.destoryView = function () {
        TimerManager.ins().removeAll(this);
        ViewManager.ins().destroy(this.hashCode);
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    BaseEuiView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    BaseEuiView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 加载面板所需资源
     */
    BaseEuiView.prototype.loadResource = function (loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            ResourceUtils.ins().loadResource(this._resources, [], loadComplete, null, this);
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, initComplete, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    };
    /**
     * 设置是否隐藏
     * @param value
     */
    BaseEuiView.prototype.setVisible = function (value) {
        this.visible = value;
    };
    BaseEuiView.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return true;
    };
    return BaseEuiView;
}(BaseView));
__reflect(BaseEuiView.prototype, "BaseEuiView", ["IBaseView"]);
//# sourceMappingURL=BaseEuiView.js.map