/**游戏场景 */
class GameSceneView extends BaseEuiView {
	private map: ViewMap;
	private main: ChickRunMain;
	private intervalTime: number = 0;
	public scoreTF: eui.Label;
	public mapGrp: eui.Group;
	public scoreValueTF: eui.Label;
	public constructor() {
		super();
		this.skinName = 'GameSceneViewSkin';
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.map = ViewMap.ins();
		this.map.initMap();
		this.mapGrp.addChild(this.map);
		this.main = ChickRunMain.ins();
		this.map.addMainEntiy(this.main);
		this.main.x = (this.width) / 2;
		this.main.y = this.height / 2 + 200;
	}

	public open(...param) {
		this.addTouchBeginEvent(this, this.pause);
		this.addTouchEndEvent(this, this.run);
		this.observe(ChickRun.ins().postCollision, this.collision);
		this.observe(ChickRun.ins().postChangeConf, this.changeConf);

		this.run();

		this.saveScore();
	}

	private saveScore() {
		//每隔1s积分一次
		egret.Tween.get(this.scoreValueTF).wait(1000).call(() => {
			this.score += 1;
			this.scoreValueTF.text = this.score.toString();
			if (this.score % 20 == 0 && this.score != 0) {
				ChickRun.ins().postChangeConf();
			}
			this.saveScore();
		}, this);
	}

	private interval: number = 2500;
	private downv: number = 0.2;
	private changeConf() {
		this.interval -= 50;
		this.downv += .05;
	}

	public close() {
		this.map.clearMap();
	}

	private collision(car: ChickRunCarItem) {
		this.pause();
		ViewManager.ins().open(ChickRunOverWin);
		for (let i = 0; i < this.map.entitys.length; i++) {
			let street = this.map.entitys[i] as ChickRunStreetItem;
			if (!street) continue;
			street.removeTween();
		}
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
			egret.Tween.resumeTweens(this.scoreValueTF);
			egret.Tween.resumeTweens(this.main);
		}
	}

	private pause() {
		TimerManager.ins().remove(this.startup, this);
		for (let i = 0; i < this.map.entitys.length; i++) {
			let item = this.map.entitys[i];
			if (!item) continue;
			egret.Tween.pauseTweens(item);
		}
		egret.Tween.pauseTweens(this.scoreValueTF);
		egret.Tween.pauseTweens(this.main);
	}

	private passTime = 0;
	private score: number = 0;
	private startup() {
		//现在是每隔一定的时间然后就添加一个街道
		this.passTime = egret.getTimer() - this.startTime;
		if (this.passTime > this.intervalTime) {
			this.startTime = egret.getTimer();
			let item = this.createStreet();
			this.map.addEntity(item);
			this.intervalTime = this.interval;
			//移动
			let s = this.height - item.y;
			let time = s / this.downv;
			let tt = egret.Tween.get(item);
			tt.to({ y: s }, time).call(() => {
				this.removeStreet(item);
			}, this);
		}
	}

	private createStreet(): ChickRunStreetItem {
		let item = ObjectPool.pop('ChickRunStreetItem');
		item.y = -640;
		return item;
	}

	private removeStreet(street) {
		DisplayUtils.removeFromParent(street);
		street.x = 0;
		street.y = 0;
		ObjectPool.push(street);
		let index = this.map.entitys.indexOf(street);
		if (index > -1) {
			this.map.entitys.splice(index, 1);
		}
	}
}
ViewManager.ins().reg(GameSceneView, LayerManager.Game_Bg);