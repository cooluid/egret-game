class ChickRunCarItem extends BaseView {
	public constructor() {
		super();
	}

	protected createChildren() {
		super.createChildren();
		//test
		let shape = new egret.Shape();
		shape.graphics.beginFill(0x0000ff);
		shape.graphics.drawRect(0, 0, 80, 45);
		shape.graphics.endFill();
		this.addChild(shape);
	}
}