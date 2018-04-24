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
//显示基类,用于增加一些显示相关的共有函数
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView() {
        var _this = _super.call(this) || this;
        _this.event = [];
        return _this;
    }
    BaseView.prototype.observe = function (func, myfunc, callobj) {
        if (callobj === void 0) { callobj = undefined; }
        MessageCenter.addListener(func, myfunc, this, callobj);
    };
    BaseView.prototype.removeObserveOne = function (func, myfunc) {
        MessageCenter.ins().removeListener(func.funcallname, myfunc, this);
    };
    BaseView.prototype.removeObserve = function () {
        MessageCenter.ins().removeAll(this);
    };
    BaseView.prototype.addTouchEvent = function (obj, func) {
        this.addEvent(egret.TouchEvent.TOUCH_TAP, obj, func);
    };
    BaseView.prototype.addTouchEndEvent = function (obj, func) {
        this.addEvent(egret.TouchEvent.TOUCH_END, obj, func);
    };
    BaseView.prototype.addChangeEvent = function (obj, func) {
        this.addEvent(egret.TouchEvent.CHANGE, obj, func);
    };
    BaseView.prototype.addEvent = function (ev, obj, func) {
        obj.addEventListener(ev, func, this);
        this.event.push([ev, func, obj]);
    };
    BaseView.prototype.removeEvent = function (ev, obj, func) {
        obj.removeEventListener(ev, func, this);
    };
    BaseView.prototype.removeTouchEvent = function (obj, func) {
        obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
    };
    BaseView.prototype.removeEvents = function () {
        for (var _i = 0, _a = this.event; _i < _a.length; _i++) {
            var ev = _a[_i];
            ev[2].removeEventListener(ev[0], ev[1], this);
        }
    };
    BaseView.prototype.$onClose = function () {
        var fun = function (tar) {
            for (var i = 0; i < tar.numChildren; i++) {
                var obj = tar.getChildAt(i);
                if (obj instanceof BaseView) {
                    obj.$onClose();
                }
                else if (obj instanceof egret.DisplayObjectContainer) {
                    arguments.callee(obj);
                }
                else if (obj["$onClose"]) {
                    obj["$onClose"]();
                }
            }
        };
        fun(this);
        this.removeEvents();
        this.removeObserve();
    };
    BaseView.prototype.setSkinPart = function (partName, instance) {
        var oldInstance = this.skin[partName];
        _super.prototype.setSkinPart.call(this, partName, instance);
        // if (!instance || !this.skin[partName] || this.skin[partName] == instance)
        // 	return;
        if (instance && oldInstance && oldInstance != instance) {
            for (var i = 0; i < BaseView.replaceKeys.length; i++) {
                var key = BaseView.replaceKeys[i];
                instance[key] = oldInstance[key];
            }
            if (instance instanceof eui.BitmapLabel) {
                instance["font"] = oldInstance["$font"];
            }
            var p = oldInstance.parent;
            if (p) {
                var pIndex = p.getChildIndex(oldInstance);
                p.addChildAt(instance, pIndex);
            }
        }
        if (oldInstance != instance) {
            this.skin[partName] = instance;
            DisplayUtils.destroyDisplayObject(oldInstance);
        }
    };
    // setSkinPart(partName: string, instance: any): void {
    // 	super.setSkinPart(partName, instance);
    // 	if (!instance || !this.skin[partName] || this.skin[partName] == instance)
    // 		return;
    // 	let p = this.skin[partName].parent;
    // 	let pIndex = p.getChildIndex(this.skin[partName]);
    // 	DisplayUtils.removeFromParent(this.skin[partName]);
    // 	for (let i = 0; i < BaseView.replaceKeys.length; i++) {
    // 		let key = BaseView.replaceKeys[i];
    // 		instance[key] = this.skin[partName][key];
    // 	}
    // 	if(instance instanceof eui.BitmapLabel){
    // 		instance["font"] = this.skin[partName]["$font"];
    // 	}
    // 	this.skin[partName] = instance;
    // 	p.addChildAt(instance, pIndex);
    // }
    BaseView.replaceKeys = ["x", "y", "alpha", "anchorOffsetX", "anchorOffsetY", "blendMode", "bottom",
        "cacheAsBitmap", "currentState", "enabled", "filters", "height", "horizontalCenter", "hostComponentKey",
        "includeInLayout", "left", "mask", "matrix", "maxHeight", "maxWidth", "minHeight", "minWidth", "name",
        "percentHeight", "percentWidth", "right", "rotation", "scaleX", "scaleY", "scrollRect", "skewX", "skewY",
        "skinName", "top", "touchChildren", "touchEnabled", "verticalCenter", "visible", "width"];
    return BaseView;
}(eui.Component));
__reflect(BaseView.prototype, "BaseView");
