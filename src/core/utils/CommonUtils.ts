class CommonUtils extends BaseClass {

	/**
	 * 给字体添加描边
	 * @param lable      文字
	 * @param color      表示文本的描边颜色
	 * @param width      描边宽度。
	 */
	public static addLableStrokeColor(lable: eui.Label, color: any, width: any): void {
		lable.strokeColor = color;
		lable.stroke = width;
	}

	/**
	 * 获取一个对象的长度
	 * @param list
	 */
	public static getObjectLength(list: Object): number {
		let num: number = 0;
		for (let i in list) {
			num++;
		}
		return num;
	}

	/**
	 * 深度复制
	 * @param _data
	 */
	public static copyDataHandler(obj: any): any {
		let newObj;
		if (obj instanceof Array) {
			newObj = [];
		}
		else if (obj instanceof Object) {
			newObj = {};
		}
		else {
			return obj;
		}
		let keys = Object.keys(obj);
		for (let i: number = 0, len = keys.length; i < len; i++) {
			let key = keys[i];
			newObj[key] = this.copyDataHandler(obj[key]);
		}
		return newObj;
	}

	/**
	 * 锁屏
	 */
	public static lock(): void {
		StageUtils.ins().getStage().touchEnabled = StageUtils.ins().getStage().touchChildren = false;
	}

	/**
	 * 解屏
	 */
	public static unlock(): void {
		StageUtils.ins().getStage().touchEnabled = StageUtils.ins().getStage().touchChildren = true;
	}

	/**
	 * 万字的显示
	 * @param label
	 * @param num
	 */
	public static labelIsOverLenght(label, num) {
		label.text = this.overLength(num);
	}

	public static overLength(num: number) {
		let str = null;
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
	}

	public static overLengthChange(num: number): string {
		let str = null;
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
	}

	/**
	 * 去掉小数点后面的值
	 * @param num
	 * @returns {null}
	 */
	public static overLengthChange2(num: number): string {
		let str = null;
		if (num < 10000) {
			str = num;
		} else if (num > 100000000) {
			num = (num / 100000000);
			num = Math.floor(num * 10 / 10);
			str = num + "亿";
		} else {
			num = (num / 10000);
			num = Math.floor(num * 10 / 10);
			str = num + "万";
		}
		return str;
	}

	/**
	 * 克隆一个对象
	 * @param  {any} tarObj
	 */
	public static cloneObject(obj): any {
		if (null == obj || "object" != typeof obj) return obj;

		if (obj instanceof Date) {
			let copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		if (obj instanceof Array) {
			let copy = [];
			let len: number = obj.length;
			for (let i = 0; i < len; ++i) {
				copy[i] = CommonUtils.cloneObject(obj[i]);
			}
			return copy;
		}

		if (obj instanceof Object) {
			let copy = {};
			for (let attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = CommonUtils.cloneObject(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	/**
	 * 获取一个对象的字符串名字
	 * @param obj  可以是类名,数字,显示对象,字符串
	 * 注意:如果参数是一个显示对象,需要递归遍历显示对象树,
	 * 你的显示对象必须是所在类的子显示对象,并且添加到了显示列表中,否则将得到一个错误的值
	 * 所以不是必须的话不建议传一个显示对象.
	 */
	public static getObjName(obj: any): string {
		let key: string = "";
		if (obj instanceof egret.DisplayObject) {
			this.findName(obj);
		} else if (typeof (obj) == "number")
			key = obj.toString();
		else if (typeof (obj) == "string")//类名
			key = obj;
		else if (typeof (obj) == "function")//构造函数
			key = egret.getQualifiedClassName(obj);
		else
			DebugUtils.log("需要获取的对象类型错误" + obj);
		return key;
	}

	private static findName(obj: egret.DisplayObject): string {
		if (obj.parent) {
			for (let key in obj.parent) {
				if (obj.parent[key] == obj) {
					return key;
				}
			}
			return this.findName(obj.parent);
		} else {
			return obj.name;
		}
	}

}
