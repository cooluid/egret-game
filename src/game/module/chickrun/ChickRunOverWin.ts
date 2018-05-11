class ChickRunOverWin extends BaseEuiView {
	public constructor() {
		super();
		this.skinName = 'ChickRunOverWin';
	}
}
ViewManager.ins().reg(ChickRunOverWin, LayerManager.UI_Popup);