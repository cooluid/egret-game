class ChickRunStreetItem extends BaseItemRender {
	private YPOS: number[] = [120, 230];
	private allCars: ChickRunCarItem[][] = [[], [], [], []];
	private timeTest = 4500;
	private main: ChickRunMain;
	public constructor() {
		super();
		this.skinName = 'ChickRunStreetItemSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.main = ChickRunMain.ins();
		TimerManager.ins().doTimer(250, 0, this.show, this);
	}

	private show() {
		//智能车，4条道随机添加，支持变速，超车功能
		//距离一定，时间会变
		//第一条道
		let odds = Math.random();
		let cars1 = this.allCars[0];
		let lastCar = cars1 && cars1[cars1.length - 1];
		if (odds > .9 && this.checkCar(lastCar)) {
			//添加车辆
			let car = this.createCar(0);
			if (car) {
				car.x = -car.width;
				car.y = this.YPOS[0] - car.height - Math.random() * 10 - 5;
				egret.Tween.get(car, { onChange: () => { this.collision(); }, onChangeObj: this }).to({ x: 640 + car.width }, this.timeTest).call(() => {
					DisplayUtils.removeFromParent(car);
					let index = cars1.indexOf(car);
					cars1.splice(index, 1);
				}, this);
			}
		}

		//第二条道
		odds = Math.random();
		let cars2 = this.allCars[1];
		lastCar = cars2 && cars2[cars2.length - 1];
		if (odds > .9 && this.checkCar(lastCar)) {
			//添加车辆
			let car = this.createCar(1);
			if (car) {
				car.x = -car.width;
				car.y = this.YPOS[0] + Math.random() * 10 + 10;
				egret.Tween.get(car, { onChange: () => { this.collision(); }, onChangeObj: this }).to({ x: 640 + car.width }, this.timeTest).call(() => {
					DisplayUtils.removeFromParent(car);
					let index = cars2.indexOf(car);
					cars2.splice(index, 1);
				}, this);
			}
		}

		// //第三条道
		odds = Math.random();
		let cars3 = this.allCars[2];
		lastCar = cars3 && cars3[cars3.length - 1];
		if (odds > .9 && this.checkCar(lastCar, 1)) {
			//添加车辆
			let car = this.createCar(2);
			if (car) {
				car.x = this.width + car.width;
				car.y = this.YPOS[1] - car.height - Math.random() * 10;
				egret.Tween.get(car, { onChange: () => { this.collision(); }, onChangeObj: this }).to({ x: -car.width }, this.timeTest).call(() => {
					DisplayUtils.removeFromParent(car);
					let index = cars3.indexOf(car);
					cars3.splice(index, 1);
				}, this);
			}
		}

		// //第四条道
		odds = Math.random();
		let cars4 = this.allCars[3];
		lastCar = cars4 && cars4[cars4.length - 1];
		if (odds > .9 && this.checkCar(lastCar, 1)) {
			//添加车辆
			let car = this.createCar(3);
			if (car) {
				car.x = this.width + car.width;
				car.y = this.YPOS[1] + Math.random() * 10 + 10;
				egret.Tween.get(car, { onChange: () => { this.collision(); }, onChangeObj: this }).to({ x: -car.width }, this.timeTest).call(() => {
					DisplayUtils.removeFromParent(car);
					let index = cars4.indexOf(car);
					cars4.splice(index, 1);
				}, this);
			}
		}
	}

	private checkCar(car: ChickRunCarItem, type: number = 0): boolean {
		if (!car) return true;
		if (type == 1) {
			return car.x <= this.width - car.width;
		} else {
			return car.x > car.width;
		}
	}

	private collision() {
		if (!this.main.parent) return;
		for (let cars of this.allCars) {
			for (let car of cars) {
				if (!car) continue;
				if ((car.hitTestPoint(this.main.x, this.main.y))) {
					egret.Tween.removeTweens(car);
					ChickRun.ins().postCollision(car);
					DebugUtils.log(`碰撞！！！！！！！！！！！！`);
				}
			}
		}
	}

	public removeTween() {
		TimerManager.ins().removeAll(this);
		for (let cars of this.allCars) {
			for (let car of cars) {
				if (!car) continue;
				egret.Tween.removeTweens(car);
			}
		}
	}

	private createCar(road: number): ChickRunCarItem {
		let cars: ChickRunCarItem[] = this.allCars[road];
		if (cars.length > 3) return null;
		let car: ChickRunCarItem = new ChickRunCarItem();
		this.addChild(car);
		cars.push(car);
		return car;
	}
}