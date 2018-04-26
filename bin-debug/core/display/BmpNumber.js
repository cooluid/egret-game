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
var BmpNumber = (function (_super) {
    __extends(BmpNumber, _super);
    function BmpNumber() {
        var _this = _super.call(this) || this;
        _this.bmps = [];
        _this.maxHeight = 0;
        _this.maxWidth = 0;
        return _this;
    }
    /**
     * 设置数字
     * @value 整数,或者字符串
     * @type 类型 NumberType中的值
     * @spacing 叠加间距 NumberType中的值
     * */
    BmpNumber.prototype.setNumber = function (value, numberType, spacing) {
        if (spacing === void 0) { spacing = 0; }
        var valueStr = value.toString();
        valueStr = valueStr.replace(RegExpUtil.DOT_NUMBER, "");
        var len = Math.max(valueStr.length, this.bmps.length);
        var lastX = 0;
        this.maxHeight = this.maxWidth = 0;
        for (var i = 0; i < len; i++) {
            var bmp = this.bmps[i];
            if (!bmp) {
                bmp = new egret.Bitmap;
                this.bmps[i] = bmp;
                this.addChild(bmp);
            }
            if (i < valueStr.length) {
                var texture = RES.getRes(BmpNumber.parserUrl((numberType) + valueStr[i]));
                if (texture) {
                    bmp.visible = true;
                    bmp.texture = texture;
                    this.maxHeight = Math.max(bmp.texture.textureHeight, this.maxHeight);
                    this.maxWidth += bmp.texture.textureWidth;
                }
                else
                    throw new Error("BmpNumber\u7C7B\u4F7F\u7528\u7684\u6570\u5B57\u8D44\u6E90\u5FC5\u987B\u63D0\u524D\u9884\u52A0\u8F7D,\u5728 num.png \u4E2D\u6253\u5305\u6210\u56FE\u96C6" + (BmpNumber.parserUrl((numberType) + valueStr[i])));
            }
            else {
                bmp.texture = null;
                bmp.visible = false;
            }
            bmp.x = lastX + spacing;
            lastX = bmp.x + bmp.width;
        }
    };
    BmpNumber.parserUrl = function (str) {
        return str;
    };
    Object.defineProperty(BmpNumber.prototype, "height", {
        get: function () {
            return this.maxHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BmpNumber.prototype, "width", {
        get: function () {
            return this.maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    BmpNumber.prototype.reset = function () {
        this.alpha = this.scaleX = this.scaleY = 1;
        this.maxHeight = this.maxWidth = 0;
        for (var _i = 0, _a = this.bmps; _i < _a.length; _i++) {
            var bmp = _a[_i];
            bmp.texture = null;
        }
    };
    return BmpNumber;
}(egret.DisplayObjectContainer));
__reflect(BmpNumber.prototype, "BmpNumber");
//# sourceMappingURL=BmpNumber.js.map