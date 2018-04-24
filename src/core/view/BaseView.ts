//显示基类,用于增加一些显示相关的共有函数
class BaseView extends eui.Component {
	private event = [];

	public constructor() {
		super();
	}

	public observe(func: Function, myfunc: Function, callobj: any = undefined) {
		MessageCenter.addListener(func, myfunc, this, callobj);
	}

	public removeObserveOne(func:any, myfunc:Function){
		MessageCenter.ins().removeListener(func.funcallname, myfunc, this);
	}

	public removeObserve() {
		MessageCenter.ins().removeAll(this);
	}

	public addTouchEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.TOUCH_TAP, obj, func);
	}

	public addTouchEndEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.TOUCH_END, obj, func);
	}

	public addChangeEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.CHANGE, obj, func);
	}

	public addEvent(ev: string, obj: any, func: Function) {
		obj.addEventListener(ev, func, this);
		this.event.push([ev, func, obj]);
	}

	public removeEvent(ev: string, obj: any, func: Function) {
		obj.removeEventListener(ev, func, this);
	}

	public removeTouchEvent(obj: any, func: Function) {
		obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
	}

	private removeEvents() {
		for (let ev of this.event) {
			ev[2].removeEventListener(ev[0], ev[1], this);
		}
	}

	public $onClose() {

		let fun = function (tar: egret.DisplayObjectContainer) {
			for (let i: number = 0; i < tar.numChildren; i++) {
				let obj = tar.getChildAt(i);
				if (obj instanceof BaseView) {
					(<BaseView>obj).$onClose();
				}
				else if (obj instanceof egret.DisplayObjectContainer) {
					// arguments.callee(obj);
				}
				else if(obj["$onClose"]){
					obj["$onClose"]();
				}
			}
		};

		fun(this);

		this.removeEvents();
		this.removeObserve();
	}

	setSkinPart(partName: string, instance: any): void {
		let oldInstance = this.skin[partName];
		super.setSkinPart(partName, instance);
		// if (!instance || !this.skin[partName] || this.skin[partName] == instance)
		// 	return;
		if(instance && oldInstance && oldInstance != instance) {
			for (let i = 0; i < BaseView.replaceKeys.length; i++) {
				let key = BaseView.replaceKeys[i];
				instance[key] = oldInstance[key];
			}
			if(instance instanceof eui.BitmapLabel){
				instance["font"] = oldInstance["$font"];
			}
			let p = oldInstance.parent;
			if(p){
				let pIndex = p.getChildIndex(oldInstance);
				p.addChildAt(instance, pIndex);
			}
		}
		if(oldInstance != instance) {
			this.skin[partName] = instance;
			DisplayUtils.destroyDisplayObject(oldInstance);
		}
	}

	// setSkinPart(partName: string, instance: any): void {
	// 	super.setSkinPart(partName, instance);

	// 	if (!instance || !this.skin[partName] || this.skin[partName] == instance)
	// 		return;
	// 	let p = this.skin[partName].parent;
	// 	let pIndex = p.getChildIndex(this.skin[partName]);
	// 	DisplayUtils.removeFromParent(this.skin[partName]);
	// 	for (let i = 0; i < BaseView.replaceKeys.length; i++) {
	// 		let key = BaseView.replaceKeys[i];
	// 		instance[key] = this.skin[partName][key];
	// 	}
	// 	if(instance instanceof eui.BitmapLabel){
	// 		instance["font"] = this.skin[partName]["$font"];
	// 	}
	// 	this.skin[partName] = instance;
	// 	p.addChildAt(instance, pIndex);
	// }

	public static replaceKeys: string[] = ["x", "y", "alpha", "anchorOffsetX", "anchorOffsetY", "blendMode", "bottom",
		"cacheAsBitmap", "currentState", "enabled", "filters", "height", "horizontalCenter", "hostComponentKey",
		"includeInLayout", "left", "mask", "matrix", "maxHeight", "maxWidth", "minHeight", "minWidth", "name",
		"percentHeight", "percentWidth", "right", "rotation", "scaleX", "scaleY", "scrollRect", "skewX", "skewY",
		"skinName", "top", "touchChildren", "touchEnabled", "verticalCenter", "visible", "width"];
}