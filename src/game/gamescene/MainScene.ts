/**
 * 游戏主场景
 */
class MainScene extends BaseScene {

	public constructor() {
		super();
	}

	/**
	 * 进入场景调用
	 */
	public onEnter(): void {
		super.onEnter();

		this.addLayerAt(LayerManager.Game_Bg, 1);
		this.addLayerAt(LayerManager.Game_Main, 2);

		this.addLayer(LayerManager.UI_Main);
		this.addLayer(LayerManager.UI_Main2);
		this.addLayer(LayerManager.UI_Popup);
		this.addLayer(LayerManager.UI_Tips);

		GameApp.postLoginInit();

		SoundManager.ins().stopBg();

		new GameApp();
	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		super.onExit();
	}
}
