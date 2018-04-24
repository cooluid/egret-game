var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2016/7/18.
 */
var ReportData = (function () {
    function ReportData() {
        this.httpRequest = new egret.HttpRequest();
    }
    ReportData.getIns = function () {
        this._ins = this._ins || new ReportData();
        return this._ins;
    };
    /** 上报打点记录 */
    ReportData.prototype.report = function (str, reportType) {
        if (reportType === void 0) { reportType = "load"; }
        var roleCount = LocationProperty.roleCount;
        //不是新账号不需要上报数据
        if (reportType == "load" && (isNaN(roleCount) || roleCount != 0))
            return;
        /*
         参数说明：
         pfrom_id: 平台标识 string（16）//登陆时新增登陆参数 pfid
         server_id：区服id smallint（5）
         account: 平台帐号 string(64)
         counter: 打点标识 固定值load
         kingdom：记录打点位置 string 32
         is_new：是否新帐号 默认为 1
         exts：扩展字段 string（32） 非必要字段
         ip 登陆ip
         logdate:2016-03-07 04:23:48请求时间精确到秒
         */
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            ua = "1";
        }
        else if (/android/.test(ua)) {
            ua = "2";
        }
        else
            ua = "0";
        str = str.replace(/@/g, "");
        str = str.replace(/#/g, "");
        var data = "&data=";
        data += "1";
        data += "|" + LocationProperty.srvid;
        data += "|" + LocationProperty.openID;
        data += "|" + reportType;
        data += "|" + str;
        data += "|" + LocationProperty.isnew;
        data += "|" + ua;
        data += "|" + LocationProperty.login_ip;
        data += "|" + DateUtils.getFormatBySecond(new Date().getTime(), 2);
        data += "|" + LocationProperty.appid;
        var add = DeviceUtils.isLocation ? "192.168.201.235:81" : "report.jzsc.7yao.top";
        // let m = new md5();
        // let key = m.hex_md5(`${reportType}027a47eabf1ebcb409b7fe680ff69008`);
        // key = m.hex_md5(key);
        //
        // this.reportUrl("http://" + add + "/report?appv=1.0&counter=" + reportType + "&key=" + key + data);
    };
    /** 上报打点记录 */
    ReportData.prototype.report2 = function (str, reportType) {
        // let roleCount: number = LocationProperty.roleCount;
        // //不是新账号不需要上报数据
        // if (reportType == "load" && (isNaN(roleCount) || roleCount != 0))
        // 	return;
        if (reportType === void 0) { reportType = "load"; }
        /*
         参数说明：
         pfrom_id: 平台标识 string（16）//登陆时新增登陆参数 pfid
         server_id：区服id smallint（5）
         account: 平台帐号 string(64)
         counter: 打点标识 固定值load
         kingdom：记录打点位置 string 32
         is_new：是否新帐号 默认为 1
         exts：扩展字段 string（32） 非必要字段
         ip 登陆ip
         logdate:2016-03-07 04:23:48请求时间精确到秒
         */
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            ua = "1";
        }
        else if (/android/.test(ua)) {
            ua = "2";
        }
        else
            ua = "0";
        var data = "&data=";
        data += "1";
        data += "|" + LocationProperty.srvid;
        data += "|" + LocationProperty.openID;
        data += "|" + reportType;
        data += "|" + str;
        data += "|" + LocationProperty.isnew;
        data += "|" + ua;
        data += "|" + LocationProperty.login_ip;
        data += "|" + DateUtils.getFormatBySecond(new Date().getTime(), 2);
        data += "|" + LocationProperty.appid;
        var add = DeviceUtils.isLocation ? "192.168.201.235:81" : "report.jzsc.7yao.top";
        // let m = new md5();
        // let key = m.hex_md5(`${reportType}027a47eabf1ebcb409b7fe680ff69008`);
        // key = m.hex_md5(key);
        // this.reportUrl("http://" + add + "/report?appv=1.0&counter=" + reportType + "&key=" + key + data);
    };
    /** 上报建议 */
    ReportData.prototype.advice = function (str, func, funcThis) {
        var f = function (v) {
            this.httpRequest.removeEventListener(egret.Event.COMPLETE, f, this);
            var request = v.currentTarget;
            if (request.response == "ok") {
                TipsControl.ins().showTips("提交问题成功！");
                func.call(funcThis);
            }
            else
                TipsControl.ins().showTips("网络出故障，请重新提交问题！");
        };
        this.httpRequest.addEventListener(egret.Event.COMPLETE, f, this);
        var p;
        while (true) {
            p = str.indexOf("@");
            if (p < 0)
                break;
            str = str.replace("@", "");
        }
        var data = "&serverid=" + LocationProperty.srvid;
        // data += "&sign=" + new md5().hex_md5(`${LocationProperty.srvid || 0}${GameGlobal.actorModel.actorID}enter_reportfeedbackqiyaohudongyule!@#`);
        // data += "&actorid=" + GameGlobal.actorModel.actorID;
        // data += "&actorname=" + GameGlobal.actorModel.name;
        // data += "&feedcnt=" + str;
        // data += "&openid=" + LocationProperty.openID;
        // data += "&userlevel=" + GameGlobal.actorModel.level;
        // data += "&viplevel=" + GameGlobal.actorModel.vipLv;
        // data += "&appid=" + LocationProperty.appid;
        var add = DeviceUtils.isLocation ? "cq.api.com" : "login.jzsc.7yao.top";
        this.reportUrl("http://" + add + "/api/load?counter=enter_report" + data);
        //this.httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        //this.httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
    };
    ReportData.prototype.reportUrl = function (url, method) {
        this.httpRequest.open(url, method ? method : egret.HttpMethod.GET);
        this.httpRequest.send();
    };
    ReportData.prototype.reportSDK = function (str) {
        // window['reportSDK'](str,
        // 	LocationProperty.app_openid,
        // 	LocationProperty.srvid,
        // 	LocationProperty.openID,
        // 	LocationProperty.nickName,
        // 	GameGlobal.actorModel.level);
    };
    return ReportData;
}());
__reflect(ReportData.prototype, "ReportData");
