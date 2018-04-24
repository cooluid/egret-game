class ViewManager extends BaseClass {
	/** 已注册的UI信息 */
	private _regesterInfo: any;
	/** ui实体 */
	private _views: any;

	private _hCode2Key: any;
	/** 开启中UI */
	private _opens: string[];

	public constructor() {
		super();
		this._regesterInfo = {};
		this._views = {};
		this._hCode2Key = {};
		this._opens = [];
	}

	public static ins(): ViewManager {
		return super.ins() as ViewManager
	}

	/**
	 * 清空处理
	 */
	public clear(): void {
		this.closeAll();
		this._views = {};
	}

	/**
	 * 面板注册
	 * @param viewClass 面板类
	 * @param layer 层级
	 */
	public reg(viewClass: any, layer: BaseSpriteLayer): void {
		if (viewClass == null) {
			return;
		}
		let keys: string = egret.getQualifiedClassName(viewClass);
		if (this._regesterInfo[keys]) {
			return;
		}
		this._regesterInfo[keys] = [viewClass, layer];
	}

	/**
	 * 销毁一个面板
	 * @param hCode
	 */
	public destroy(hCode: number): void {
		let keys: number = this._hCode2Key[hCode];
		delete this._views[keys];
	}

	private getKey(nameOrClass: any): string {
		let key: string = "";
		if (typeof (nameOrClass) == "string")//类名
			key = nameOrClass;
		else if (typeof (nameOrClass) == "function")//构造函数
			key = egret.getQualifiedClassName(nameOrClass);
		else if ((nameOrClass) instanceof BaseEuiView) {
			let keys = Object.keys(this._views);
			for (let i: number = 0, len = keys.length; i < len; i++) {
				let tempKey: string = keys[i];
				if (this._views[tempKey] == nameOrClass) {
					key = tempKey;
					break;
				}
			}
		}
		else
			DebugUtils.log("打开界面只支持类名和类名的字符串形式,关闭界面只支持类名和类名的字符串以及类的实例形式,错误编号:" + nameOrClass);
		return key;
	}

	/**
	 * 检测能否开启
	 * @param key 类名
	 * @param param
	 * @returns {boolean}
	 */
	private viewOpenCheck(key: string, ...param: any[]): boolean {
		let result: boolean = true;    //为什么默认是true，当info为空时应该返回null？
		let info: any[] = this._regesterInfo[key];
		if (info != null) {
			let c: any = info[0];
			let f: Function = c["openCheck"] as Function;
			if (f != null) {
				result = f(...param);
			}
		}

		return result;
	}

	public toggleWin(nameOrClass: any, ...param: any[]): void {
		let isShow: boolean = this.isShow(nameOrClass);
		if (isShow) {
			ViewManager.ins().close(nameOrClass);
		}
		else {
			ViewManager.ins().open(nameOrClass);
		}
		return null;
	}

	private filters: string[] = ["TipsView"];


	public openByScript(param: any[]) {
		if (param.length > 1) {
			let winParam = param.slice(1, param.length);
			ViewManager.ins().open(param[0], winParam);
		}
		else {
			ViewManager.ins().open(param[0]);
		}
	}


	/**
	 * 统一打开窗口函数
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @param param 打开窗口传入的参数
	 *  */
	public open(nameOrClass: any, ...param: any[]): BaseEuiView {
		let key = this.getKey(nameOrClass);

		//检测能否开启
		if (this.viewOpenCheck(key, ...param) == false) {
			return null;
		}

		let view: BaseEuiView = this.openEasy(key, param);
		if (view) {
			this.checkOpenView(view);
			DebugUtils.log("成功打开窗口:" + key);
		} else {
			// DebugUtils.log("成功打开窗口:" + key);
		}
		return view;
	}

	//简单的打开一个界面
	public openEasy(nameOrClass: any, param: any[] = null): BaseEuiView {
		let keys: string = this.getKey(nameOrClass);
		let view: BaseEuiView = this._views[keys];
		let info: any[] = this._regesterInfo[keys];

		if (!view) {
			//参数参考this.register函数
			view = new info[0]();
			// view.$setParent(info[1]);
			this._views[keys] = view;
			this._hCode2Key[view.hashCode] = keys;
		}

		if (view == null) {
			Debug.log("UI_" + keys + "不存在");
			return null;
		}

		//关闭互斥窗口
		for (let exclusionWin of view.exclusionWins) {
			this.closeEasy(exclusionWin);
		}

		if (view.isShow() || view.isInit()) {
			view.open.apply(view, param);  //第一个参数表示函数运行的作用域，第二个是参数数组
			view.addToParent(info[1]);
		} else {
			this.openWin();
			view.loadResource(function () {
				view.addToParent(info[1]);
				view.setVisible(false);
			}.bind(this), function () {
				view.initUI();
				view.initData();
				view.open.apply(view, param);
				view.setVisible(true);
				this.openWinCom();
			}.bind(this));
		}

		if (this._opens.indexOf(keys) == -1)
			this._opens.push(keys);
		return view;
	}

	private checkOpenView(view: BaseEuiView): void {
		if (view.isTopLevel) {//1级界面,需要关闭其他
			this.openTopWin();
			// GameMap.ins().removeFromParent();
		}
	}

	//----------------------------------------------------关闭-------------------------------------
	/**
	 * 统一关闭窗口函数
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @param param 关闭传入的参数
	 **/
	public close(nameOrClass: any, ...param: any[]): void {
		let key: string = this.getKey(nameOrClass);
		// DebugUtils.log("开始关闭窗口" + key);
		let view: BaseEuiView = this.closeEasy(key, param);
		if (view) {
			this.checkCloseView();
			DebugUtils.log("成功关闭窗口" + key);
		} else {
			DebugUtils.log("窗口不存在" + key);
		}
	}

	//简单关闭一个窗口
	public closeEasy(nameOrClass: any, ...param: any[]): BaseEuiView {
		if (!this.isShow(nameOrClass)) {
			return null;
		}
		let key: string = this.getKey(nameOrClass);
		let view: BaseEuiView = this.getView(key);
		if (view) {
			let viewIndex = this._opens.indexOf(key);
			if (viewIndex >= 0) {
				this._opens.splice(viewIndex, 1);
			}
			view.close.apply(view, param);
			view.$onClose.apply(view);
			view.removeFromParent();
		}
		return view;
	}

	private checkCloseView(): void {
		let hasTopLevelWin: boolean = false;//是否有一级窗口
		for (let key of this._opens) {
			let win: BaseEuiView = this.getView(key);
			if (win && win.isTopLevel) {
				hasTopLevelWin = true;
				break;
			}
		}
		if (!hasTopLevelWin) {
			this.closeTopWin();
			// GameMap.ins().addToParent();
		}
	}

	public openTopWin(): void {
	}

	public closeTopWin(): void {

	}

	public openWin(): void {

	}

	public openWinCom(): void {

	}

	/**
	 * 获取一个UI对象
	 * 返回null代表未初始化
	 * @param nameOrClass  类名,类字符串名,或者类对象
	 * @returns BaseEuiView
	 */
	public getView(nameOrClass: any): BaseEuiView {
		let keys: string = this.getKey(nameOrClass);
		// if (this._views[keys] instanceof Array)
		// 	return null;
		return this._views[keys];
	}

	/**
	 * 关闭所有开启中的UI
	 */
	public closeAll(): void {
		while (this._opens.length) {
			this.closeEasy(this._opens[0], []);
		}
		this.checkCloseView()
	}

	/**
	 * 关闭所有一级界面
	 */
	public closeTopLevel(): void {
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];
			let view: BaseEuiView = this.getView(keys);
			if (view.isTopLevel)
				this.closeEasy(keys, []);
		}
		this.checkCloseView();
	}

	/**
	 * 当前ui打开数量
	 * @returns {number}
	 */
	public openNum(): number {
		return this._opens.length;
	}

	/**
	 * 检测一个UI是否开启中
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @returns {boolean}
	 */
	public isShow(nameOrClass: any): boolean {
		return this._opens.indexOf(this.getKey(nameOrClass)) >= 0;
	}
}
