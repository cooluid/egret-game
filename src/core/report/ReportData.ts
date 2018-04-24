/**
 * Created by Administrator on 2016/7/18.
 */
class ReportData {

	private static _ins: ReportData;

	private httpRequest: egret.HttpRequest;

	static getIns(): ReportData {
		this._ins = this._ins || new ReportData();
		return this._ins;
	}

	constructor() {
		this.httpRequest = new egret.HttpRequest();
	}

	/** 上报打点记录 */
	report(str: string, reportType: string = "load") {
		let roleCount: number = LocationProperty.roleCount;
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
		let ua: string = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			ua = "1";
		} else if (/android/.test(ua)) {
			ua = "2";
		}
		else ua = "0";

		str = str.replace(/@/g, "");
		str = str.replace(/#/g, "");

		let data: string = "&data=";
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

		let add: string = DeviceUtils.isLocation ? "192.168.201.235:81" : "report.jzsc.7yao.top";

		// let m = new md5();
		// let key = m.hex_md5(`${reportType}027a47eabf1ebcb409b7fe680ff69008`);
		// key = m.hex_md5(key);
		//
		// this.reportUrl("http://" + add + "/report?appv=1.0&counter=" + reportType + "&key=" + key + data);
	}

	/** 上报打点记录 */
	report2(str: string, reportType: string = "load") {
		// let roleCount: number = LocationProperty.roleCount;
		// //不是新账号不需要上报数据
		// if (reportType == "load" && (isNaN(roleCount) || roleCount != 0))
		// 	return;

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
		let ua: string = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			ua = "1";
		} else if (/android/.test(ua)) {
			ua = "2";
		}
		else ua = "0";

		let data: string = "&data=";
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

		let add: string = DeviceUtils.isLocation ? "192.168.201.235:81" : "report.jzsc.7yao.top";

		// let m = new md5();
		// let key = m.hex_md5(`${reportType}027a47eabf1ebcb409b7fe680ff69008`);
		// key = m.hex_md5(key);

		// this.reportUrl("http://" + add + "/report?appv=1.0&counter=" + reportType + "&key=" + key + data);
	}

	/** 上报建议 */
	advice(str: string, func: Function, funcThis: any) {
		let f: Function = function (v: egret.Event) {
			this.httpRequest.removeEventListener(egret.Event.COMPLETE, f, this);
			let request = <egret.HttpRequest>v.currentTarget;
			if (request.response == "ok") {
				TipsControl.ins().showTips("提交问题成功！");
				func.call(funcThis);
			}
			else
				TipsControl.ins().showTips("网络出故障，请重新提交问题！");
		};
		this.httpRequest.addEventListener(egret.Event.COMPLETE, f, this);

		let p: number;
		while (true) {
			p = str.indexOf("@");
			if (p < 0)
				break;
			str = str.replace("@", "");
		}

		let data: string = "&serverid=" + LocationProperty.srvid;
		// data += "&sign=" + new md5().hex_md5(`${LocationProperty.srvid || 0}${GameGlobal.actorModel.actorID}enter_reportfeedbackqiyaohudongyule!@#`);
		// data += "&actorid=" + GameGlobal.actorModel.actorID;
		// data += "&actorname=" + GameGlobal.actorModel.name;
		// data += "&feedcnt=" + str;
		// data += "&openid=" + LocationProperty.openID;
		// data += "&userlevel=" + GameGlobal.actorModel.level;
		// data += "&viplevel=" + GameGlobal.actorModel.vipLv;
		// data += "&appid=" + LocationProperty.appid;

		let add: string = DeviceUtils.isLocation ? "cq.api.com" : "login.jzsc.7yao.top";

		this.reportUrl("http://" + add + "/api/load?counter=enter_report" + data);

		//this.httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
		//this.httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
	}

	reportUrl(url: string, method?: string) {
		this.httpRequest.open(url, method ? method : egret.HttpMethod.GET);
		this.httpRequest.send();
	}

	reportSDK(str: string) {
		// window['reportSDK'](str,
		// 	LocationProperty.app_openid,
		// 	LocationProperty.srvid,
		// 	LocationProperty.openID,
		// 	LocationProperty.nickName,
		// 	GameGlobal.actorModel.level);
	}
}