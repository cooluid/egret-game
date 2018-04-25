class NostopWin extends BaseEuiView {
	public constructor() {
		super();
		this.skinName = 'NostopWinSkin';
		let conf = GlobalConfig.getNostopConfByIndex(1);
		DebugUtils.log(conf);
		this.addTouchEvent(this, () => {
			ViewManager.ins().close(this);
			ViewManager.ins().open(NostopPlayerWin);
		});
	}
}

ViewManager.ins().reg(NostopWin, LayerManager.UI_Main);