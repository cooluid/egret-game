var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DisplayObject = egret.DisplayObject;
/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
var DisplayUtils = (function () {
    function DisplayUtils() {
    }
    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    DisplayUtils.createBitmap = function (resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    };
    /**
     * 创建一个ToggleButton
     * @param skinName 皮肤名称
    */
    DisplayUtils.createToggleButton = function (parent, skinName) {
        var result = new eui.ToggleButton();
        result.skinName = skinName;
        parent.addChild(result);
        return result;
    };
    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {eui.Image}
     */
    DisplayUtils.createEuiImage = function (parent, resName, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var result = new eui.Image();
        result.x = x;
        result.y = y;
        result.source = resName;
        parent.addChild(result);
        return result;
    };
    /**
     * 从父级移除child
     * @param child
     */
    DisplayUtils.removeFromParent = function (child) {
        if (!child || child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    /**
     * 创建Label
     * @param 内容
     * @returns {egret.Label}
     */
    DisplayUtils.createEuiLabelText = function (parent, value, x, y, size) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var result = new eui.Label();
        result.x = x;
        result.y = y;
        result.text = value;
        result.size = size;
        result.fontFamily = "黑体";
        parent.addChild(result);
        return result;
    };
    /**
     * 创建Label 富文本
     * @param 内容
     * @returns {egret.Label}
     */
    DisplayUtils.createEuiLabelTextFlow = function (parent, value, x, y, size, fontFamily) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (size === void 0) { size = 22; }
        if (fontFamily === void 0) { fontFamily = "黑体"; }
        var result = new eui.Label();
        result.x = x;
        result.y = y;
        result.textFlow = new egret.HtmlTextParser().parser(value);
        result.size = size;
        result.fontFamily = fontFamily;
        parent.addChild(result);
        return result;
    };
    /**
     * 创建Label
     * @param 内容
     * @x
     * @p
     * @returns {egret.Label}
     */
    DisplayUtils.createEuiLabelXY = function (parent, value, x, y) {
        var result = new eui.Label();
        result.text = value;
        result.x = x;
        result.y = y;
        parent.addChild(result);
        return result;
    };
    /**
     * 震动指定的显示对象
     * @param target 震动的对象
     * @param range 震动幅度 单位像素
     * @param duration 一组震动（四方向）持续的时间
     * @param times 震动的次数 （4方向为一次）
     * @param condition 条件 传入判断的方法 执行返回false则不执行震动
     */
    DisplayUtils.shakeIt = function (target, range, duration, times, condition) {
        if (times === void 0) { times = 1; }
        if (condition === void 0) { condition = function () {
            return true;
        }; }
        if (!target || times < 1 || !condition())
            return;
        var isShaking = DisplayUtils.shakingList[target.hashCode];
        if (isShaking) {
            // DebugUtils.warn("shake twice");
            return;
        }
        DisplayUtils.shakingList[target.hashCode] = true;
        var shakeSet = [
            { anchorOffsetX: 0, anchorOffsetY: -range },
            { anchorOffsetX: -range, anchorOffsetY: 0 },
            { anchorOffsetX: range, anchorOffsetY: 0 },
            { anchorOffsetX: 0, anchorOffsetY: range },
            { anchorOffsetX: 0, anchorOffsetY: 0 },
        ];
        egret.Tween.removeTweens(target);
        var delay = duration / 5;
        egret.Tween.get(target).to(shakeSet[0], delay).to(shakeSet[1], delay).to(shakeSet[2], delay).to(shakeSet[3], delay).to(shakeSet[4], delay).call(function () {
            delete DisplayUtils.shakingList[target.hashCode];
            DisplayUtils.shakeIt(target, range, duration, --times);
        }, this);
    };
    /**
     * 闪动一个对象
     * @params  {any} obj 需要闪动的对象
     * @params  {boolean} isFlash 是否闪动
     * @params  {number} t 闪动间隔
     * @returns void
     */
    DisplayUtils.flashingObj = function (obj, isFlash, t) {
        if (t === void 0) { t = 300; }
        var flash = function () {
            if (isFlash) {
                obj.visible = true;
                var a = obj.alpha == 1 ? 0 : 1;
                egret.Tween.removeTweens(obj);
                egret.Tween.get(obj).to({ alpha: a }, t).call(flash);
            }
            else {
                egret.Tween.removeTweens(obj);
                obj.alpha = 1;
                obj.visible = false;
            }
        };
        flash();
    };
    /**
     * 设置属性名字与值的显示
     * labs: 目标修改的文本列表. 按从左到右顺序依次设置。
     * idValues: 属性id-值 列表
     * styles: { nameStyle, valueStyle: }
     * showName: 显示属性名字
     * focusValue: 将属性值设定为该值
     */
    DisplayUtils.showAttribute = function (labs, idValues, styles, showName, concatChar, focusValue) {
        if (styles === void 0) { styles = {}; }
        if (showName === void 0) { showName = true; }
        if (concatChar === void 0) { concatChar = " : "; }
        if (focusValue === void 0) { focusValue = null; }
        var labCount = labs.length;
        var textFlow = [];
        var name;
        var nameStyle = styles.nameStyle || {};
        var valueStyle = styles.valueStyle || { "textColor": 0xffbe3f };
        var index;
        for (var i = 0; i < idValues.length; i++) {
            index = i % labCount;
            textFlow[index] = textFlow[index] || [];
            if (idValues[i] && (idValues[i].value != null)) {
                if (textFlow[index].length > 0) {
                    textFlow[index].push({ text: "\n" });
                }
                // if (showName) {
                // 	name = Lang.itemComAttrName1[idValues[i].type];
                // 	textFlow[index].push({ text: `${name}${concatChar}`, style: nameStyle });
                // }
                var value = "" + idValues[i].value;
                if (focusValue != null) {
                    value = focusValue;
                }
                textFlow[index].push({ text: "" + value, style: valueStyle });
            }
        }
        for (var i = 0; i < labCount; i++) {
            labs[i].textFlow = textFlow[i];
        }
    };
    DisplayUtils.destroyDisplayObject = function (target) {
        if (!target) {
            return;
        }
        if (target instanceof BaseView) {
            target.$onClose();
        }
        else if (target instanceof egret.DisplayObjectContainer) {
            for (var i = 0; i < target.numChildren; i++) {
                var obj = target.getChildAt(i);
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
        }
        if (target instanceof DisplayObject) {
            DisplayUtils.removeFromParent(target);
        }
    };
    DisplayUtils.shakingList = {};
    return DisplayUtils;
}());
__reflect(DisplayUtils.prototype, "DisplayUtils");
//# sourceMappingURL=DisplayUtils.js.map