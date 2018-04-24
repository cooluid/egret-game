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
 * 提示视图
 */
var TipsView = (function (_super) {
    __extends(TipsView, _super);
    /**
     * 构造函数
     */
    function TipsView() {
        var _this = _super.call(this) || this;
        _this.tipsList = [];
        return _this;
    }
    TipsView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.touchEnabled = false;
        this.touchChildren = false;
    };
    TipsView.prototype.showTips = function (str) {
        var tipsItem = ObjectPool.pop("TipsItem");
        //解析掉落物的文本信息
        if (str.indexOf("获得[<#c") != -1) {
            var tStr1 = str.split("[<");
            str = tStr1[0] + "<font color=";
            var tStr2 = tStr1[1].split("#");
            str += tStr2[1].slice(1) + ">";
            var tStr3 = tStr2[2].split("/");
            str += tStr3[0] + "</font> ";
            var tStr4 = tStr3[1].split("]");
            str += tStr4[1];
        }
        tipsItem.content = str;
        tipsItem.right = 0;
        this.addChild(tipsItem);
        this.tipsList.unshift(tipsItem);
        tipsItem.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTips, this);
        var size = this.tipsList.length;
        for (var i = size - 1; i >= 0; i--) {
            egret.Tween.removeTweens(this.tipsList[i]);
            var tween = egret.Tween.get(this.tipsList[i]);
            tween.to({ "bottom": 150 + i * 30 }, 100)
                .to({ "bottom": 150 + (i + 1) * 30 }, 4000);
        }
    };
    TipsView.prototype.removeTips = function (e) {
        var index = this.tipsList.indexOf(e.currentTarget);
        this.tipsList.splice(index, 1);
        egret.Tween.removeTweens(e.currentTarget);
        e.currentTarget.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTips, this);
        ObjectPool.push(e.currentTarget); //放入对象池
    };
    return TipsView;
}(BaseEuiView));
__reflect(TipsView.prototype, "TipsView");
ViewManager.ins().reg(TipsView, LayerManager.UI_Tips);
