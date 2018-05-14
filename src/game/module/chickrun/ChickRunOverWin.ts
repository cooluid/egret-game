class ChickRunOverWin extends BaseEuiView {
	public constructor() {
		super();
		this.skinName = 'ChickRunOverWinSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.addTouchEvent(this, () => {
			let vm = ViewManager.ins();
			vm.close(this);
			vm.close(GameSceneView);
			vm.open(ChickRunWin);
		})
	}
}
ViewManager.ins().reg(ChickRunOverWin, LayerManager.UI_Popup);