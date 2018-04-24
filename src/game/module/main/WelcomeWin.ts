class WelcomeWin extends BaseEuiView {
	public imgTest: eui.Image;
	public labTip: eui.Label;
	public constructor() {
		super();
		this.skinName = 'WelcomeSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		// this.imgTest.source = `${RES_MUST}cover.jpg`;

		let t = egret.Tween.get(this.labTip, { loop: true });
		t.to({ alpha: 0 }, 800).to({ alpha: 1 }, 800);

		this.addTouchEvent(this, () => {
			ViewManager.ins().close(WelcomeWin);
			ViewManager.ins().open(MainWin);
		})
	}
}
ViewManager.ins().reg(WelcomeWin, LayerManager.UI_Main);