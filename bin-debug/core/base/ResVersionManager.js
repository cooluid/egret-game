var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ResVersionManager = (function (_super) {
    __extends(ResVersionManager, _super);
    /**
     * 构造函数
     */
    function ResVersionManager() {
        var _this = _super.call(this) || this;
        _this.res_loadByVersion();
        _this.resVersionData = window["verData"];
        return _this;
    }
    ResVersionManager.ins = function () {
        return _super.ins.call(this);
    };
    ResVersionManager.prototype.has = function (url) {
        return this.resVersionData.hasOwnProperty(url);
    };
    ResVersionManager.prototype.getDir = function (url) {
        return this.resVersionData[url] & 0xff;
    };
    ResVersionManager.prototype.getVer = function (url) {
        return this.resVersionData[url] >> 8;
    };
    ResVersionManager.prototype.hasVer = function () {
        return !isNaN(LocationProperty.v);
    };
    /**
     * Res加载使用版本号的形式
     */
    ResVersionManager.prototype.res_loadByVersion = function () {
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
    };
    /**
     * 加载资源版本号配置文件
     * @param url 配置文件路径
     * @param complateFunc 加载完成执行函数
     * @param complateFuncTarget 加载完成执行函数所属对象
     */
    ResVersionManager.prototype.loadConfig = function (complateFunc, complateFuncTarget) {
        this.complateFunc = complateFunc;
        this.complateFuncTarget = complateFuncTarget;
        if (this.resVersionData) {
            this.complateFunc.call(this.complateFuncTarget);
            return;
        }
        if (this.hasVer()) {
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            var respHandler = function (evt) {
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
            request.open("" + LocationProperty.resAdd + LocationProperty.v + "/" + LocationProperty.v + ".ver", egret.HttpMethod.GET);
            request.send();
            return;
        }
        this.complateFunc.call(this.complateFuncTarget);
    };
    return ResVersionManager;
}(BaseClass));
__reflect(ResVersionManager.prototype, "ResVersionManager");
//# sourceMappingURL=ResVersionManager.js.map