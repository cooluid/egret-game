var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 全局配置（带有报错输出检测）
 */
var GlobalConfig = (function () {
    function GlobalConfig() {
    }
    GlobalConfig.ins = function () {
        if (this._instance == null) {
            this._instance = {};
        }
        return this._instance;
    };
    GlobalConfig.init = function (callBack) {
        var data = RES.getRes('config_json');
        if (data && Object.keys(data).length > 0) {
            this._instance = data;
            RES.destroyRes('config_json');
            LocationProperty.setLoadProgress(80, '加载游戏配置文件（原始）');
            if (callBack)
                callBack();
        }
        else {
            this.loadConfByUrl(callBack);
        }
    };
    GlobalConfig.loadConfByUrl = function (callBack, cnt) {
        var _this = this;
        if (cnt === void 0) { cnt = 0; }
        var url = "resource/cfg/congfig.json";
        var dir = ResVersionManager.ins().getDir(url);
        LocationProperty.setLoadProgress(85, "\u52A0\u8F7D\u6E38\u620F\u914D\u7F6E\u6587\u4EF6(v" + cnt + ")");
        RES.getResByUrl("" + LocationProperty.resAdd + dir + "/" + url + "?v=" + cnt, function (data) {
            if (data && Object.keys(data).length > 0) {
                _this._instance = data;
                if (callBack)
                    callBack();
            }
            else {
                GlobalConfig.loadConfByUrl(callBack, cnt++);
            }
        }, this, RES.ResourceItem.TYPE_JSON);
    };
    GlobalConfig.getArrayConfByIndex = function (index, conf) {
        var config = conf[index];
        if (config)
            return config;
        for (var key in this.ins()) {
            if (this.ins()[key] != conf)
                continue;
            Assert(conf[index], key + " index not exits:" + index);
            for (var k in conf) {
                config = conf[k];
                break;
            }
        }
        return config;
    };
    GlobalConfig.getNostopConf = function () {
        return this.ins()['NostopConf'] || [];
    };
    GlobalConfig.getNostopConfByIndex = function (index) {
        return this.getArrayConfByIndex(index, this.getNostopConf());
    };
    return GlobalConfig;
}());
__reflect(GlobalConfig.prototype, "GlobalConfig");
