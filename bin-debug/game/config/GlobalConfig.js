var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 全局配置
 */
var GlobalConfig = (function () {
    function GlobalConfig() {
    }
    GlobalConfig.ins = function () {
        if (this._instance == null) {
            this._instance = new GlobalConfig();
        }
        return this._instance;
    };
    GlobalConfig.init = function () {
        // if (!this.configZip)
        // 	this.configZip = new JSZip(RES.getRes("config"));
        if (!this.config) {
            this.config = RES.getRes("config_json");
        }
    };
    GlobalConfig.prototype.getConfig = function (propName) {
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
    };
    GlobalConfig.EquipStageConfig = function () {
        return GlobalConfig.ins().getConfig("equipstageconfig")['EquipStageConfig'];
    };
    GlobalConfig.MonsterConfig = function (id) {
        return GlobalConfig.ins().getConfig("monster")["Monster"][id];
    };
    GlobalConfig.EquipUpgradeConfig = function () {
        return GlobalConfig.ins().getConfig("equipupgradeconfig")["EquipUpgradeConfig"];
    };
    GlobalConfig.MoJieMiJingBossConfList = function () {
        return GlobalConfig.ins().getConfig("mojiemijingbossconf")["MoJieMiJingBossConf"];
    };
    /**
     * npc
     */
    GlobalConfig.getNpcConf = function (id) {
        return GlobalConfig.ins().getConfig("npc")["NpcConf"][id];
    };
    /**获取指定场景npc */
    GlobalConfig.getSceneNpcList = function (scene) {
        var list = [];
        var confList = GlobalConfig.ins().getConfig("npc")["NpcConf"];
        for (var id in confList) {
            var conf = confList[id];
            if (conf.scene == scene) {
                list.push(conf);
            }
        }
        return list;
    };
    return GlobalConfig;
}());
__reflect(GlobalConfig.prototype, "GlobalConfig");
