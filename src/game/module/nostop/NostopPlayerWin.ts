class NostopPlayerWin extends BaseEuiView {
	public constructor() {
		super();
		this.skinName = 'NostopPlayerWinSkin';
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.initScene();
	}

	private mainPlayer: NostopMainItem;
	private initScene() {
		//创建主角色移动
		this.mainPlayer = this.mainPlayer || new NostopMainItem();
		this.mainPlayer.x = this.width / 2;
		this.mainPlayer.y = this.height / 2;
		this.addChild(this.mainPlayer);
	}
}
ViewManager.ins().reg(NostopPlayerWin, LayerManager.UI_Popup);