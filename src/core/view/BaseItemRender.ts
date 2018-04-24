class BaseItemRender extends BaseView implements eui.IItemRenderer {

	private _data: any = null;
	private _selected: boolean = false;
	public itemIndex: number = -1;
	private touchCaptured: boolean = false;

	public constructor() {
		super();
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
	}

	/**
	 * 淡入效果
	 * showIndex 淡入个数
	 */
	public fadeIn(showIndex: number = -1): void {
		let childIndex = this.parent.getChildIndex(this);
		//超过的不播放淡入效果
		if (showIndex != -1 && showIndex < childIndex) {
			return;
		}
		for (let i = 0; i < this.numChildren; i++) {
			let child = this.getChildAt(i);
			if (!child.visible) continue;
			let tx: number = child.x;
			child.x = tx - this.width;
			let tw: egret.Tween = egret.Tween.get(child);
			tw.wait(200 * this.parent.getChildIndex(this)).to({ x: tx }, 200);
		}
	}
	protected onTouchCancle(event: egret.TouchEvent): void {
		this.touchCaptured = false;
		let stage = event.$currentTarget;
		stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
		stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
		this.invalidateState();
		this.invalidateDisplayList();
	}

	protected onTouchBegin(event: egret.TouchEvent): void {
		this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
		this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
		this.touchCaptured = true;
		this.invalidateState();
		event.updateAfterEvent();
	}

	private onStageTouchEnd(event: egret.Event): void {
		let stage = event.$currentTarget;
		stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
		stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
		this.touchCaptured = false;
		this.invalidateState();
	}

	protected getCurrentState(): string {
		let state = "up";
		if (this.touchCaptured) {
			state = "down";
		}
		if (this._selected) {
			let selectedState = state + "AndSelected";
			let skin = this.skin;
			if (skin && skin.hasState(selectedState)) {
				return selectedState;
			}
			return state == "disabled" ? "disabled" : "down";
		}
		return state;
	}

	public get data(): any {
		return this._data;
	}

	public set data(value: any) {
		this._data = value;
		eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
		this.dataChanged();
	}

	protected dataChanged(): void {

	}

	public get selected(): boolean {
		return this._selected;
	}

	public set selected(value: boolean) {
		if (this._selected == value)
			return;
		this._selected = value;
		this.invalidateState();
	}
}
eui.registerBindable(BaseItemRender.prototype, "data");