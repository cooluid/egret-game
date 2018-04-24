class StringUtils {

	private static HTML: RegExp = /<[^>]+>/g;

	public static isHtmlText(str: string): boolean {
		return this.HTML.test(str);
	}

	/**
	 * 去掉前后空格
	 * @param str
	 * @returns {string}
	 */
	public static trimSpace(str: string): string {
		return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
	}

	/**
	 * 获取字符串长度，中文为2
	 * @param str
	 */
	public static getStringLength(str: string): number {
		let strArr = str.split("");
		let length = 0;
		for (let i = 0; i < strArr.length; i++) {
			let s = strArr[i];
			if (this.isChinese(s)) {
				length += 2;
			} else {
				length += 1;
			}
		}
		return length;
	}

	/**
	 * 判断一个字符串是否包含中文
	 * @param str
	 * @returns {boolean}
	 */
	public static isChinese(str: string): boolean {
		let reg = /^[\u4E00-\u9FA5]+$/;
		if (!reg.test(str)) {
			return true;
		}
		return false;
	}


	/**
	 * 获取字符串的字节长度
	 * 一个中文算2两个字节
	 * @param str
	 * @return
	 */
	public static strByteLen(str: string): number {
		let byteLen: number = 0;
		let strLen: number = str.length;
		for (let i: number = 0; i < strLen; i++) {
			byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
		}
		return byteLen;
	}

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
	public static complementByChar(str: string, length: number, char: string = " ", ignoreHtml: boolean = true): string {
		let byteLen: number = this.strByteLen(ignoreHtml ? str.replace(StringUtils.HTML, "") : str);
		return str + this.repeatStr(char, length - byteLen);
	}

	/**
	 * 重复指定字符串count次
	 * @param str
	 * @param count
	 * @return
	 *
	 */
	public static repeatStr(str: string, count: number): string {
		let s: string = "";
		for (let i: number = 0; i < count; i++) {
			s += str;
		}
		return s;
	}

	/**
	 * 为文字添加颜色
	 * */
	public static addColor(content: string, color: any): string {
		let colorStr: string;
		if (typeof (color) == "string")
			colorStr = String(color)
		else if (typeof (color) == "number")
			colorStr = Number(color).toString(10);
		return `<font color=\"${colorStr}\">${content}</font>`;
	}
	private static htmlParser: egret.HtmlTextParser = new egret.HtmlTextParser();

	/**将htmltext转为egret.ITextElement[]*/
	public static parseHtmlText(htmlText: string): egret.ITextElement[] {
		return this.htmlParser.parse(htmlText);
	}

	/**
	 * 这个函数还没改完,用来替代addColor
	 */
	public static addColor1(content: string | number, color: any = undefined): Array<egret.ITextElement> {
		if (color)
			return this.htmlParser.parser((StringUtils.addColor(content.toString(), color)));
		else
			return this.htmlParser.parser(content.toString());
	}
	/**加粗 */
	public static addBold(content: string): string {
		return `<b>${content}</b>`;
	}
	/**加下划线 */
	public static addUnderLine(content: string): string {
		return `<u>${content}</u>`;
	}

	/**大于1w  */
	public static formatNum(num: number, d: number = 0): string {
		if (num < 10000) {
			return num + "";
		}
		let base = 10000;
		let str = "万";
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
	}

	/**
	 * 使用传入的各个参数替换指定的字符串内的“${n}”标记。
	 * @param str
	 * @param rest
	 * @return
	 *
	 */
	public static substitute(str: string, ...rest): string {
		return this.replace(str, rest, "{", "}");
	}

	/**
	 * 将字符串模板的指定部分替换为数组内容（替换部分：prefix+第N个+suffix）
	 * @param sample 字符串模板
	 * @param arr 对应替换数组
	 * @param prefix 替换部分的前缀
	 * @param suffix 替换部分的后缀
	 * @return
	 *
	 */
	private static replace(sample: string, arr: any[], prefix: string = "$", suffix: string = "$"): string {
		if (arr != null && sample) {
			let count: number = arr.length;
			for (let n: number = 0; n < count; ++n) {
				let temp: string = null;
				while (temp != sample) {
					temp = sample;
					sample = temp.replace("$" + prefix + n + suffix, arr[n]);
				}
			}
		}
		return sample;
	}
}