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
var ChickRunOverWin = (function (_super) {
    __extends(ChickRunOverWin, _super);
    function ChickRunOverWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'ChickRunOverWinSkin';
        return _this;
    }
    ChickRunOverWin.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.addTouchEvent(this, function () {
            var vm = ViewManager.ins();
            vm.close(_this);
            vm.close(GameSceneView);
            vm.open(ChickRunWin);
        });
    };
    return ChickRunOverWin;
}(BaseEuiView));
__reflect(ChickRunOverWin.prototype, "ChickRunOverWin");
ViewManager.ins().reg(ChickRunOverWin, LayerManager.UI_Popup);
//# sourceMappingURL=ChickRunOverWin.js.map