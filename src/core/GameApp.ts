class GameApp {

	public constructor() {
		// ReportData.getIns().report('loaded');

		//全局配置数据
		GlobalConfig.init();

		// for (let i in ComplieClass) {
		// 	ComplieClass[i]();
		// }

		for (let i in GameSystem) {
			GameSystem[i]();
		}

		//地图网格初始化
		// GameMap.ins().init(data);

		//音乐音效处理
		SoundManager.ins().setEffectOn(true);
		GameApp.doPerLoadComplete();
		// let groupName = LocationProperty.isFirstLoad ? "firstLoad" : "preload";
		// ResourceUtils.ins().loadGroup(groupName, this.onComplete, this.onProgress, this);
	}

	private onComplete(): void {

		// RES.getResByUrl(`${MAP_DIR}maps.json`, (data) => {

		// 	ReportData.getIns().report('loaded');

		// 	//全局配置数据
		// 	// GlobalConfig.init();

		// 	// for (let i in GameSystem) {
		// 	// 	GameSystem[i]();
		// 	// }

		// 	//音乐音效处理
		// 	SoundManager.ins().setEffectOn(true);

		// 	LocationProperty.setLoadProgress(90, "(登录游戏中)");

		// 	// RoleCC.ins().connectServer();	//连接服务器

		// 	if (LocationProperty.isFirstLoad) {
		// 		ResourceUtils.ins().loadGroup("preload",
		// 			GameApp.doPerLoadComplete,
		// 			GameApp.postPerLoadProgress, GameApp);
		// 	}
		// }, this);
	}

	private onProgress(itemsLoaded: number, itemsTotal: number): void {
		LocationProperty.setLoadProgress(40 + (itemsLoaded / itemsTotal * 30), "(加载必要资源)");
	}

	public static postPerLoadProgress(itemsLoaded: number, itemsTotal: number): number[] {
		return [itemsLoaded, itemsTotal];
	}

	//这里不直接用post是因为有可能组内有加载项失败
	//如果失败可以在这里处理之后在post
	public static doPerLoadComplete() {
		this.postPerLoadComplete();
		ViewManager.ins().open(MainWin);
	}

	public static postPerLoadComplete() {
	}

	public static postLoginInit(): void {
	}
}
MessageCenter.compile(GameApp);
