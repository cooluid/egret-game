class Jump extends BaseSystem {
	public canPass: number[] = [];
	private noPass: number[] = [];
	public canPassStone: Stone[] = [];
	private notPassStone: Stone[] = [];
	private static stoneNum = 10;
	public constructor() {
		super();
	}

	public static ins(): Jump {
		return super.ins() as Jump;
	}

	public initGame(): void {
		//打开主界面
		ViewManager.ins().open(JumpWin);
	}

	public reset(): void {
		this.canPass = [];
		this.noPass = [];
		this.canPassStone = [];
		this.notPassStone = [];
	}

	//添加障碍物状态
	private obstacles() {
		let i: number = Math.round(Math.random() * 10);
		let state: number = 0;
		if (i <= 5) {
			state = 0;
		} else if (i > 5 && i <= 7) {
			state = 1;
		} else if (i > 7 && i <= 9) {
			state = 2;
		} else if (i > 9 && i <= 10) {
			state = 3;
		}
		this.noPass.push(state);
	}

	private mapGrp: eui.Group;
	public createMap(map: eui.Group) {
		this.mapGrp = map;
		for (let i = 0; i < Jump.stoneNum; i++) {
			this.addStoneAndDis();
		}
	}

	public mapMove() {
		this.removeStoneAndDis();
		let stoneW: number = this.canPassStone[0].width;
		let stoneH: number = this.canPassStone[0].height;
		let dis: number = this.canPass[0] ? -1 : 1;
		let endX = this.mapGrp.x + dis * (stoneW / 2);
		let endY = this.mapGrp.y + (stoneH - 26);
		let t = egret.Tween.get(this.mapGrp);
		let self = this;
		t.to({ x: endX, y: endY }, 200).call(
			function () {
				self.addStoneAndDis();
			}
		);
	}

	private addStoneAndDis() {
		let passStone: Stone = ObjectPool.pop('Stone', 0);
		this.mapGrp.addChildAt(passStone, 0);
		if (this.canPassStone[0] == null) {
			let stg = StageUtils.ins();
			passStone.x = stg.getWidth() - passStone.width >> 1;
			passStone.y = stg.getHeight() - (200 + passStone.height);
			this.canPass.push(-1);
		} else {
			let i: number = Math.round(Math.random() * 1);
			this.canPass.push(i);
			let dis: number = this.canPass[this.canPass.length - 1] ? 1 : -1;
			passStone.x = this.canPassStone[this.canPassStone.length - 1].x + dis * (passStone.width / 2);
			passStone.y = this.canPassStone[this.canPassStone.length - 1].y - (passStone.height - 26);
		}
		this.canPassStone.push(passStone);

		if (this.canPass.length >= 2) {
			this.obstacles();
			for (let j = 1; j <= this.noPass[this.noPass.length - 1]; j++) {
				let e: Stone = ObjectPool.pop('Stone', Math.floor(Math.random() * 4 + 1));
				this.mapGrp.addChildAt(e, 0);
				let dist: number = this.canPass[this.canPass.length - 1] ? -1 : 1;
				e.x = this.canPassStone[this.canPassStone.length - 2].x + dist * (passStone.width / 2) * (j);
				e.y = this.canPassStone[this.canPassStone.length - 2].y - (passStone.height - 26) * (j);
				this.notPassStone.push(e);
			}
		}
	}

	private removeStoneAndDis() {
		let stone: Stone = this.canPassStone[0];
		let stoneY: number = stone.y;
		this.canPassStone.splice(0, 1);
		this.canPass.splice(0, 1);
		this.noPass.splice(0, 1);
		stone.stoneDown();

		for (let i = 0; i < this.notPassStone.length; i++) {
			if (this.notPassStone[i].y >= stoneY) {
				let s: Stone = this.notPassStone[i];
				this.notPassStone.splice(i, 1);
				s.stoneDown();
			}
		}

	}
}
class StoneData {
	public index: number = 0;
	public state: number = 0;
}
namespace GameSystem {
	export let jump = Jump.ins.bind(Jump);
}