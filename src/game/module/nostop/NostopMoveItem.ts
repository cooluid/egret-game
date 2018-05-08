class NostopMoveItem extends BaseView {
	private mapWidth = 0;
	public constructor(_width: number) {
		super();
		this.skinName = 'NostopMoveItemSkin';
		this.mapWidth = _width;
	}

	protected childrenCreated(): void {
		this.start();
	}

	private start() {
		// egret.Tween.removeTweens(this);
		let t = egret.Tween.get(this);
		let endX = 0;
		if (this.x > (this.mapWidth / 2 - this.width / 2)) {
			if (this.x != this.mapWidth - this.width) {
				endX = this.mapWidth - this.width;
			} else {
				endX = 0;
			}
		} else {
			if (this.x != 0) {
				endX = 0;
			} else {
				endX = this.mapWidth - this.width;
			}
		}

		t.to({ x: endX }, 2000).call(() => {
			this.start();
		}, this);
	}
}