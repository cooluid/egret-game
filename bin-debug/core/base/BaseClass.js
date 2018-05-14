var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
var BaseClass = (function () {
    function BaseClass() {
    }
    /**
     * 获取一个单例
     * @returns {any}
     */
    BaseClass.ins = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var Class = this;
        if (!Class._instance) {
            Class._instance = new (Class.bind.apply(Class, [void 0].concat(args)))();
        }
        return Class._instance;
    };
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
//# sourceMappingURL=BaseClass.js.map