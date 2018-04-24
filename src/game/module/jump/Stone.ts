class Stone extends BaseView {
	private res: string;
	private icon: eui.Image;
	public constructor(res: string) {
		super();
		this.skinName = 'StoneSkin';
		this.res = res;
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.createStone();
	}

	public createStone(): void {
		if (this.res == '0') return;
		this.icon.source = `img_${this.res}`;
	}

	public stoneDown(): void {
		let t = egret.Tween.get(this);
		let endY = this.y + 300;
		let self = this;
		t.to({ y: endY }, 300).call(() => {
			ObjectPool.push(self);
			DisplayUtils.removeFromParent(self);
		}, this);
	}
}