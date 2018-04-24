var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.isHtmlText = function (str) {
        return this.HTML.test(str);
    };
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    StringUtils.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    StringUtils.getStringLength = function (str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };
    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    StringUtils.isChinese = function (str) {
        var reg = /^[\u4E00-\u9FA5]+$/;
        if (!reg.test(str)) {
            return true;
        }
        return false;
    };
    /**
     * 获取字符串的字节长度
     * 一个中文算2两个字节
     * @param str
     * @return
     */
    StringUtils.strByteLen = function (str) {
        var byteLen = 0;
        var strLen = str.length;
        for (var i = 0; i < strLen; i++) {
            byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        }
        return byteLen;
    };
    /**
     * 补齐字符串
     * 因为这里使用的是字节长度（一个中文算2个字节）
     * 所以指定的长度是指字节长度，用来填补的字符按一个字节算
     * 如果填补的字符使用中文那么会导致结果不正确，但这里没有对填补字符做检测
     * @param str 源字符串
     * @param length 指定的字节长度
     * @param char 填补的字符
     * @param ignoreHtml 是否忽略HTML代码，默认为true
     * @return
     *
     */
    StringUtils.complementByChar = function (str, length, char, ignoreHtml) {
        if (char === void 0) { char = " "; }
        if (ignoreHtml === void 0) { ignoreHtml = true; }
        var byteLen = this.strByteLen(ignoreHtml ? str.replace(StringUtils.HTML, "") : str);
        return str + this.repeatStr(char, length - byteLen);
    };
    /**
     * 重复指定字符串count次
     * @param str
     * @param count
     * @return
     *
     */
    StringUtils.repeatStr = function (str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    };
    /**
     * 为文字添加颜色
     * */
    StringUtils.addColor = function (content, color) {
        var colorStr;
        if (typeof (color) == "string")
            colorStr = String(color);
        else if (typeof (color) == "number")
            colorStr = Number(color).toString(10);
        return "<font color=\"" + colorStr + "\">" + content + "</font>";
    };
    /**将htmltext转为egret.ITextElement[]*/
    StringUtils.parseHtmlText = function (htmlText) {
        return this.htmlParser.parse(htmlText);
    };
    /**
     * 这个函数还没改完,用来替代addColor
     */
    StringUtils.addColor1 = function (content, color) {
        if (color === void 0) { color = undefined; }
        if (color)
            return this.htmlParser.parser((StringUtils.addColor(content.toString(), color)));
        else
            return this.htmlParser.parser(content.toString());
    };
    /**加粗 */
    StringUtils.addBold = function (content) {
        return "<b>" + content + "</b>";
    };
    /**加下划线 */
    StringUtils.addUnderLine = function (content) {
        return "<u>" + content + "</u>";
    };
    /**大于1w  */
    StringUtils.formatNum = function (num, d) {
        if (d === void 0) { d = 0; }
        if (num < 10000) {
            return num + "";
        }
        var base = 10000;
        var str = "万";
        /**大于1亿，以亿为单位 */
        if (num >= 100000000) {
            base = 100000000;
            str = "亿";
            num = num / 100000000 * Math.pow(10, d);
            num = Math.floor(num);
            num = num / Math.pow(10, d);
            return num + "";
        }
        num = num / base * Math.pow(10, d);
        num = Math.floor(num);
        num = num / Math.pow(10, d);
        return num + str;
    };
    /**
     * 使用传入的各个参数替换指定的字符串内的“${n}”标记。
     * @param str
     * @param rest
     * @return
     *
     */
    StringUtils.substitute = function (str) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        return this.replace(str, rest, "{", "}");
    };
    /**
     * 将字符串模板的指定部分替换为数组内容（替换部分：prefix+第N个+suffix）
     * @param sample 字符串模板
     * @param arr 对应替换数组
     * @param prefix 替换部分的前缀
     * @param suffix 替换部分的后缀
     * @return
     *
     */
    StringUtils.replace = function (sample, arr, prefix, suffix) {
        if (prefix === void 0) { prefix = "$"; }
        if (suffix === void 0) { suffix = "$"; }
        if (arr != null && sample) {
            var count = arr.length;
            for (var n = 0; n < count; ++n) {
                var temp = null;
                while (temp != sample) {
                    temp = sample;
                    sample = temp.replace("$" + prefix + n + suffix, arr[n]);
                }
            }
        }
        return sample;
    };
    StringUtils.HTML = /<[^>]+>/g;
    StringUtils.htmlParser = new egret.HtmlTextParser();
    return StringUtils;
}());
__reflect(StringUtils.prototype, "StringUtils");
