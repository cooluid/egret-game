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
var NostopGameOverWin = (function (_super) {
    __extends(NostopGameOverWin, _super);
    function NostopGameOverWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'NostopGameOverSkin';
        return _this;
    }
    NostopGameOverWin.prototype.childrenCreated = function () {
        var _this = this;
        this.addTouchEvent(this, function () {
            ViewManager.ins().close(_this);
        });
    };
    return NostopGameOverWin;
}(BaseEuiView));
__reflect(NostopGameOverWin.prototype, "NostopGameOverWin");
ViewManager.ins().reg(NostopGameOverWin, LayerManager.UI_Popup);
//# sourceMappingURL=NostopGameOverWin.js.map