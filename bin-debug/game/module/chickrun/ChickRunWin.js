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
/**绝地跑鸡主窗口 */
var ChickRunWin = (function (_super) {
    __extends(ChickRunWin, _super);
    function ChickRunWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'ChickRunWinSkin';
        return _this;
    }
    ChickRunWin.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        SoundManager.ins().playBg('mh_mp3');
        this.addTouchEvent(this.btnStart, function () {
            var vms = ViewManager.ins();
            vms.close(_this);
            vms.open(GameSceneView);
        });
    };
    return ChickRunWin;
}(BaseEuiView));
__reflect(ChickRunWin.prototype, "ChickRunWin");
ViewManager.ins().reg(ChickRunWin, LayerManager.UI_Main);
//# sourceMappingURL=ChickRunWin.js.map