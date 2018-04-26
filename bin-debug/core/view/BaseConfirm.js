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
var BaseConfirm = (function (_super) {
    __extends(BaseConfirm, _super);
    function BaseConfirm() {
        var _this = _super.call(this) || this;
        _this.skinName = "confirm_skin";
        return _this;
    }
    BaseConfirm.show = function (msg, btnLabels, callBackIds, callBack, thisObj) {
    };
    return BaseConfirm;
}(BaseView));
__reflect(BaseConfirm.prototype, "BaseConfirm");
//# sourceMappingURL=BaseConfirm.js.map