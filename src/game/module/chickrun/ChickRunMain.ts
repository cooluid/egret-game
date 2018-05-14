class ChickRunMain extends BaseView {
	public constructor() {
		super();
		this.skinName = 'ChickRunMainSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	private static _instance: ChickRunMain;
	public static ins(): ChickRunMain {
		if (!this._instance) this._instance = new ChickRunMain();
		return this._instance;
	}
}