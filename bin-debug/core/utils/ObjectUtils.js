var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ObjectUtils = (function () {
    function ObjectUtils() {
    }
    ObjectUtils.init = function (data) {
        var _loop_1 = function (key) {
            var value = data[key];
            var objCls = egret.getDefinitionByName(key);
            window["" + objCls] = objCls;
            if (objCls) {
                var objKey_1 = "_obj" + key;
                this_1[objKey_1] = new objCls();
                var boolKey_1 = "_bool" + key;
                this_1[boolKey_1] = false;
                var newKey_1 = "_" + key + "_";
                Object.defineProperty(this_1, key, {
                    get: function () {
                        var obj = this[newKey_1];
                        if (this[boolKey_1]) {
                            return obj;
                        }
                        var parent = this[objKey_1];
                        for (var i in obj) {
                            obj[i].__proto__ = parent;
                        }
                        this[boolKey_1] = true;
                        return obj;
                    },
                    set: function (val) {
                        this[newKey_1] = val;
                    }
                });
            }
            this_1[key] = value;
        };
        var this_1 = this;
        for (var key in data) {
            _loop_1(key);
        }
    };
    return ObjectUtils;
}());
__reflect(ObjectUtils.prototype, "ObjectUtils");
