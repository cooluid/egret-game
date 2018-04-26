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
var DateStyle = (function (_super) {
    __extends(DateStyle, _super);
    function DateStyle(format, from, to, isFormatNum) {
        var _this = _super.call(this) || this;
        /**格式 */
        _this.format = [];
        /** 起始精确度*/
        _this.from = 0;
        /**结束精确度 */
        _this.to = 0;
        /**是否补齐0 */
        _this.isFormatNum = false;
        _this.format = format;
        _this.from = from;
        _this.to = to;
        _this.isFormatNum = isFormatNum;
        return _this;
    }
    return DateStyle;
}(BaseClass));
__reflect(DateStyle.prototype, "DateStyle");
/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
var DateUtils = (function () {
    function DateUtils() {
    }
    /**
     * @param minSecond 毫秒数
     * @param str 目标字符串
     * @param fill 是否需要补齐位数
     */
    DateUtils.fillTimeToStr = function (minSecond, str, fill) {
        if (fill === void 0) { fill = true; }
        var vList = [1, DateUtils.MS_PER_SECOND, DateUtils.MS_PER_MINUTE, DateUtils.MS_PER_HOUR, DateUtils.MS_PER_DAY];
        for (var i = vList.length - 1; i >= 0; i--) {
            var searchStr = "{" + i + "}";
            var index = str.indexOf(searchStr);
            if (index >= 0) {
                var value = minSecond / vList[i] >> 0;
                minSecond -= value * vList[i];
                var replaceStr = value + "";
                //从小时开始需做补位处理
                if (fill && replaceStr.length < 2 && i <= 3) {
                    replaceStr = 0 + replaceStr;
                }
                str = str.replace(searchStr, replaceStr);
            }
        }
        return str;
    };
    /**
     * 获取时间格式化的字符串
     * @second 秒
     * @style 格式化风格, 例如 :DateUtils.STYLE_1
     *  */
    DateUtils.getFormatTimeByStyle = function (second, style) {
        if (style === void 0) { style = DateUtils.STYLE_1; }
        if (second < 0) {
            second = 0;
            DebugUtils.log("输入参数有误!时间为负数:" + second);
        }
        if (style.from > style.to) {
            DebugUtils.log("输入参数有误!to参数必须大于等于from参数,请检查style参数的值");
            return "";
        }
        second = second >> 0;
        var result = "";
        for (var i = style.to; i >= style.from; i--) {
            var time = second / this.mul[i]; //总共
            var timeStr = "";
            if (i != style.to)
                time = time % this.mod[i]; //剩余
            if (style.isFormatNum && time < 10)
                timeStr = "0" + (time >> 0).toString(); //补0
            else
                timeStr = (time >> 0).toString();
            //格式 00:00:00 处理
            if (style == this.STYLE_3 && i == style.from) {
                result += timeStr;
            }
            else {
                result += (timeStr + style.format[i]);
            }
        }
        return result;
    };
    /**
     * 获取时间格式化的字符串
     * @ms 毫秒
     * @style 格式化风格, 例如 :DateUtils.STYLE_1
     *  */
    DateUtils.getFormatTimeByStyle1 = function (ms, style) {
        if (style === void 0) { style = DateUtils.STYLE_1; }
        return this.getFormatTimeByStyle(ms / this.MS_PER_SECOND, style);
    };
    /**
     * 把MiniDateTime转化为距离1970-01-01的毫秒数
     * @param mdt 从2010年开始算起的秒数
     * @return 从1970年开始算起的毫秒数
     */
    DateUtils.formatMiniDateTime = function (mdt) {
        return DateUtils.MINI_DATE_TIME_BASE + (mdt & 0x7FFFFFFF) * DateUtils.MS_PER_SECOND;
    };
    /**转成服务器要用的时间***/
    DateUtils.formatServerTime = function (time) {
        return (time - DateUtils.MINI_DATE_TIME_BASE) / DateUtils.MS_PER_SECOND;
    };
    /**获取当前时间是指定时间的第几天 */
    DateUtils.getDayIndex = function (startTime, nowTime) {
        var nowDate = new Date();
        nowDate.setTime(nowTime);
        nowDate.setHours(0);
        nowDate.setMinutes(0);
        nowDate.setSeconds(0);
        nowDate.setMilliseconds(0);
        var startDate = new Date();
        startDate.setTime(startTime);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        var day = (nowDate.getTime() - startDate.getTime()) / (60 * 60 * 1000 * 24) + 1;
        return day;
    };
    /**获取当前时间凌晨时间节点第几天 如：10点创角，凌晨12过后 是第二天*/
    DateUtils.getLingshiDayIndex = function (startTime, nowTime) {
        var serverStartTime = DateUtils.formatServerTime(startTime);
        var RecordFlag = 0x80000000;
        var SecOfDay = 60 * 60 * 24;
        var v = serverStartTime & (~RecordFlag);
        v = v / SecOfDay * SecOfDay;
        var lingshi = (serverStartTime & RecordFlag) | v;
        var sTime = DateUtils.formatMiniDateTime(lingshi);
        var day = this.getDayIndex(sTime, nowTime);
        return day;
    };
    /**
     * 根据秒数格式化字符串
     * @param  {number} second			秒数
     * @param  {number=1} type			时间格式类型（参考DateUtils.TIME_FORMAT_1, DateUtils.TIME_FORMAT_2...)
     * @param  {showLength}	showLength	显示长度（一个时间单位为一个长度，且仅在type为DateUtils.TIME_FORMAT_5的情况下有效）
     * @returns string
     */
    DateUtils.getFormatBySecond = function (second, type, showLength) {
        if (type === void 0) { type = 1; }
        if (showLength === void 0) { showLength = 2; }
        var str = "";
        var ms = second * 1000;
        switch (type) {
            case this.TIME_FORMAT_1:
                str = this.format_1(ms);
                break;
            case this.TIME_FORMAT_2:
                str = this.format_2(ms);
                break;
            case this.TIME_FORMAT_3:
                str = this.format_3(ms);
                break;
            case this.TIME_FORMAT_4:
                str = this.format_4(ms);
                break;
            case this.TIME_FORMAT_5:
                str = this.format_5(ms, showLength);
                break;
            case this.TIME_FORMAT_6:
                str = this.format_6(ms);
                break;
            case this.TIME_FORMAT_7:
                str = this.format_7(ms);
                break;
            case this.TIME_FORMAT_8:
                str = this.format_8(ms);
                break;
            case this.TIME_FORMAT_9:
                str = this.format_9(ms);
                break;
        }
        return str;
    };
    /**
     * 格式1  00:00:00
     * @param  {number} sec 毫秒数
     * @returns string
     */
    DateUtils.format_1 = function (ms) {
        var n = 0;
        var result = "##:##:##";
        n = Math.floor(ms / DateUtils.MS_PER_HOUR);
        result = result.replace("##", DateUtils.formatTimeNum(n));
        if (n)
            ms -= n * DateUtils.MS_PER_HOUR;
        n = Math.floor(ms / DateUtils.MS_PER_MINUTE);
        result = result.replace("##", DateUtils.formatTimeNum(n));
        if (n)
            ms -= n * DateUtils.MS_PER_MINUTE;
        n = Math.floor(ms / 1000);
        result = result.replace("##", DateUtils.formatTimeNum(n));
        return result;
    };
    /**
     * 格式2  yyyy-mm-dd h:m:s
     * @param  {number} ms		毫秒数
     * @returns string			返回自1970年1月1号0点开始的对应的时间点
     */
    DateUtils.format_2 = function (ms) {
        var date = new Date(ms);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };
    /**
     * 格式3  00:00
     * @param  {number} ms		毫秒数
     * @returns string			分:秒
     */
    DateUtils.format_3 = function (ms) {
        var str = this.format_1(ms);
        var strArr = str.split(":");
        return strArr[1] + ":" + strArr[2];
    };
    /**
     * 格式4  xx天前，xx小时前，xx分钟前
     * @param  {number} ms		毫秒
     * @returns string
     */
    DateUtils.format_4 = function (ms) {
        if (ms < this.MS_PER_HOUR) {
            return Math.floor(ms / this.MS_PER_MINUTE) + "分钟前";
        }
        else if (ms < this.MS_PER_DAY) {
            return Math.floor(ms / this.MS_PER_HOUR) + "小时前";
        }
        else {
            return Math.floor(ms / this.MS_PER_DAY) + "天前";
        }
    };
    /**
     * 格式5 X天X小时X分X秒
     * @param  {number} ms				毫秒
     * @param  {number=2} showLength	显示长度（一个时间单位为一个长度）
     * @returns string
     */
    DateUtils.format_5 = function (ms, showLength) {
        if (showLength === void 0) { showLength = 2; }
        var result = "";
        var unitStr = ["天", "小时", "分", "秒"];
        var arr = [];
        var d = Math.floor(ms / this.MS_PER_DAY);
        arr.push(d);
        ms -= d * this.MS_PER_DAY;
        var h = Math.floor(ms / this.MS_PER_HOUR);
        arr.push(h);
        ms -= h * this.MS_PER_HOUR;
        var m = Math.floor(ms / this.MS_PER_MINUTE);
        arr.push(m);
        ms -= m * this.MS_PER_MINUTE;
        var s = Math.floor(ms / 1000);
        arr.push(s);
        for (var k in arr) {
            if (arr[k] > 0) {
                result += this.formatTimeNum(arr[k]) + unitStr[k];
                showLength--;
                if (showLength <= 0)
                    break;
            }
        }
        return result;
    };
    /**
 * 格式6  h:m:s
 * @param  {number} ms		毫秒
 * @returns string			返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
 */
    DateUtils.format_6 = function (ms) {
        var date = new Date(ms);
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute) + ":" + this.formatTimeNum(second);
    };
    /**
 * 格式7  X天/X小时/<1小时
 * @param  {number} ms		毫秒
 * @returns string
 */
    DateUtils.format_7 = function (ms) {
        if (ms < this.MS_PER_HOUR) {
            return "<1小时";
        }
        else if (ms < this.MS_PER_DAY) {
            return Math.floor(ms / this.MS_PER_HOUR) + "小时";
        }
        else {
            return Math.floor(ms / this.MS_PER_DAY) + "天";
        }
    };
    //8:yyyy-mm-dd h:m
    DateUtils.format_8 = function (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute;
    };
    /**
     * 格式9  x小时x分钟x秒
     * @param  {number} ms		毫秒
     * @returns string
     */
    DateUtils.format_9 = function (ms) {
        var h = Math.floor(ms / this.MS_PER_HOUR);
        ms -= h * this.MS_PER_HOUR;
        var m = Math.floor(ms / this.MS_PER_MINUTE);
        ms -= m * this.MS_PER_MINUTE;
        var s = Math.floor(ms / 1000);
        return h + "小时" + m + "分钟" + s + "秒";
    };
    /**
 * 格式10  x分x秒
 * @param  {number} ms		毫秒
 * @returns string
 */
    DateUtils.format_10 = function (ms) {
        var h = Math.floor(ms / this.MS_PER_HOUR);
        ms -= h * this.MS_PER_HOUR;
        var m = Math.floor(ms / this.MS_PER_MINUTE);
        ms -= m * this.MS_PER_MINUTE;
        var s = Math.floor(ms / 1000);
        return m + "分钟" + s + "秒";
    };
    /**
     * 格式化时间数为两位数
     * @param  {number} t 时间数
     * @returns String
     */
    DateUtils.formatTimeNum = function (t) {
        return t >= 10 ? t.toString() : "0" + t;
    };
    /**
     * 将指定日期时间戳转为指定格式字符串
     * @param time 时间戳（毫秒）
     * @param fmt 格式模板（yyyy MM dd hh:mm:ss）
     * @returns {string}
     */
    DateUtils.formatDateTime = function (time, fmt) {
        var date = new Date();
        date.setTime(time);
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    /**时间格式1 00:00:00 */
    DateUtils.TIME_FORMAT_1 = 1;
    /**时间格式2 yyyy-mm-dd h:m:s */
    DateUtils.TIME_FORMAT_2 = 2;
    /**时间格式3 00:00 */
    DateUtils.TIME_FORMAT_3 = 3;
    /**时间格式4 xx天前/xx小时前/xx分钟前 */
    DateUtils.TIME_FORMAT_4 = 4;
    /**时间格式5 x天x小时x分x秒 */
    DateUtils.TIME_FORMAT_5 = 5;
    /**时间格式6 h:m:s */
    DateUtils.TIME_FORMAT_6 = 6;
    /**时间格式7 xx天/xx小时/<1小时 */
    DateUtils.TIME_FORMAT_7 = 7;
    /**时间格式8 yyyy-mm-dd h:m */
    DateUtils.TIME_FORMAT_8 = 8;
    /**时间格式9 x小时x分钟x秒 */
    DateUtils.TIME_FORMAT_9 = 9;
    /**一秒的毫秒数 */
    DateUtils.MS_PER_SECOND = 1000;
    /**一分钟的毫秒数 */
    DateUtils.MS_PER_MINUTE = 60 * 1000;
    /**一小时的毫秒数 */
    DateUtils.MS_PER_HOUR = 60 * 60 * 1000;
    /**一天的毫秒数 */
    DateUtils.MS_PER_DAY = 24 * 60 * 60 * 1000;
    DateUtils.SECOND_PER_HOUR = 3600; //一小时的秒数
    DateUtils.SECOND_PER_DAY = 86400; //一天的秒数
    DateUtils.SECOND_PER_MONTH = 2592000; //一个月(30天)的秒数
    DateUtils.SECOND_PER_YEAR = 31104000; //一年(360天)的秒数
    DateUtils.DAYS_PER_WEEK = 7; //一周的天数
    DateUtils.YEAR_PER_YEAR = 1; //每年的年数
    DateUtils.MONTH_PER_YEAR = 12; //每年的月数
    DateUtils.DAYS_PER_MONTH = 30; //每月的天数
    DateUtils.HOURS_PER_DAY = 24; //每天的小时数
    DateUtils.MUNITE_PER_HOUR = 60; //每小时的分钟数
    DateUtils.SECOND_PER_MUNITE = 60; //每分钟的秒数
    DateUtils.SECOND_PER_SECOND = 1; //每秒的秒数字
    /**余数 ,用来计算时间*/
    DateUtils.mod = [DateUtils.SECOND_PER_MUNITE, DateUtils.MUNITE_PER_HOUR, DateUtils.HOURS_PER_DAY, DateUtils.DAYS_PER_MONTH, DateUtils.MONTH_PER_YEAR, DateUtils.YEAR_PER_YEAR];
    /**除数 用来计算用来计算时间*/
    DateUtils.mul = [DateUtils.SECOND_PER_SECOND, DateUtils.SECOND_PER_MUNITE, DateUtils.SECOND_PER_HOUR, DateUtils.SECOND_PER_DAY, DateUtils.SECOND_PER_MONTH, DateUtils.SECOND_PER_YEAR];
    /**一周的天数 */
    /**一天的小时数 */
    /** 本游戏中使用的MiniDateTime时间的起始日期相对于flash时间(1970-01-01)的时差（毫秒） */
    DateUtils.MINI_DATE_TIME_BASE = Date.UTC(2010, 0) + new Date().getTimezoneOffset() * DateUtils.MS_PER_MINUTE;
    /**
     * 时区偏移（毫秒数）<BR>
     * 目前中国采用东八区，即比世界协调时间（UTC）/格林尼治时间（GMT）快8小时的时区 */
    DateUtils.TIME_ZONE_OFFSET = 8 * DateUtils.MS_PER_HOUR;
    /**精确度 */
    DateUtils.TO_SECOND = 0;
    DateUtils.TO_MINUTE = 1;
    DateUtils.TO_HOUR = 2;
    DateUtils.TO_DAY = 3;
    DateUtils.TO_MONTH = 4;
    DateUtils.TO_YEAR = 5;
    /** n年n月n日n时n分n秒 */
    DateUtils.FORMAT_1 = ["秒", "分", "时", "天", "月", "年"];
    /** xx:xx:xx */
    DateUtils.FORMAT_2 = [":", ":", ":", ":", ":", ":"];
    /**x小时x分x秒 */
    DateUtils.STYLE_1 = new DateStyle(DateUtils.FORMAT_1, DateUtils.TO_SECOND, DateUtils.TO_HOUR, false);
    /** x天x小时x分钟x秒 */
    DateUtils.STYLE_2 = new DateStyle(DateUtils.FORMAT_1, DateUtils.TO_SECOND, DateUtils.TO_DAY, false);
    /** 00:00:00 */
    DateUtils.STYLE_3 = new DateStyle(DateUtils.FORMAT_2, DateUtils.TO_SECOND, DateUtils.TO_HOUR, true);
    /** x分x秒 */
    DateUtils.STYLE_4 = new DateStyle(DateUtils.FORMAT_1, DateUtils.TO_SECOND, DateUtils.TO_MINUTE, true);
    return DateUtils;
}());
__reflect(DateUtils.prototype, "DateUtils");
//# sourceMappingURL=DateUtils.js.map