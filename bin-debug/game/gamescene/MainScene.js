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
/**
 * 游戏主场景
 */
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入场景调用
     */
    MainScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.addLayerAt(LayerManager.Game_Bg, 1);
        this.addLayerAt(LayerManager.Game_Main, 2);
        this.addLayer(LayerManager.UI_Main);
        this.addLayer(LayerManager.UI_Main2);
        this.addLayer(LayerManager.UI_Popup);
        this.addLayer(LayerManager.UI_Tips);
        GameApp.postLoginInit();
        SoundManager.ins().stopBg();
        new GameApp();
    };
    /**
     * 退出Scene调用
     */
    MainScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return MainScene;
}(BaseScene));
__reflect(MainScene.prototype, "MainScene");
