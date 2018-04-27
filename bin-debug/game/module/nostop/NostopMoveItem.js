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
    function NostopMoveItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'NostopMoveItemSkin';
        return _this;
    }
    return NostopMoveItem;
}(BaseView));
__reflect(NostopMoveItem.prototype, "NostopMoveItem");
//# sourceMappingURL=NostopMoveItem.js.map