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
var ChickRunMain = (function (_super) {
    __extends(ChickRunMain, _super);
    function ChickRunMain() {
        var _this = _super.call(this) || this;
        _this.skinName = 'ChickRunMainSkin';
        return _this;
    }
    ChickRunMain.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.grp.anchorOffsetX = this.grp.anchorOffsetY = 42;
        this.show();
    };
    ChickRunMain.prototype.show = function () {
        egret.Tween.get(this, { loop: true }).to({ rotation: -20 }, 150).to({ rotation: 0 }, 150);
    };
    ChickRunMain.ins = function () {
        if (!this._instance)
            this._instance = new ChickRunMain();
        return this._instance;
    };
    return ChickRunMain;
}(BaseView));
__reflect(ChickRunMain.prototype, "ChickRunMain");
//# sourceMappingURL=ChickRunMain.js.map