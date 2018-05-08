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
var BaseItemRender = (function (_super) {
    __extends(BaseItemRender, _super);
    function BaseItemRender() {
        var _this = _super.call(this) || this;
        _this._data = null;
        _this._selected = false;
        _this.itemIndex = -1;
        _this.touchCaptured = false;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
        return _this;
    }
    /**
     * 淡入效果
     * showIndex 淡入个数
     */
    BaseItemRender.prototype.fadeIn = function (showIndex) {
        if (showIndex === void 0) { showIndex = -1; }
        var childIndex = this.parent.getChildIndex(this);
        //超过的不播放淡入效果
        if (showIndex != -1 && showIndex < childIndex) {
            return;
        }
        for (var i = 0; i < this.numChildren; i++) {
            var child = this.getChildAt(i);
            if (!child.visible)
                continue;
            var tx = child.x;
            child.x = tx - this.width;
            var tw = egret.Tween.get(child);
            tw.wait(200 * this.parent.getChildIndex(this)).to({ x: tx }, 200);
        }
    };
    BaseItemRender.prototype.onTouchCancle = function (event) {
        this.touchCaptured = false;
        var stage = event.$currentTarget;
        stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
        stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
        this.invalidateState();
        this.invalidateDisplayList();
    };
    BaseItemRender.prototype.onTouchBegin = function (event) {
        this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
        this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
        this.touchCaptured = true;
        this.invalidateState();
        event.updateAfterEvent();
    };
    BaseItemRender.prototype.onStageTouchEnd = function (event) {
        var stage = event.$currentTarget;
        stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
        stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
        this.touchCaptured = false;
        this.invalidateState();
    };
    BaseItemRender.prototype.getCurrentState = function () {
        var state = "up";
        if (this.touchCaptured) {
            state = "down";
        }
        if (this._selected) {
            var selectedState = state + "AndSelected";
            var skin = this.skin;
            if (skin && skin.hasState(selectedState)) {
                return selectedState;
            }
            return state == "disabled" ? "disabled" : "down";
        }
        return state;
    };
    Object.defineProperty(BaseItemRender.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
            this.dataChanged();
        },
        enumerable: true,
        configurable: true
    });
    BaseItemRender.prototype.dataChanged = function () {
    };
    Object.defineProperty(BaseItemRender.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            if (this._selected == value)
                return;
            this._selected = value;
            this.invalidateState();
        },
        enumerable: true,
        configurable: true
    });
    return BaseItemRender;
}(BaseView));
__reflect(BaseItemRender.prototype, "BaseItemRender", ["eui.IItemRenderer", "eui.UIComponent", "egret.DisplayObject"]);
eui.registerBindable(BaseItemRender.prototype, "data");
