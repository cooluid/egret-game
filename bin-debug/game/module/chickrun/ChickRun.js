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
/**
 * 绝地跑鸡
 */
var ChickRun = (function (_super) {
    __extends(ChickRun, _super);
    function ChickRun() {
        return _super.call(this) || this;
    }
    ChickRun.ins = function () {
        return _super.ins.call(this);
    };
    return ChickRun;
}(BaseSystem));
__reflect(ChickRun.prototype, "ChickRun");
var GameSystem;
(function (GameSystem) {
    var chickRun = ChickRun.ins.bind(ChickRun);
})(GameSystem || (GameSystem = {}));
//# sourceMappingURL=ChickRun.js.map