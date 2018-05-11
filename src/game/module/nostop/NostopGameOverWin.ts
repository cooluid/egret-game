class NostopGameOverWin extends BaseEuiView {
	public constructor() {
		super();
		this.skinName = 'NostopGameOverSkin';
	}

	protected childrenCreated(): void {
		this.addTouchEvent(this, () => {
			ViewManager.ins().close(this);
		});
	}
}
ViewManager.ins().reg(NostopGameOverWin, LayerManager.UI_Popup);