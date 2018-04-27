class NostopPlayerWin extends BaseEuiView {
	public grp: eui.Group;

	public constructor() {
		super();
		this.skinName = 'NostopPlayerWinSkin';
	}

	protected childrenCreated() {
		super.childrenCreated();
		//监听按下事件和抬起事件
		this.addTouchBeginEvent(this, this.start);
		this.addTouchEndEvent(this, this.pause);
		this.addTouchEvent(this, () => {
			ViewManager.ins().close(NostopPlayerWin);
			ViewManager.ins().open(NostopWin);
		});
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
		this.mainPlayer.x = this.width / 2;
		this.mainPlayer.y = this.height - this.mainPlayer.height - 300;
		this.addChild(this.mainPlayer);

		//创建敌人，先创建3个预览
		this.conf = GlobalConfig.getNostopConfByIndex(0);
		let enemy = this.createEnemy();
		this.grp.addChild(enemy);
		this.enemys.push(enemy);
		enemy.y = 200;
		this.passTime = egret.getTimer();
		TimerManager.ins().doTimer(20, 0, this.startReady, this);
	}

	private startReady() {
		TimerManager.ins().remove(this.startReady, this);
		this.start(false);
	}

	private start(isReady: boolean = true) {
		let endY = this.height / 2;
		if (!isReady && this.enemys[0].y >= endY) {
			isReady = true;
			this.pause();
			return;
		}

		let diffTime = egret.getTimer() - this.passTime;
		if (diffTime >= this.conf.interval / 5) {
			let enemy = this.createEnemy();
			this.grp.addChild(enemy);
			this.enemys.push(enemy);
			this.passTime = egret.getTimer();
			DebugUtils.log(`添加敌人`);
		}
		let speed = !isReady ? 6 : 1;
		for (let i = 0; i < this.enemys.length; i++) {
			let enemy = this.enemys[i];
			if (!enemy) continue;
			// enemy.y += speed * 2;
			egret.Tween.removeTweens(enemy);
			let t = egret.Tween.get(enemy, {
				onChange: () => {
					if (enemy.y >= 300 && this.enemys.length < 4) this.start(false);
				}, onChangeObj: this
			});
			t.to({ y: 500 }, 1000).call(() => {
				egret.Tween.removeAllTweens();
			}, this);
		}
	}

	private pause() {
		DebugUtils.log('抬起事件');
		TimerManager.ins().remove(this.startReady, this);
	}

	private createEnemy(): NostopMoveItem {
		let enemy = ObjectPool.pop('NostopMoveItem');
		enemy.x = Math.random() * this.width;
		return enemy;
	}
}
ViewManager.ins().reg(NostopPlayerWin, LayerManager.UI_Popup);