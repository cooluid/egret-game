class ResourceUtils extends BaseClass {
	private _configs: Array<any>;
	private _onConfigComplete: Function;
	private _onConfigCompleteTarget: any;

	private _groups: any;
	private _groupIndex: number = 0;

	private _urlResorce: any;

	/**
	 * 构造函数
	 */
	public constructor() {
		super();

		this._configs = new Array<any>();
		this._groups = {};
		this._urlResorce = {};

		RES.setMaxLoadingThread(4);

		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
	}


	public static ins(): ResourceUtils {
		return super.ins() as ResourceUtils;
	}

	/**
	 * 添加一个配置文件
	 * @param jsonPath resource.json路径
	 * @param filePath 访问资源路径
	 */
	public addConfig(jsonPath: string, filePath: string): void {
		this._configs.push([jsonPath, filePath]);
	}

	/**
	 * 开始加载配置文件
	 * @param $onConfigComplete 加载完成执行函数
	 * @param $onConfigCompleteTarget 加载完成执行函数所属对象
	 */
	public loadConfig($onConfigComplete: Function, $onConfigCompleteTarget: any): void {
		this._onConfigComplete = $onConfigComplete;
		this._onConfigCompleteTarget = $onConfigCompleteTarget;
		this.loadNextConfig();
	}

	/**
	 * 加载
	 */
	private loadNextConfig(): void {
		//加载完成
		if (this._configs.length == 0) {
			this._onConfigComplete.call(this._onConfigCompleteTarget);
			this._onConfigComplete = null;
			this._onConfigCompleteTarget = null;
			return;
		}

		let arr: any = this._configs.shift();
		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
		RES.loadConfig(arr[0], arr[1]);
	}

	/**
	 * 加载完成
	 * @param event
	 */
	private onConfigCompleteHandle(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
		this.loadNextConfig();
	}

	/**
	 * 加载资源组
	 * @param $groupName 资源组名称
	 * @param $onResourceLoadComplete 资源加载完成执行函数
	 * @param $onResourceLoadProgress 资源加载进度监听函数
	 * @param $onResourceLoadTarget 资源加载监听函数所属对象
	 */
	public loadGroup($groupName: string, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void {
		this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
		RES.loadGroup($groupName);
	}

	/**
	 * 同时加载多个组
	 * @param $groupName 自定义的组名称
	 * @param $subGroups 所包含的组名称或者key名称数组
	 * @param $onResourceLoadComplete 资源加载完成执行函数
	 * @param $onResourceLoadProgress 资源加载进度监听函数
	 * @param $onResourceLoadTarget 资源加载监听函数所属对象
	 */
	public loadGroups($groupName: string, $subGroups: Array<any>, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void {
		RES.createGroup($groupName, $subGroups, true);
		this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget)
	}

	/**
	 * 静默加载
	 * @param $groupName 资源组名称
	 * @param $groupName 所包含的组名称或者key名称数组
	 */
	public pilfererLoadGroup($groupName: string, $subGroups: Array<any> = null): void {
		//添加前缀，防止与正常加载组名重复
		let useGroupName = "pilferer_" + $groupName;
		if (!$subGroups) {
			$subGroups = [$groupName];
		}
		RES.createGroup(useGroupName, $subGroups, true);
		RES.loadGroup(useGroupName, -1);
	}

	/**
	 * 资源组加载完成
	 */
	private onResourceLoadComplete(event: RES.ResourceEvent): void {
		let groupName: string = event.groupName;
		if (this._groups[groupName]) {
			let loadComplete: Function = this._groups[groupName][0];
			let loadCompleteTarget: any = this._groups[groupName][2];
			if (loadComplete != null) {
				loadComplete.call(loadCompleteTarget);
			}

			this._groups[groupName] = null;
			delete this._groups[groupName];
		}
	}

	/**
	 * 资源组加载进度
	 */
	private onResourceLoadProgress(event: RES.ResourceEvent): void {
		let groupName: string = event.groupName;
		if (this._groups[groupName]) {
			let loadProgress: Function = this._groups[groupName][1];
			let loadProgressTarget: any = this._groups[groupName][2];
			if (loadProgress != null) {
				loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
			}
		}
	}

	/**
	 * 资源组加载失败
	 * @param event
	 */
	private onResourceLoadError(event: RES.ResourceEvent): void {
		Debug.log(event.groupName + "资源组有资源加载失败");
		this.onResourceLoadComplete(event);
	}

	/**
	 * 混合加载资源组
	 * @param $resources 资源数组
	 * @param $groups 资源组数组
	 * @param $onResourceLoadComplete 资源加载完成执行函数
	 * @param $onResourceLoadProgress 资源加载进度监听函数
	 * @param $onResourceLoadTarget 资源加载监听函数所属对象
	 */
	public loadResource($resources = [], $groups = [], $onResourceLoadComplete: Function = null, $onResourceLoadProgress: Function = null, $onResourceLoadTarget: any = null): void {
		let needLoadArr = $resources.concat($groups);
		let groupName = "loadGroup" + this._groupIndex++;
		RES.createGroup(groupName, needLoadArr, true);
		this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
		RES.loadGroup(groupName);
	}

	/**
	 * 动态加载资源
	 * @param url
	 */
	public loadUrlResource(url: string, type: string, compFun: any, thisObj: any): void {
		if (this._urlResorce[url] == null) {
			this._urlResorce[url] = {
				"data": null,
				"compFun": compFun,
				"thisObj": thisObj
			};
			RES.getResByUrl(url, (data: any) => {
				this._urlResorce[url]["data"] = data;
				if (compFun != null)
					compFun.apply(this._urlResorce[url]["thisObj"]);
			}, this, type);
		}
		else if (compFun != null)
			compFun.apply(thisObj);
	}

	public getUrlResource(url: string): any {
		if (this._urlResorce[url] == null) {
			DebugUtils.log("资源未加载");
			return null;
		}
		return this._urlResorce[url]["data"];
	}
}
