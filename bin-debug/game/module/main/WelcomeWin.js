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
var WelcomeWin = (function (_super) {
    __extends(WelcomeWin, _super);
    function WelcomeWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'WelcomeSkin';
        return _this;
    }
    WelcomeWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        // this.imgTest.source = `${RES_MUST}cover.jpg`;
        var t = egret.Tween.get(this.labTip, { loop: true });
        t.to({ alpha: 0 }, 800).to({ alpha: 1 }, 800);
        this.addTouchEvent(this, function () {
            ViewManager.ins().close(WelcomeWin);
            ViewManager.ins().open(MainWin);
        });
    };
    return WelcomeWin;
}(BaseEuiView));
__reflect(WelcomeWin.prototype, "WelcomeWin");
ViewManager.ins().reg(WelcomeWin, LayerManager.UI_Main);
//# sourceMappingURL=WelcomeWin.js.map