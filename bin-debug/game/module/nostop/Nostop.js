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
var Nostop = (function (_super) {
    __extends(Nostop, _super);
    function Nostop() {
        return _super.call(this) || this;
    }
    Nostop.ins = function () {
        return _super.ins.call(this);
    };
    return Nostop;
}(BaseSystem));
__reflect(Nostop.prototype, "Nostop");
var GameSystem;
(function (GameSystem) {
    GameSystem.nostop = Nostop.ins.bind(Nostop);
})(GameSystem || (GameSystem = {}));
//# sourceMappingURL=Nostop.js.map