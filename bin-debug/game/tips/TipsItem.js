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
 * 提示项
 */
var TipsItem = (function (_super) {
    __extends(TipsItem, _super);
    /**
     * 构造函数
     */
    function TipsItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "tips_skin";
        return _this;
    }
    Object.defineProperty(TipsItem.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (str) {
            var _this = this;
            this._content = str;
            this.label.textFlow = TextFlowMaker.generateTextFlow(str);
            this.bg.y = 0;
            this.bg.alpha = 1;
            // this.bg.width = this.label.width + 80;
            this.bg.bottom = 0;
            this.label.alpha = 1;
            this.label.bottom = 0;
            var tween1 = egret.Tween.get(this.bg);
            tween1.to({ "bottom": 30 }, 500).wait(500).to({ "alpha": 0 }, 200).call(function () {
                DisplayUtils.removeFromParent(_this);
            }, this);
            var tween2 = egret.Tween.get(this.label);
            tween2.to({ "bottom": 30 }, 500).wait(500).to({ "alpha": 0 }, 200);
        },
        enumerable: true,
        configurable: true
    });
    return TipsItem;
}(BaseView));
__reflect(TipsItem.prototype, "TipsItem");
//# sourceMappingURL=TipsItem.js.map