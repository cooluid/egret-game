class LocationProperty {

	private static urlParam: any;

	public static init(): void {
		this.urlParam = {};
		let str: string = window['paraUrl'];
		if (str) {
			let whIndex: number = str.indexOf("?");
			if (whIndex != -1) {

				let param: string[] = str.slice(whIndex + 1).split("&");
				let strArr: string[];
				for (let i: number = 0; i < param.length; i++) {
					strArr = param[i].split("=");
					this.urlParam[strArr[0]] = strArr[1];
				}
			}
		}
	}

	static get resAdd(): string {
		return this.urlParam['hosts'] || "";
	}

	static set resAdd(str: string) {
		this.urlParam['hosts'] = str;
	}

	static get openID(): string {
		return this.urlParam['user'];
	}

	static set openID(str: string) {
		this.urlParam['user'] = str;
	}

	static get srvid(): number {
		return this.urlParam['srvid'];
	}

	static set srvid(v: number) {
		this.urlParam['srvid'] = v;
	}

	static get serverIP(): string {
		return this.urlParam['srvaddr'];
	}

	static set serverIP(str: string) {
		this.urlParam['srvaddr'] = str;
	}

	static get serverPort(): number {
		return this.urlParam['srvport'] || 9001;
	}

	static set serverPort(v: number) {
		this.urlParam['srvport'] = v;
	}

	static get password(): string {
		return this.urlParam['spverify'] || "e10adc3949ba59abbe56e057f20f883e";
	}

	static get openKey(): string {
		return this.urlParam['openkey'];
	}

	//srvid和服后的id
	//serverid和服前的id
	static get serverID(): string {
		return this.urlParam['serverid'];
	}

	static get appid(): string {
		return this.urlParam['appid'] || "";
	}

	static get app_openid(): string {
		return this.urlParam['app_openid'] || "";
	}

	static get isSubscribe(): string {
		return this.urlParam['isSubscribe'];
	}

	static get nickName(): string {
		let str: string = this.urlParam['nickName'] || "";
		try {
			return str.length ? decodeURIComponent(str) : str;
		}
		catch (e) {
			return str;
		}
	}

	static get callUrl(): string {
		let str: string = this.urlParam['callUrl'] || "";
		return str.length ? decodeURIComponent(str) : str;
	}

	static get gifi(): string {
		return this.urlParam['gifi'];
	}

	static get roleCount(): number {
		return parseInt(this.urlParam['roleCount']);
	}

	static get isnew(): number {
		return parseInt(this.urlParam['isnew']);
	}

	static get login_ip(): string {
		return this.urlParam['login_ip'];
	}

	static get is_attention(): string {
		return this.urlParam['is_attention'];
	}

	static get isShowShare(): boolean {
		return window['isShowShare'];
	}

	static get v(): number {
		return parseInt(this.urlParam['v']);
	}

	static get isYelloVip(): number {
		return parseInt(this.urlParam['isYelloVip']);
	}

	static get isYelloYearVip(): number {
		return parseInt(this.urlParam['isYelloYearVip']);
	}

	static get yelloVipLevel(): number {
		return parseInt(this.urlParam['yelloVipLevel']);
	}

	static get isYelloHighVip(): number {
		return parseInt(this.urlParam['isYelloHighVip']);
	}

	static isCanLogin(): boolean {
		return this.openID != null &&
			this.password != null &&
			this.srvid != null &&
			this.serverIP != null &&
			this.serverPort != null;
	}

	static get isWaiWang(): boolean {
		//内网登录没有roleCount参数
		return !isNaN(LocationProperty.roleCount);
	}

	static get isFirstLoad(): boolean {
		return LocationProperty.isWaiWang && !LocationProperty.roleCount;
		//test
		// return !LocationProperty.roleCount;
	}

	/**
	 * 设置加载进度 & 描述
	 */
	static setLoadProgress(n: number, str: string): void {
		// window['showLoadProgress'](n, str);
		DebugUtils.log(`${n}, ${str}`)
	}
}
