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
var BaseSystem = (function (_super) {
    __extends(BaseSystem, _super);
    function BaseSystem() {
        var _this = _super.call(this) || this;
        //必须在init前
        // let cls = egret.getDefinitionByName(egret.getQualifiedClassName(this));
        // MessageCenter.compile(cls);
        _this.observe(GameApp.postLoginInit, _this.initLogin);
        return _this;
    }
    BaseSystem.prototype.regNetMsg = function (msgId, fun) {
        GameSocket.ins().registerSTCFunc(this.sysId, msgId, fun, this);
    };
    /**
     * 游戏登录初始化
     */
    BaseSystem.prototype.initLogin = function () {
    };
    /**
     * 从对象池获取一个bytes对象
     */
    BaseSystem.prototype.getGameByteArray = function () {
        return GameSocket.ins().getBytes();
    };
    BaseSystem.prototype.getBytes = function (msgId) {
        var bytes = this.getGameByteArray();
        bytes.writeCmd(this.sysId, msgId);
        return bytes;
    };
    BaseSystem.prototype.sendBaseProto = function (msgId) {
        var bytes = this.getGameByteArray();
        bytes.writeCmd(this.sysId, msgId);
        this.sendToServer(bytes);
    };
    /**
     * 发送到服务器
     * @param bytes
     */
    BaseSystem.prototype.sendToServer = function (bytes) {
        GameSocket.ins().sendToServer(bytes);
    };
    BaseSystem.prototype.observe = function (func, myFunc) {
        MessageCenter.addListener(func, myFunc, this);
    };
    BaseSystem.prototype.removeObserveOne = function (func, myFunc) {
        MessageCenter.ins().removeListener(func.funcallname, myFunc, this);
    };
    BaseSystem.prototype.removeObserve = function () {
        MessageCenter.ins().removeAll(this);
    };
    BaseSystem.prototype.associated = function (fun) {
        var funs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funs[_i - 1] = arguments[_i];
        }
        for (var _a = 0, funs_1 = funs; _a < funs_1.length; _a++) {
            var i = funs_1[_a];
            this.observe(i, fun);
        }
    };
    return BaseSystem;
}(BaseClass));
__reflect(BaseSystem.prototype, "BaseSystem");
