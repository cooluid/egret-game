/**
 * 全局配置
 */
class GlobalConfig {

	private static _instance: GlobalConfig;

	public static ins(): GlobalConfig {
		if (this._instance == null) {
			this._instance = new GlobalConfig();
		}
		return this._instance;
	}

	// private static configZip: JSZip;
	private static config: any;

	public static init() {
		// if (!this.configZip)
		// 	this.configZip = new JSZip(RES.getRes("config"));
		if (!this.config) {
			this.config = RES.getRes("config_json");
		}
	}

	public getConfig(propName: string): any {
		// if (this[propName] == null) {
		// 	let ziObj = GlobalConfig.configZip.file(`data/${propName}.json`);
		// 	if (ziObj) {
		// 		this[propName] = JSON.parse(ziObj.asText());
		// 	} else {
		// 		Debug.error(`!!!配置解析失败：[${propName}]`)
		// 	}
		// }
		// return this[propName];

		return GlobalConfig.config;
	}

	public static EquipStageConfig(): any {
		return GlobalConfig.ins().getConfig("equipstageconfig")['EquipStageConfig'];
	}

	public static MonsterConfig(id: number): MonsterConf {
		return GlobalConfig.ins().getConfig("monster")["Monster"][id];
	}

	public static EquipUpgradeConfig(): any {
		return GlobalConfig.ins().getConfig("equipupgradeconfig")["EquipUpgradeConfig"];
	}

	public static MoJieMiJingBossConfList() {
		return GlobalConfig.ins().getConfig(`mojiemijingbossconf`)[`MoJieMiJingBossConf`];
	}

	/**
	 * npc
	 */
	public static getNpcConf(id: number): NpcConf {
		return GlobalConfig.ins().getConfig(`npc`)[`NpcConf`][id];
	}

	/**获取指定场景npc */
	public static getSceneNpcList(scene: number): NpcConf[] {
		let list = [];
		let confList = GlobalConfig.ins().getConfig(`npc`)[`NpcConf`];
		for (let id in confList) {
			let conf: NpcConf = confList[id];
			if (conf.scene == scene) {
				list.push(conf);
			}
		}
		return list;
	}
}
