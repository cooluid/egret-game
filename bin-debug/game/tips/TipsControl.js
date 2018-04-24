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
/**
 * Tips接口.使用Tips通过这里
 */
var TipsControl = (function (_super) {
    __extends(TipsControl, _super);
    /**
     * 构造函数
     */
    function TipsControl() {
        return _super.call(this) || this;
    }
    /**
     * 获取类的单例
     */
    TipsControl.ins = function () {
        return _super.ins.call(this);
    };
    /**
     * 显示提示
     */
    TipsControl.prototype.showTips = function (str) {
        var view = ViewManager.ins().open(TipsView);
        DelayOptManager.ins().addDelayOptFunction(view, view.showTips, str);
    };
    return TipsControl;
}(BaseClass));
__reflect(TipsControl.prototype, "TipsControl");
