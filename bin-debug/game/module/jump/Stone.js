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
var Stone = (function (_super) {
    __extends(Stone, _super);
    function Stone(res) {
        var _this = _super.call(this) || this;
        _this.skinName = 'StoneSkin';
        _this.res = res;
        return _this;
    }
    Stone.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.createStone();
    };
    Stone.prototype.createStone = function () {
        if (this.res == '0')
            return;
        this.icon.source = "img_" + this.res;
    };
    Stone.prototype.stoneDown = function () {
        var t = egret.Tween.get(this);
        var endY = this.y + 300;
        var self = this;
        t.to({ y: endY }, 300).call(function () {
            ObjectPool.push(self);
            DisplayUtils.removeFromParent(self);
        }, this);
    };
    return Stone;
}(BaseView));
__reflect(Stone.prototype, "Stone");
//# sourceMappingURL=Stone.js.map