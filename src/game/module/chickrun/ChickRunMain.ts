class ChickRunMain extends BaseView {
	public grp: eui.Group;
	public constructor() {
		super();
		this.skinName = 'ChickRunMainSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.grp.anchorOffsetX = this.grp.anchorOffsetY = 42;
		this.show();
	}

	private show() {
		egret.Tween.get(this, { loop: true }).to({ rotation: -20 }, 150).to({ rotation: 0 }, 150);
	}

	private static _instance: ChickRunMain;
	public static ins(): ChickRunMain {
		if (!this._instance) this._instance = new ChickRunMain();
		return this._instance;
	}
}