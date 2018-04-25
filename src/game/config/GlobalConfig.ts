/**
 * 全局配置（带有报错输出检测）
 */
class GlobalConfig {

	private static _instance: any;

	public static ins(): GlobalConfig {
		if (this._instance == null) {
			this._instance = {};
		}
		return this._instance;
	}

	public static init(callBack: Function) {
		let data = RES.getRes('config_json');
		if (data && Object.keys(data).length > 0) {
			this._instance = data;
			RES.destroyRes('config_json');
			LocationProperty.setLoadProgress(80, '加载游戏配置文件（原始）')
			if (callBack) callBack();
		} else {
			this.loadConfByUrl(callBack);
		}
	}

	private static loadConfByUrl(callBack: Function, cnt: number = 0) {
		let url = `resource/cfg/congfig.json`;
		let dir = ResVersionManager.ins().getDir(url);
		LocationProperty.setLoadProgress(85, `加载游戏配置文件(v${cnt})`);
		RES.getResByUrl(`${LocationProperty.resAdd}${dir}/${url}?v=${cnt}`, (data) => {
			if (data && Object.keys(data).length > 0) {
				this._instance = data;
				if (callBack) callBack();
			} else {
				GlobalConfig.loadConfByUrl(callBack, cnt++);
			}
		}, this, RES.ResourceItem.TYPE_JSON)
	}

	private static getArrayConfByIndex(index: number, conf: Object): any {
		let config = conf[index];
		if (config) return config;

		for (let key in this.ins()) {
			if (this.ins()[key] != conf) continue;
			Assert(conf[index], `${key} index not exits:${index}`);
			for (let k in conf) {
				config = conf[k];
				break;
			}
		}
		return config;
	}

	public static getNostopConf(): NostopConf[] {
		return this.ins()['NostopConf'] || [];
	}

	public static getNostopConfByIndex(index: number): NostopConf {
		return this.getArrayConfByIndex(index, this.getNostopConf());
	}

	// private static configZip: JSZip;
	// private static config: any;

	// public static init() {
	// 	// if (!this.configZip)
	// 	// 	this.configZip = new JSZip(RES.getRes("config"));
	// 	if (!this.config) {
	// 		this.config = RES.getRes("config_json");
	// 	}
	// }

	// private getConfig(propName: string): any {
	// 	// if (this[propName] == null) {
	// 	// 	let ziObj = GlobalConfig.configZip.file(`data/${propName}.json`);
	// 	// 	if (ziObj) {
	// 	// 		this[propName] = JSON.parse(ziObj.asText());
	// 	// 	} else {
	// 	// 		Debug.error(`!!!配置解析失败：[${propName}]`)
	// 	// 	}
	// 	// }
	// 	// return this[propName];

	// 	if (this[propName] == null) {
	// 		this[propName] = GlobalConfig.config[propName];
	// 	}
	// 	return this[propName];
	// }
}
