class DebugUtils {
	private static _isOpen: boolean;
	private static _startTimes: any = {};
	private static _threshold: number = 3;

	/**
	 * 设置调试是否开启
	 * @param flag
	 *
	 */
	public static isOpen(flag: boolean): void {
		this._isOpen = flag;
	}

	/**
	 * 是否是调试模式
	 * @returns {boolean}
	 */
	public static set isDebug(value: boolean) {
		window['isDebug'] = value;
	}

	/**
	 * 是否是调试模式
	 * @returns {boolean}
	 */
	public static get isDebug(): boolean {
		return window['isDebug'] ? window['isDebug'] : false;
	}

	public static log(msg: any, ...param: any[]): void {
		if (DebugUtils.isDebug) console.log(msg, ...param);
	}

	public static warn(msg: any, ...param: any[]): void {
		if (DebugUtils.isDebug) console.warn(msg, ...param);
	}

	public static error(msg: any, ...param: any[]): void {
		if (DebugUtils.isDebug) console.error(msg, ...param);
	}

	public static info(msg: any, ...param: any[]): void {
		if (DebugUtils.isDebug) console.info(msg, ...param);
	}

	/**
	 * 开始
	 * @param key 标识
	 * @param minTime 最小时间
	 *
	 */
	public static start(key: string): void {
		if (!this._isOpen) {
			return;
		}

		this._startTimes[key] = egret.getTimer();
	}

	/**
	 * 停止
	 *
	 */
	public static stop(key): number {
		if (!this._isOpen) {
			return 0;
		}

		if (!this._startTimes[key]) {
			return 0;
		}

		let cha: number = egret.getTimer() - this._startTimes[key];
		if (cha > this._threshold) {
			console.log(key + ": " + cha);
		}
		return cha;
	}

	/**
	 * 设置时间间隔阈值
	 * @param value
	 */
	public static setThreshold(value: number): void {
		this._threshold = value;
	}
}
