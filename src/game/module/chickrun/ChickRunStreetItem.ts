class ChickRunStreetItem extends BaseItemRender {
	private YPOS: number[] = [120, 230];
	private allCars: ChickRunCarItem[][] = [[], [], [], []];
	public constructor() {
		super();
		this.skinName = 'ChickRunStreetItemSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		TimerManager.ins().doTimer(20, 0, this.show, this);
	}

	private show() {
		//智能车，4条道随机添加，支持变速，超车功能
		//第一条道
		let odds = Math.random();
		if (odds > .7) {
			//添加车辆
			let car = this.createCar(0);
			if (car) {
				car.x = -car.width - Math.random() * 50;
				car.y = this.YPOS[0] - car.height - Math.random() * 10;
				egret.Tween.get(car).to({ x: 640 + car.width }, Math.random() * 1000 + 500).call(() => {
					DisplayUtils.removeFromParent(car);
					let cars = this.allCars[0];
					let index = cars.indexOf(car);
					cars.splice(index, 1);
				}, this);
			}
		}

		//第二条道
		// odds = Math.random();
		// if (odds > .7) {
		// 	//添加车辆
		// 	let car = this.createCar(1);
		// 	if (car) {
		// 		car.x = -car.width - Math.random() * 50;
		// 		car.y = this.YPOS[0] + car.height + Math.random() * 10;
		// 		egret.Tween.get(car).to({ x: 640 + car.width }, Math.random() * 1000 + 500).call(() => {
		// 			DisplayUtils.removeFromParent(car);
		// 			let cars = this.allCars[1];
		// 			let index = cars.indexOf(car);
		// 			cars.splice(index, 1);
		// 		}, this);
		// 	}
		// }

		// //第三条道
		// odds = Math.random();
		// if (odds > .7) {
		// 	//添加车辆
		// 	let car = this.createCar(2);
		// 	if (car) {
		// 		car.x = -car.width - Math.random() * 50;
		// 		car.y = this.YPOS[1] - car.height - Math.random() * 10;
		// 		egret.Tween.get(car).to({ x: 640 + car.width }, Math.random() * 1000 + 500).call(() => {
		// 			DisplayUtils.removeFromParent(car);
		// 			let cars = this.allCars[2];
		// 			let index = cars.indexOf(car);
		// 			cars.splice(index, 1);
		// 		}, this);
		// 	}
		// }

		// //第四条道
		// odds = Math.random();
		// if (odds > .7) {
		// 	//添加车辆
		// 	let car = this.createCar(3);
		// 	if (car) {
		// 		car.x = -car.width - Math.random() * 50;
		// 		car.y = this.YPOS[1] + car.height + Math.random() * 10;
		// 		egret.Tween.get(car).to({ x: 640 + car.width }, Math.random() * 1000 + 500).call(() => {
		// 			DisplayUtils.removeFromParent(car);
		// 			let cars = this.allCars[3];
		// 			let index = cars.indexOf(car);
		// 			cars.splice(index, 1);
		// 		}, this);
		// 	}
		// }
	}

	private createCar(road: number): ChickRunCarItem {
		let cars: ChickRunCarItem[] = this.allCars[road];
		if (cars.length > 4) return null;
		let car: ChickRunCarItem = new ChickRunCarItem();
		this.addChild(car);
		cars.push(car);
		return car;
	}
}