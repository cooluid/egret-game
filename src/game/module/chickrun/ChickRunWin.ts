/**绝地跑鸡主窗口 */
class ChickRunWin extends BaseEuiView {
	public btnStart: eui.Label
	public constructor() {
		super();
		this.skinName = 'ChickRunWinSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.addTouchEvent(this.btnStart, () => {
			let vms = ViewManager.ins();
			vms.close(this);
			vms.open(GameSceneView);
		})
	}
}
ViewManager.ins().reg(ChickRunWin, LayerManager.UI_Main);