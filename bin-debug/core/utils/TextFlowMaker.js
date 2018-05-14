var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TextFlowMaker = (function () {
    function TextFlowMaker() {
    }
    /**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    TextFlowMaker.generateTextFlow = function (sourceText) {
        var textArr = sourceText.split("|");
        var str = "";
        for (var i = 0, len = textArr.length; i < len; i++) {
            str += this.getSingleTextFlow1(textArr[i]);
        }
        return new egret.HtmlTextParser().parser(str);
    };
    TextFlowMaker.generateTextFlow1 = function (sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    };
    TextFlowMaker.getSingleTextFlow1 = function (text) {
        var str = "<font";
        var textArr = text.split("&");
        var tempArr;
        var t;
        for (var i = 0, len = textArr.length; i < len; i++) {
            tempArr = textArr[i].split(":");
            if (tempArr[0] == this.PROP_TEXT) {
                t = tempArr[1];
            }
            else if (tempArr[0] == this.STYLE_SIZE) {
                str += " size=\"" + parseInt(tempArr[1]) + "\"";
            }
            else if (tempArr[0] == this.STYLE_COLOR) {
                str += " color=\"" + parseInt(tempArr[1]) + "\"";
            }
            else {
                t = tempArr[0];
            }
        }
        str += ">" + t + "</font>";
        return str;
    };
    TextFlowMaker.getSingleTextFlow = function (text) {
        var textArr = text.split("&");
        var tempArr;
        var textFlow = { "style": {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            tempArr = textArr[i].split(":");
            if (tempArr[0] == this.PROP_TEXT) {
                textFlow.text = tempArr[1];
            }
            else if (tempArr[0] == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(tempArr[1]);
            }
            else if (tempArr[0] == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(tempArr[1]);
            }
            else {
                textFlow.text = tempArr[0];
            }
        }
        return textFlow;
    };
    TextFlowMaker.STYLE_COLOR = "C";
    TextFlowMaker.STYLE_SIZE = "S";
    TextFlowMaker.PROP_TEXT = "T";
    return TextFlowMaker;
}());
__reflect(TextFlowMaker.prototype, "TextFlowMaker");
//# sourceMappingURL=TextFlowMaker.js.map