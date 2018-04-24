class MainWin extends BaseEuiView {
	public imgBg: eui.Image;
	public btnStart: eui.Button;
	public constructor() {
		super();
		this.skinName = 'MainSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.addTouchEvent(this.btnStart, () => {
			ViewManager.ins().close(this);
			// Jump.ins().initGame();
			ViewManager.ins().open(NostopWin);
		});
	}
}
ViewManager.ins().reg(MainWin, LayerManager.UI_Main);