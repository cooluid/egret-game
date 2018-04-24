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
var NostopPlayer = (function (_super) {
    __extends(NostopPlayer, _super);
    function NostopPlayer() {
        return _super.call(this) || this;
    }
    NostopPlayer.prototype.initScene = function () {
        //创建主角色移动
        this.mainPlayer = this.mainPlayer || new NostopMainItem();
        this.mainPlayer.x = this.width / 2;
        this.mainPlayer.y = this.height / 2;
    };
    return NostopPlayer;
}(BaseView));
__reflect(NostopPlayer.prototype, "NostopPlayer");
