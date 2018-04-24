class ResVersionManager extends BaseClass {
	private resVersionData: any;
	private complateFunc: Function;
	private complateFuncTarget: any;

	public static ins(): ResVersionManager {
		return super.ins() as ResVersionManager;
	}

	public has(url: string): boolean {
		return this.resVersionData.hasOwnProperty(url);
	}

	public getDir(url: string): number {
		return this.resVersionData[url] & 0xff;
	}

	public getVer(url: string): number {
		return this.resVersionData[url] >> 8;
	}

	public hasVer(): boolean {
		return !isNaN(LocationProperty.v);
	}

	/**
	 * 构造函数
	 */
	public constructor() {
		super();
		this.res_loadByVersion();
		this.resVersionData = window[`verData`];
	}

	/**
	 * Res加载使用版本号的形式
	 */
	private res_loadByVersion(): void {
		// RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {

		// 	let manager = ResVersionManager.ins();
		// 	if (manager.hasVer()) {
		// 		if (manager.has(url)) {
		// 			let dir: number = manager.getDir(url);
		// 			let v: number = manager.getVer(url);
		// 			url = `${LocationProperty.resAdd}${dir}/${url}?v=${v}`;
		// 		}
		// 		else
		// 			url = `${LocationProperty.resAdd}0/${url}`;
		// 	}
		// 	else
		// 		url = `${LocationProperty.resAdd}${url}`;
		// 	return url;
		// }
	}

	/**
	 * 加载资源版本号配置文件
	 * @param url 配置文件路径
	 * @param complateFunc 加载完成执行函数
	 * @param complateFuncTarget 加载完成执行函数所属对象
	 */
	public loadConfig(complateFunc: Function, complateFuncTarget: any): void {
		this.complateFunc = complateFunc;
		this.complateFuncTarget = complateFuncTarget;
		if (this.resVersionData) {
			this.complateFunc.call(this.complateFuncTarget);
			return;
		}

		if (this.hasVer()) {
			let request: egret.HttpRequest = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
			let respHandler = function (evt: egret.Event): void {
				switch (evt.type) {
					case egret.Event.COMPLETE:
						// let request: egret.HttpRequest = evt.currentTarget;
						// let ab: ArrayBuffer = request.response;
						// let verData: any = {};
						// if (ab.byteLength) {
						// 	let plain = new Uint8Array(ab);
						// 	let inflate = new Zlib.Inflate(plain);
						// 	let deplain = inflate.decompress();
						// 	let b = new egret.ByteArray(deplain.buffer);
						// 	let len = deplain.length;
						// 	while (b.position < len) {
						// 		verData[b.readUTF()] = b.readUnsignedInt();
						// 	}
						// }
						// this.resVersionData = verData;
						// this.complateFunc.call(this.complateFuncTarget);
						break;
					case egret.IOErrorEvent.IO_ERROR:
						DebugUtils.log("respHandler io error");
						break;
				}
			};
			request.once(egret.Event.COMPLETE, respHandler, this);
			request.once(egret.IOErrorEvent.IO_ERROR, respHandler, this);
			request.open(`${LocationProperty.resAdd}${LocationProperty.v}/${LocationProperty.v}.ver`, egret.HttpMethod.GET);
			request.send();
			return;
		}

		this.complateFunc.call(this.complateFuncTarget);
	}
}
