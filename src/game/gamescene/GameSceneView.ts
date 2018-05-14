/**游戏场景 */
class GameSceneView extends BaseEuiView {
	private map: ViewMap;
	private main: ChickRunMain;
	private intervalTime: number = 0;
	public constructor() {
		super();
		this.skinName = 'GameSceneViewSkin';
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.map = ViewMap.ins();
		this.map.initMap();
		this.addChild(this.map);
		this.main = new ChickRunMain();
		this.map.addMainEntiy(this.main);
		this.main.x = (this.width - this.main.width) / 2;
		this.main.y = this.height / 2 + 200;
	}

	public open(...param) {
		this.addTouchBeginEvent(this, this.pause);
		this.addTouchEndEvent(this, this.run);

		this.run();
	}

	public close() {

	}

	private startTime: number = 0;
	private run() {
		let timer = TimerManager.ins();
		if (!timer.isExists(this.startup, this)) {
			this.startTime = egret.getTimer() - this.passTime;
			for (let i = 0; i < this.map.entitys.length; i++) {
				let item = this.map.entitys[i];
				if (!item) continue;
				egret.Tween.resumeTweens(item);
			}
			timer.doTimer(20, 0, this.startup, this);
		}
	}

	private pause() {
		TimerManager.ins().remove(this.startup, this);
		for (let i = 0; i < this.map.entitys.length; i++) {
			let item = this.map.entitys[i];
			if (!item) continue;
			egret.Tween.pauseTweens(item);
		}
	}

	private passTime = 0;
	private startup() {
		//现在是每隔一定的时间然后就添加一个街道
		this.passTime = egret.getTimer() - this.startTime;
		if (this.passTime > this.intervalTime) {
			this.startTime = egret.getTimer();
			let item = this.createStreet();
			this.map.addEntity(item);
			this.intervalTime = Math.random() * 5000 + 2500;
			//移动
			let s = this.height - item.y;
			let v = 0.1;
			let time = s / v;
			let tt = egret.Tween.get(item);
			tt.to({ y: s }, time).call(() => {
				this.removeStreet(item);
			}, this);
		}
	}

	private createStreet(): ChickRunStreetItem {
		let item = ObjectPool.pop('ChickRunStreetItem');
		item.y = -400;
		return item;
	}

	private removeStreet(street) {
		DisplayUtils.removeFromParent(street);
		street.x = 0;
		street.y = 0;
		ObjectPool.push(street);
	}
}
ViewManager.ins().reg(GameSceneView, LayerManager.Game_Bg);