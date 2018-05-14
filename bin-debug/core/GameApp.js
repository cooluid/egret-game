var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameApp = (function () {
    function GameApp() {
        // ReportData.getIns().report('loaded');
        //全局配置数据
        GlobalConfig.init(function () {
            DebugUtils.log("\u914D\u8868\u89E3\u6790\u6210\u529F");
        });
        for (var i in GameSystem) {
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
    GameApp.prototype.onComplete = function () {
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
    };
    GameApp.prototype.onProgress = function (itemsLoaded, itemsTotal) {
        LocationProperty.setLoadProgress(40 + (itemsLoaded / itemsTotal * 30), "(加载必要资源)");
    };
    GameApp.postPerLoadProgress = function (itemsLoaded, itemsTotal) {
        return [itemsLoaded, itemsTotal];
    };
    //这里不直接用post是因为有可能组内有加载项失败
    //如果失败可以在这里处理之后在post
    GameApp.doPerLoadComplete = function () {
        this.postPerLoadComplete();
        SceneManager.ins().runScene(MainScene);
    };
    GameApp.postPerLoadComplete = function () {
    };
    GameApp.postLoginInit = function () {
    };
    return GameApp;
}());
__reflect(GameApp.prototype, "GameApp");
MessageCenter.compile(GameApp);
