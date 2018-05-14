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
var ChickRunCarItem = (function (_super) {
    __extends(ChickRunCarItem, _super);
    function ChickRunCarItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'ChickRunCarItemSkin';
        return _this;
    }
    ChickRunCarItem.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        //test
        // let shape = new egret.Shape();
        // shape.graphics.beginFill(0x0000ff);
        // shape.graphics.drawRect(0, 0, 80, 45);
        // shape.graphics.endFill();
        // this.addChild(shape);
    };
    return ChickRunCarItem;
}(BaseView));
__reflect(ChickRunCarItem.prototype, "ChickRunCarItem");
//# sourceMappingURL=ChickRunCarItem.js.map