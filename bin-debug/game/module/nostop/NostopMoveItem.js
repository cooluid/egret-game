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
var NostopMoveItem = (function (_super) {
    __extends(NostopMoveItem, _super);
    function NostopMoveItem(_width) {
        var _this = _super.call(this) || this;
        _this.mapWidth = 0;
        _this.skinName = 'NostopMoveItemSkin';
        _this.mapWidth = _width;
        return _this;
    }
    NostopMoveItem.prototype.childrenCreated = function () {
        this.start();
    };
    NostopMoveItem.prototype.start = function () {
        var _this = this;
        // egret.Tween.removeTweens(this);
        var t = egret.Tween.get(this);
        var endX = 0;
        if (this.x > (this.mapWidth / 2 - this.width / 2)) {
            if (this.x != this.mapWidth - this.width) {
                endX = this.mapWidth - this.width;
            }
            else {
                endX = 0;
            }
        }
        else {
            if (this.x != 0) {
                endX = 0;
            }
            else {
                endX = this.mapWidth - this.width;
            }
        }
        t.to({ x: endX }, 2000).call(function () {
            _this.start();
        }, this);
    };
    return NostopMoveItem;
}(BaseView));
__reflect(NostopMoveItem.prototype, "NostopMoveItem");
