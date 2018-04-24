class DateStyle extends BaseClass {
	/**格式 */
	public format: string[] = [];
	/** 起始精确度*/
	public from: number = 0;
	/**结束精确度 */
	public to: number = 0;
	/**是否补齐0 */
	public isFormatNum: boolean = false;

	public constructor(format: string[], from: number, to: number, isFormatNum: boolean) {
		super();
		this.format = format;
		this.from = from;
		this.to = to;
		this.isFormatNum = isFormatNum;
	}
}
/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
class DateUtils {
	/**时间格式1 00:00:00 */
	public static TIME_FORMAT_1: number = 1;
	/**时间格式2 yyyy-mm-dd h:m:s */
	public static TIME_FORMAT_2: number = 2;
	/**时间格式3 00:00 */
	public static TIME_FORMAT_3: number = 3;
	/**时间格式4 xx天前/xx小时前/xx分钟前 */
	public static TIME_FORMAT_4: number = 4;
	/**时间格式5 x天x小时x分x秒 */
	public static TIME_FORMAT_5: number = 5;
	/**时间格式6 h:m:s */
	public static TIME_FORMAT_6: number = 6;
	/**时间格式7 xx天/xx小时/<1小时 */
	public static TIME_FORMAT_7: number = 7;
	/**时间格式8 yyyy-mm-dd h:m */
	public static TIME_FORMAT_8: number = 8;
	/**时间格式9 x小时x分钟x秒 */
	public static TIME_FORMAT_9: number = 9;

	/**一秒的毫秒数 */
	public static MS_PER_SECOND: number = 1000;
	/**一分钟的毫秒数 */
	public static MS_PER_MINUTE: number = 60 * 1000;
	/**一小时的毫秒数 */
	public static MS_PER_HOUR: number = 60 * 60 * 1000;
	/**一天的毫秒数 */
	public static MS_PER_DAY: number = 24 * 60 * 60 * 1000;

	public static SECOND_PER_HOUR: number = 3600;//一小时的秒数
	private static SECOND_PER_DAY: number = 86400;//一天的秒数
	private static SECOND_PER_MONTH: number = 2592000;//一个月(30天)的秒数
	private static SECOND_PER_YEAR: number = 31104000;//一年(360天)的秒数

	public static DAYS_PER_WEEK: number = 7;//一周的天数

	public static YEAR_PER_YEAR: number = 1;//每年的年数
	public static MONTH_PER_YEAR: number = 12;//每年的月数
	public static DAYS_PER_MONTH: number = 30;//每月的天数
	public static HOURS_PER_DAY: number = 24;//每天的小时数
	public static MUNITE_PER_HOUR: number = 60;//每小时的分钟数
	public static SECOND_PER_MUNITE: number = 60;//每分钟的秒数
	public static SECOND_PER_SECOND: number = 1;//每秒的秒数字
	/**余数 ,用来计算时间*/
	private static mod: number[] = [DateUtils.SECOND_PER_MUNITE, DateUtils.MUNITE_PER_HOUR, DateUtils.HOURS_PER_DAY, DateUtils.DAYS_PER_MONTH, DateUtils.MONTH_PER_YEAR, DateUtils.YEAR_PER_YEAR];
	/**除数 用来计算用来计算时间*/
	private static mul: number[] = [DateUtils.SECOND_PER_SECOND, DateUtils.SECOND_PER_MUNITE, DateUtils.SECOND_PER_HOUR, DateUtils.SECOND_PER_DAY, DateUtils.SECOND_PER_MONTH, DateUtils.SECOND_PER_YEAR];
	/**一周的天数 */
	/**一天的小时数 */
	/** 本游戏中使用的MiniDateTime时间的起始日期相对于flash时间(1970-01-01)的时差（毫秒） */
	public static MINI_DATE_TIME_BASE: number = Date.UTC(2010, 0) + new Date().getTimezoneOffset() * DateUtils.MS_PER_MINUTE;
	/**
	 * 时区偏移（毫秒数）<BR>
	 * 目前中国采用东八区，即比世界协调时间（UTC）/格林尼治时间（GMT）快8小时的时区 */
	public static TIME_ZONE_OFFSET: number = 8 * DateUtils.MS_PER_HOUR;

	/**精确度 */
	public static TO_SECOND: number = 0;
	public static TO_MINUTE: number = 1;
	public static TO_HOUR: number = 2;
	public static TO_DAY: number = 3;
	public static TO_MONTH: number = 4;
	public static TO_YEAR: number = 5;
	/** n年n月n日n时n分n秒 */
	private static FORMAT_1: string[] = ["秒", "分", "时", "天", "月", "年"];
	/** xx:xx:xx */
	private static FORMAT_2: string[] = [":", ":", ":", ":", ":", ":"];

	/**x小时x分x秒 */
	public static STYLE_1: DateStyle = new DateStyle(DateUtils.FORMAT_1, DateUtils.TO_SECOND, DateUtils.TO_HOUR, false);
	/** x天x小时x分钟x秒 */
	public static STYLE_2: DateStyle = new DateStyle(DateUtils.FORMAT_1, DateUtils.TO_SECOND, DateUtils.TO_DAY, false);
	/** 00:00:00 */
	public static STYLE_3: DateStyle = new DateStyle(DateUtils.FORMAT_2, DateUtils.TO_SECOND, DateUtils.TO_HOUR, true);
	/** x分x秒 */
	public static STYLE_4: DateStyle = new DateStyle(DateUtils.FORMAT_1, DateUtils.TO_SECOND, DateUtils.TO_MINUTE, true);

	public constructor() {
	}

	/**
	 * @param minSecond 毫秒数
	 * @param str 目标字符串
	 * @param fill 是否需要补齐位数
	 */
	public static fillTimeToStr(minSecond: number, str: string, fill: boolean = true): string {
		let vList = [1, DateUtils.MS_PER_SECOND, DateUtils.MS_PER_MINUTE, DateUtils.MS_PER_HOUR, DateUtils.MS_PER_DAY];
		for (let i = vList.length - 1; i >= 0; i--) {
			let searchStr: string = `{${i}}`;
			let index = str.indexOf(searchStr);
			if (index >= 0) {
				let value = minSecond / vList[i] >> 0;
				minSecond -= value * vList[i];
				let replaceStr = value + "";
				//从小时开始需做补位处理
				if (fill && replaceStr.length < 2 && i <= 3) {
					replaceStr = 0 + replaceStr;
				}
				str = str.replace(searchStr, replaceStr);
			}
		}
		return str;
	}

	/**
	 * 获取时间格式化的字符串
	 * @second 秒
	 * @style 格式化风格, 例如 :DateUtils.STYLE_1
	 *  */
	public static getFormatTimeByStyle(second: number, style: DateStyle = DateUtils.STYLE_1): string {
		if (second < 0) {
			second = 0;
			DebugUtils.log("输入参数有误!时间为负数:" + second);
		}
		if (style.from > style.to) {
			DebugUtils.log("输入参数有误!to参数必须大于等于from参数,请检查style参数的值");
			return "";
		}
		second = second >> 0;
		let result: string = "";
		for (let i: number = style.to; i >= style.from; i--) {
			let time: number = second / this.mul[i];//总共
			let timeStr: string = "";
			if (i != style.to)
				time = time % this.mod[i];//剩余
			if (style.isFormatNum && time < 10)
				timeStr = "0" + (time >> 0).toString();//补0
			else
				timeStr = (time >> 0).toString();
			//格式 00:00:00 处理
			if (style == this.STYLE_3 && i == style.from) {
				result += timeStr;
			} else {
				result += (timeStr + style.format[i]);
			}
		}
		return result;
	}
	/**
	 * 获取时间格式化的字符串
	 * @ms 毫秒
	 * @style 格式化风格, 例如 :DateUtils.STYLE_1
	 *  */
	public static getFormatTimeByStyle1(ms: number, style: DateStyle = DateUtils.STYLE_1): string {
		return this.getFormatTimeByStyle(ms / this.MS_PER_SECOND, style);
	}

	/**
	 * 把MiniDateTime转化为距离1970-01-01的毫秒数
	 * @param mdt 从2010年开始算起的秒数
	 * @return 从1970年开始算起的毫秒数
	 */
	public static formatMiniDateTime(mdt: number): number {
		return DateUtils.MINI_DATE_TIME_BASE + (mdt & 0x7FFFFFFF) * DateUtils.MS_PER_SECOND;
	}
	/**转成服务器要用的时间***/
	public static formatServerTime(time: number): number {
		return (time - DateUtils.MINI_DATE_TIME_BASE) / DateUtils.MS_PER_SECOND;
	}

	/**获取当前时间是指定时间的第几天 */
	public static getDayIndex(startTime: number, nowTime: number): number {
		let nowDate = new Date();
		nowDate.setTime(nowTime);
		nowDate.setHours(0);
		nowDate.setMinutes(0);
		nowDate.setSeconds(0);
		nowDate.setMilliseconds(0);

		let startDate = new Date();
		startDate.setTime(startTime);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);

		let day = (nowDate.getTime() - startDate.getTime()) / (60 * 60 * 1000 * 24) + 1;
		return day;
	}
	/**获取当前时间凌晨时间节点第几天 如：10点创角，凌晨12过后 是第二天*/
	public static getLingshiDayIndex(startTime: number, nowTime: number): number {
		let serverStartTime: number = DateUtils.formatServerTime(startTime)
		let RecordFlag = 0x80000000;
		let SecOfDay = 60 * 60 * 24;
		let v = serverStartTime & (~RecordFlag);
		v = v / SecOfDay * SecOfDay;
		let lingshi = (serverStartTime & RecordFlag) | v;
		let sTime: number = DateUtils.formatMiniDateTime(lingshi);
		let day = this.getDayIndex(sTime, nowTime);
		return day;
	}

	/**
	 * 根据秒数格式化字符串
	 * @param  {number} second			秒数
	 * @param  {number=1} type			时间格式类型（参考DateUtils.TIME_FORMAT_1, DateUtils.TIME_FORMAT_2...)
	 * @param  {showLength}	showLength	显示长度（一个时间单位为一个长度，且仅在type为DateUtils.TIME_FORMAT_5的情况下有效）
	 * @returns string
	 */
	public static getFormatBySecond(second: number, type: number = 1, showLength: number = 2): string {
		let str: string = "";
		let ms: number = second * 1000;
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
	}

	/**
	 * 格式1  00:00:00
	 * @param  {number} sec 毫秒数
	 * @returns string
	 */
	private static format_1(ms: number): string {
		let n: number = 0;
		let result: string = "##:##:##";

		n = Math.floor(ms / DateUtils.MS_PER_HOUR);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		if (n) ms -= n * DateUtils.MS_PER_HOUR;

		n = Math.floor(ms / DateUtils.MS_PER_MINUTE);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		if (n) ms -= n * DateUtils.MS_PER_MINUTE;

		n = Math.floor(ms / 1000);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		return result;
	}

	/**
	 * 格式2  yyyy-mm-dd h:m:s
	 * @param  {number} ms		毫秒数
	 * @returns string			返回自1970年1月1号0点开始的对应的时间点
	 */
	private static format_2(ms: number): string {
		let date: Date = new Date(ms);
		let year: number = date.getFullYear();
		let month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		let day: number = date.getDate();
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		let second: number = date.getSeconds();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
	}

	/**
	 * 格式3  00:00
	 * @param  {number} ms		毫秒数
	 * @returns string			分:秒
	 */
	private static format_3(ms: number): string {
		let str: string = this.format_1(ms);
		let strArr: string[] = str.split(":");
		return strArr[1] + ":" + strArr[2];
	}

	/**
	 * 格式4  xx天前，xx小时前，xx分钟前
	 * @param  {number} ms		毫秒
	 * @returns string
	 */
	private static format_4(ms: number): string {
		if (ms < this.MS_PER_HOUR) {
			return Math.floor(ms / this.MS_PER_MINUTE) + "分钟前";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + "小时前";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + "天前";
		}
	}

	/**
	 * 格式5 X天X小时X分X秒
	 * @param  {number} ms				毫秒
	 * @param  {number=2} showLength	显示长度（一个时间单位为一个长度）
	 * @returns string
	 */
	private static format_5(ms: number, showLength: number = 2): string {
		let result: string = "";
		let unitStr: string[] = ["天", "小时", "分", "秒"];
		let arr: number[] = [];

		let d: number = Math.floor(ms / this.MS_PER_DAY);
		arr.push(d);
		ms -= d * this.MS_PER_DAY;
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		arr.push(h);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		arr.push(m);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);
		arr.push(s);

		for (let k in arr) {
			if (arr[k] > 0) {
				result += this.formatTimeNum(arr[k]) + unitStr[k];
				showLength--;
				if (showLength <= 0) break;
			}
		}

		return result;
	}

	/**
 * 格式6  h:m:s
 * @param  {number} ms		毫秒
 * @returns string			返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
 */
	private static format_6(ms: number): string {
		let date: Date = new Date(ms);
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		let second: number = date.getSeconds();
		return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute) + ":" + this.formatTimeNum(second);
	}

	/**
 * 格式7  X天/X小时/<1小时
 * @param  {number} ms		毫秒
 * @returns string
 */
	private static format_7(ms: number): string {
		if (ms < this.MS_PER_HOUR) {
			return "<1小时";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + "小时";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + "天";
		}
	}

	//8:yyyy-mm-dd h:m
	private static format_8(time: number): string {
		var date: Date = new Date(time);
		var year: number = date.getFullYear();
		var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		var day: number = date.getDate();
		var hours: number = date.getHours();
		var minute: number = date.getMinutes();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute;
	}

	/**
	 * 格式9  x小时x分钟x秒
	 * @param  {number} ms		毫秒
	 * @returns string
	 */
	private static format_9(ms: number): string {
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);

		return h + "小时" + m + "分钟" + s + "秒";
	}
	/**
 * 格式10  x分x秒
 * @param  {number} ms		毫秒
 * @returns string
 */
	private static format_10(ms: number): string {
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);

		return m + "分钟" + s + "秒";
	}

	/**
	 * 格式化时间数为两位数
	 * @param  {number} t 时间数
	 * @returns String
	 */
	private static formatTimeNum(t: number): string {
		return t >= 10 ? t.toString() : "0" + t;
	}

	/**
	 * 将指定日期时间戳转为指定格式字符串
	 * @param time 时间戳（毫秒）
	 * @param fmt 格式模板（yyyy MM dd hh:mm:ss）
	 * @returns {string}
	 */
	public static formatDateTime(time: number, fmt: string): string {
		let date = new Date();
		date.setTime(time);
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
}


