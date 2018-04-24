class JumpWin extends BaseEuiView {
	private stageW: number;
	private stageH: number;
	private canPassStoneDis: number[] = [];
	private notPassStoneDis: number[] = [];
	private canPassStone: Stone[] = [];
	private notPassStone: Stone[] = [];
	private moveStone: Stone[] = [];
	private player: Player;
	private jumpIns: Jump;
	public mapGrp: eui.Group;
	public imgLeft1: eui.Image;
	public imgLeft2: eui.Image;
	public imgRight1: eui.Image;
	public imgRight2: eui.Image;
	public Grp: eui.Group;

	public constructor() {
		super();
		this.skinName = 'FrameSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.imgLeft2.y = this.imgLeft1.y - this.imgLeft2.height;
		this.imgRight2.y = this.imgRight1.y - this.imgRight2.height;

		this.jumpIns = Jump.ins();
		this.jumpIns.createMap(this.mapGrp);
		this.createScene();
	}

	private createScene(): void {
		let stg = StageUtils.ins();
		this.stageW = stg.getWidth();
		this.stageH = stg.getHeight();

		let palyer: Player = new Player();
		this.player = palyer;
		this.addChild(this.player);
		let firstStone = this.jumpIns.canPassStone[0];
		this.player.x = firstStone.x + 65;
		this.player.y = firstStone.y - 160;
		this.player.playMC(this.jumpIns.canPass[1]);
		this.addTouchEvent(this, this.playerJump);
	}

	private playerJump(e: egret.TouchEvent) {
		// if (this.stoneDownTimer.running) {
		// 	this.stoneDownTimer.stop();
		// }
		this.canPassStoneDis = this.jumpIns.canPass;
		this.canPassStone = this.jumpIns.canPassStone;
		let downStone: Stone = this.canPassStone[0];
		let touchX: number = e.stageX;

		if (touchX <= this.stageW / 2) {
			this.player.playMC(1);
			if (this.canPassStoneDis[1] == 0) {
				this.jumpRight();
			} else {
				downStone.stoneDown();
				this.jumpDied();
			}
		}
		if (touchX > this.stageW / 2) {
			this.player.playMC(-1);
			if (this.canPassStoneDis[1] == 1) {
				this.jumpRight();
			} else {
				downStone.stoneDown();
				this.jumpDied();
			}
		}
	}

	private jumpRight() {
		this.jumpIns.mapMove();
		let stgH = StageUtils.ins().getHeight();
		for (let i = 1; i < 3; i++) {
			let imgLeft: eui.Image = this[`imgLeft${i}`];
			let imgRight: eui.Image = this[`imgRight${i}`];
			let endY1 = imgLeft.y + 50;
			let endY2 = imgRight.y + 50;
			egret.Tween.removeTweens(imgLeft);
			egret.Tween.removeTweens(imgRight);
			let t1 = egret.Tween.get(imgLeft);
			t1.to({ y: endY1 }, 1000).call(() => {
				if (imgLeft.y >= stgH) {
					imgLeft.y = -imgLeft.height * 2;
				}
			});
			let t2 = egret.Tween.get(imgRight);
			t2.to({ y: endY2 }, 1000).call(() => {
				if (imgRight.y >= stgH) {
					imgRight.y = -imgRight.height * 2;
				}
			});
		}
	}

	private jumpDied() {
		let vm = ViewManager.ins();
		this.jumpIns.reset();
		vm.close(this);
		vm.open(MainWin);
	}

	private timeOver(e: egret.TimerEvent) {
		// this.stoneDownTimer.removeEventListener(egret.TimerEvent.TIMER, this.timeOver, this);
		console.log("time is over !");

		this.canPassStone = this.jumpIns.canPassStone;
		let downStone: Stone = this.canPassStone[0];
		downStone.stoneDown();
		this.player.playerDied(1);
	}
}
ViewManager.ins().reg(JumpWin, LayerManager.UI_Main);