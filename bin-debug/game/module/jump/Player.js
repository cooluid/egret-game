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
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.skinName = 'PlayerSkin';
        return _this;
    }
    Player.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.mc = new MovieClip();
        this.mcGrp.addChild(this.mc);
        this.mc.anchorOffsetX = this.width / 2;
        this.mc.anchorOffsetY = this.height / 2;
    };
    Player.prototype.playMC = function (dir) {
        this.mc.scaleX = dir;
        this.mc.playFile(RES_DIR_EFF + "robotJump", 1, null, false);
    };
    Player.prototype.playerDied = function (n) {
    };
    return Player;
}(BaseView));
__reflect(Player.prototype, "Player");
