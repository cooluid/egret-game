class NostopPlayerWin extends BaseEuiView {
	public grp: eui.Group;

	public constructor() {
		super();
		this.skinName = 'NostopPlayerWinSkin';
	}

	protected childrenCreated() {
		super.childrenCreated();
		//监听按下事件和抬起事件
		this.addTouchBeginEvent(this, this.pause);
		this.addTouchEndEvent(this, this.startReady);
		// this.addTouchEvent(this, () => {
		// 	ViewManager.ins().close(NostopPlayerWin);
		// 	ViewManager.ins().open(NostopWin);
		// });
		this.initScene();
	}

	private mainPlayer: NostopMainItem;
	private enemy: NostopMoveItem[];
	private conf: NostopConf;
	private passTime: number;
	private enemys: NostopMoveItem[] = [];
	private initScene() {
		//创建主角色移动
		this.mainPlayer = this.mainPlayer || new NostopMainItem();
		this.mainPlayer.x = this.width / 2 - this.mainPlayer.width / 2;
		this.mainPlayer.y = this.height - this.mainPlayer.height - 200;
		this.addChild(this.mainPlayer);

		//创建敌人，先创建3个预览
		this.conf = GlobalConfig.getNostopConfByIndex(0);
		let enemy = this.createEnemy();
		this.grp.addChild(enemy);
		this.enemys.push(enemy);
		enemy.y = 200;
		this.startReady();
	}

	private isReady = false;
	private diffTime = 0;
	private startReady() {
		// this.start();
		this.diffTime = egret.getTimer() - this.pauseTimer;
		let timer = TimerManager.ins();
		if (!timer.isExists(this.start, this)) {
			timer.doTimer(20, 0, this.start, this);
		}
	}

	private start() {
		let endY = this.mainPlayer.y - this.enemys[0].height / 2 - 200;
		if (!this.isReady && this.enemys[0].y >= endY) {
			this.isReady = true;
			this.passTime = 0;
			this.pause();
			return;
		}

		let diffTime = egret.getTimer() - this.passTime - this.diffTime;
		this.diffTime = 0;
		let isAdd = false;
		if (!this.isReady && diffTime >= this.conf.interval / 8) {
			isAdd = true;
		} else {
			if (diffTime >= this.conf.interval / 2) isAdd = true;
		}
		if (isAdd) {
			let enemy = this.createEnemy();
			this.grp.addChild(enemy);
			this.enemys.push(enemy);
			DebugUtils.log(`添加敌人:${diffTime}`);
			this.passTime = egret.getTimer();
		}
		let speed = !this.isReady ? 6 : 3.5;
		for (let i = 0; i < this.enemys.length; i++) {
			let enemy = this.enemys[i];
			if (!enemy) continue;
			enemy.y += speed * 2;
			this.removeEnemy(enemy);
		}
	}

	private pauseTimer = 0;
	private pause() {
		this.pauseTimer = egret.getTimer();
		TimerManager.ins().remove(this.start, this);
	}

	private createEnemy(): NostopMoveItem {
		let enemy = ObjectPool.pop('NostopMoveItem', this.width);
		let pX = Math.random() * this.width;
		if (pX < 0) pX = 0;
		else if (pX > this.width - enemy.width) pX = this.width - enemy.width;
		enemy.x = pX;
		return enemy;
	}

	private removeEnemy(enemy: NostopMoveItem): void {
		if (enemy.y > this.height) {
			DisplayUtils.removeFromParent(enemy);
			let index = this.enemys.indexOf(enemy);
			if (index > -1) this.enemys.splice(index, 1);
			enemy.x = 0;
			enemy.y = 0;
			ObjectPool.push(enemy);
			DebugUtils.log(`移除实体`);
		}
	}
}
ViewManager.ins().reg(NostopPlayerWin, LayerManager.UI_Popup);