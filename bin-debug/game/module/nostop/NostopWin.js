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
var NostopWin = (function (_super) {
    __extends(NostopWin, _super);
    function NostopWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'NostopWinSkin';
        var conf = GlobalConfig.getNostopConfByIndex(1);
        DebugUtils.log(conf);
        SoundManager.ins().playBg('mh_mp3');
        _this.addTouchEvent(_this, function () {
            ViewManager.ins().close(_this);
            ViewManager.ins().open(NostopPlayerWin);
        });
        return _this;
    }
    return NostopWin;
}(BaseEuiView));
__reflect(NostopWin.prototype, "NostopWin");
ViewManager.ins().reg(NostopWin, LayerManager.UI_Main);
//# sourceMappingURL=NostopWin.js.map