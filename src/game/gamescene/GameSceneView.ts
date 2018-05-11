/**游戏场景 */
class GameSceneView extends BaseEuiView {
	private map: ViewMap;
	private main: ChickRunMain;
	public constructor() {
		super();
		this.skinName = 'GameSceneViewSkin';
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.map = ViewMap.ins();
		this.map.initMap();
		this.addChild(this.map);
		this.map.height = this.height + 400;
		this.map.y = -400;
		this.main = new ChickRunMain();
		this.map.addMainEntiy(this.main);
		this.main.x = (this.width - this.main.width) / 2;
		this.main.y = this.height / 2 + 200;

		this.init();
	}

	public open(...param) {
		this.addTouchBeginEvent(this, this.pause);
		this.addTouchEndEvent(this, this.run);
	}

	private init() {
		let street = new ChickRunStreetItem();
		this.map.addEntity(street);
		egret.Tween.get(this.map).to({ y: 0 }, 1000).call(() => {
			DisplayUtils.removeFromParent(street);
			this.run();
		}, this);
	}

	public close() {

	}

	private startTime: number = 0;
	private run() {
		let timer = TimerManager.ins();
		if (!timer.isExists(this.startup, this)) {
			this.startTime = -this.pauseTime;
			for (let i = 0; i < this.map.entitys.length; i++) {
				let item = this.map.entitys[i];
				if (!item) continue;
				egret.Tween.resumeTweens(item);
			}
			timer.doTimer(20, 0, this.startup, this);
			DebugUtils.log(`启动 ${this.startTime}`);
		}
	}

	private pauseTime: number = 0;
	private pause() {
		TimerManager.ins().remove(this.startup, this);
		//这里记录还剩多久添加下一个的时间
		this.pauseTime = egret.getTimer() - this.startTime;
		DebugUtils.log(`暂停 ${this.pauseTime}`);
		for (let i = 0; i < this.map.entitys.length; i++) {
			let item = this.map.entitys[i];
			if (!item) continue;
			egret.Tween.pauseTweens(item);
		}
	}

	private startup() {
		//现在是每隔一定的时间然后就添加一个街道
		let passTime = egret.getTimer() - this.startTime;
		DebugUtils.log(egret.getTimer());
		if (passTime > 2500) {
			this.startTime = egret.getTimer();
			this.pauseTime = 0;
			let item = this.createStreet();
			this.map.addEntity(item);
			//移动
			let s = this.height - item.y;
			let v = 0.1;
			let time = s / v;
			let tt = egret.Tween.get(item);
			tt.to({ y: s }, time).call(() => {
				this.removeStreet(item);
			}, this);
			DebugUtils.log(`开始移动`);
		}
	}

	private createStreet(): ChickRunStreetItem {
		let item = ObjectPool.pop('ChickRunStreetItem');
		DebugUtils.log(`添加`);
		item.y = -400;
		return item;
	}

	private removeStreet(street) {
		DisplayUtils.removeFromParent(street);
		street.x = 0;
		street.y = 0;
		ObjectPool.push(street);
		DebugUtils.log(`移除实体`);
	}
}
ViewManager.ins().reg(GameSceneView, LayerManager.Game_Bg);