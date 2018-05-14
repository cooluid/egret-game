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
var CommonUtils = (function (_super) {
    __extends(CommonUtils, _super);
    function CommonUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    CommonUtils.addLableStrokeColor = function (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 获取一个对象的长度
     * @param list
     */
    CommonUtils.getObjectLength = function (list) {
        var num = 0;
        for (var i in list) {
            num++;
        }
        return num;
    };
    /**
     * 深度复制
     * @param _data
     */
    CommonUtils.copyDataHandler = function (obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };
    /**
     * 锁屏
     */
    CommonUtils.lock = function () {
        StageUtils.ins().getStage().touchEnabled = StageUtils.ins().getStage().touchChildren = false;
    };
    /**
     * 解屏
     */
    CommonUtils.unlock = function () {
        StageUtils.ins().getStage().touchEnabled = StageUtils.ins().getStage().touchChildren = true;
    };
    /**
     * 万字的显示
     * @param label
     * @param num
     */
    CommonUtils.labelIsOverLenght = function (label, num) {
        label.text = this.overLength(num);
    };
    CommonUtils.overLength = function (num) {
        var str = null;
        if (num < 100000) {
            str = num;
        }
        else if (num >= 100000000) {
            num = Math.floor(num / 100000000);
            str = num + "亿";
        }
        else {
            num = Math.floor(num / 10000);
            str = num + "万";
        }
        return str;
    };
    CommonUtils.overLengthChange = function (num) {
        var str = null;
        if (num < 10000) {
            str = num;
        }
        else if (num > 100000000) {
            num = (num / 100000000);
            num = Math.floor(num * 10) / 10;
            str = num + "亿";
        }
        else {
            num = (num / 10000);
            num = Math.floor(num * 10) / 10;
            str = num + "万";
        }
        return str;
    };
    /**
     * 去掉小数点后面的值
     * @param num
     * @returns {null}
     */
    CommonUtils.overLengthChange2 = function (num) {
        var str = null;
        if (num < 10000) {
            str = num;
        }
        else if (num > 100000000) {
            num = (num / 100000000);
            num = Math.floor(num * 10 / 10);
            str = num + "亿";
        }
        else {
            num = (num / 10000);
            num = Math.floor(num * 10 / 10);
            str = num + "万";
        }
        return str;
    };
    /**
     * 克隆一个对象
     * @param  {any} tarObj
     */
    CommonUtils.cloneObject = function (obj) {
        if (null == obj || "object" != typeof obj)
            return obj;
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            var copy = [];
            var len = obj.length;
            for (var i = 0; i < len; ++i) {
                copy[i] = CommonUtils.cloneObject(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = CommonUtils.cloneObject(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    /**
     * 获取一个对象的字符串名字
     * @param obj  可以是类名,数字,显示对象,字符串
     * 注意:如果参数是一个显示对象,需要递归遍历显示对象树,
     * 你的显示对象必须是所在类的子显示对象,并且添加到了显示列表中,否则将得到一个错误的值
     * 所以不是必须的话不建议传一个显示对象.
     */
    CommonUtils.getObjName = function (obj) {
        var key = "";
        if (obj instanceof egret.DisplayObject) {
            this.findName(obj);
        }
        else if (typeof (obj) == "number")
            key = obj.toString();
        else if (typeof (obj) == "string")
            key = obj;
        else if (typeof (obj) == "function")
            key = egret.getQualifiedClassName(obj);
        else
            DebugUtils.log("需要获取的对象类型错误" + obj);
        return key;
    };
    CommonUtils.findName = function (obj) {
        if (obj.parent) {
            for (var key in obj.parent) {
                if (obj.parent[key] == obj) {
                    return key;
                }
            }
            return this.findName(obj.parent);
        }
        else {
            return obj.name;
        }
    };
    return CommonUtils;
}(BaseClass));
__reflect(CommonUtils.prototype, "CommonUtils");
//# sourceMappingURL=CommonUtils.js.map