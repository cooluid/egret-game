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
var NostopPlayerWin = (function (_super) {
    __extends(NostopPlayerWin, _super);
    function NostopPlayerWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'NostopPlayerWinSkin';
        return _this;
    }
    NostopPlayerWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.initScene();
    };
    NostopPlayerWin.prototype.initScene = function () {
        //创建主角色移动
        this.mainPlayer = this.mainPlayer || new NostopMainItem();
        this.mainPlayer.x = this.width / 2;
        this.mainPlayer.y = this.height - this.mainPlayer.height - 300;
        this.addChild(this.mainPlayer);
    };
    return NostopPlayerWin;
}(BaseEuiView));
__reflect(NostopPlayerWin.prototype, "NostopPlayerWin");
ViewManager.ins().reg(NostopPlayerWin, LayerManager.UI_Popup);
