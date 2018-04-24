import DisplayObject = egret.DisplayObject;
/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */

class DisplayUtils {

	/**
	 * 创建一个Bitmap
	 * @param resName resource.json中配置的name
	 * @returns {egret.Bitmap}
	 */
	public static createBitmap(resName: string): egret.Bitmap {
		let result: egret.Bitmap = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(resName);
		result.texture = texture;
		return result;
	}
	/**
	 * 创建一个ToggleButton
	 * @param skinName 皮肤名称
	*/
	public static createToggleButton(parent: egret.DisplayObjectContainer, skinName: string): eui.ToggleButton {
		let result: eui.ToggleButton = new eui.ToggleButton();
		result.skinName = skinName;
		parent.addChild(result);
		return result;
	}
	/**
	 * 创建一张Gui的图片
	 * @param resName
	 * @returns {eui.Image}
	 */
	public static createEuiImage(parent: egret.DisplayObjectContainer, resName: string, x: number = 0, y: number = 0): eui.Image {
		let result: eui.Image = new eui.Image();
		result.x = x;
		result.y = y;
		result.source = resName;
		parent.addChild(result);
		return result;
	}

	/**
	 * 从父级移除child
	 * @param child
	 */
	public static removeFromParent(child: egret.DisplayObject) {
		if (!child || child.parent == null)
			return;

		child.parent.removeChild(child);
	}

	/**
	 * 创建Label
	 * @param 内容
	 * @returns {egret.Label}
	 */
	public static createEuiLabelText(parent: egret.DisplayObjectContainer, value: string, x: number = 0, y: number = 0, size: number): eui.Label {
		let result: eui.Label = new eui.Label();
		result.x = x;
		result.y = y;
		result.text = value;
		result.size = size;
		result.fontFamily = "黑体";
		parent.addChild(result);
		return result;
	}

	/**
	 * 创建Label 富文本
	 * @param 内容
	 * @returns {egret.Label}
	 */
	public static createEuiLabelTextFlow(parent: egret.DisplayObjectContainer, value: string, x: number = 0, y: number = 0, size: number = 22, fontFamily: string = "黑体"): eui.Label {
		let result: eui.Label = new eui.Label();
		result.x = x;
		result.y = y;
		result.textFlow = new egret.HtmlTextParser().parser(value);
		result.size = size;
		result.fontFamily = fontFamily;
		parent.addChild(result);
		return result;
	}

	/**
	 * 创建Label
	 * @param 内容
	 * @x
	 * @p
	 * @returns {egret.Label}
	 */
	public static createEuiLabelXY(parent: egret.DisplayObjectContainer, value: string, x: number, y: number): eui.Label {
		let result: eui.Label = new eui.Label();
		result.text = value;
		result.x = x;
		result.y = y;
		parent.addChild(result);
		return result;
	}


	private static shakingList = {}

	/**
	 * 震动指定的显示对象
	 * @param target 震动的对象
	 * @param range 震动幅度 单位像素
	 * @param duration 一组震动（四方向）持续的时间
	 * @param times 震动的次数 （4方向为一次）
	 * @param condition 条件 传入判断的方法 执行返回false则不执行震动
	 */
	public static shakeIt(target: egret.DisplayObject,
		range: number,
		duration: number,
		times: number = 1,
		condition: Function = () => {
			return true
		}) {
		if (!target || times < 1 || !condition()) return;
		let isShaking = DisplayUtils.shakingList[target.hashCode];
		if (isShaking) {
			// DebugUtils.warn("shake twice");
			return;
		}
		DisplayUtils.shakingList[target.hashCode] = true;
		let shakeSet = [
			{ anchorOffsetX: 0, anchorOffsetY: -range },
			{ anchorOffsetX: -range, anchorOffsetY: 0 },
			{ anchorOffsetX: range, anchorOffsetY: 0 },
			{ anchorOffsetX: 0, anchorOffsetY: range },
			{ anchorOffsetX: 0, anchorOffsetY: 0 },
		];
		egret.Tween.removeTweens(target);
		let delay: number = duration / 5;
		egret.Tween.get(target).to(
			shakeSet[0], delay
		).to(
			shakeSet[1], delay
			).to(
			shakeSet[2], delay
			).to(
			shakeSet[3], delay
			).to(
			shakeSet[4], delay
			).call(() => {
				delete DisplayUtils.shakingList[target.hashCode];
				DisplayUtils.shakeIt(target, range, duration, --times);
			}, this
			);
	}

	/**
	 * 闪动一个对象
	 * @params  {any} obj 需要闪动的对象
	 * @params  {boolean} isFlash 是否闪动
	 * @params  {number} t 闪动间隔
	 * @returns void
	 */
	public static flashingObj(obj: any, isFlash: boolean, t: number = 300): void {
		let flash: Function = function (): void {
			if (isFlash) {
				obj.visible = true;
				let a = obj.alpha == 1 ? 0 : 1;
				egret.Tween.removeTweens(obj);
				egret.Tween.get(obj).to({ alpha: a }, t).call(flash);
			} else {
				egret.Tween.removeTweens(obj);
				obj.alpha = 1;
				obj.visible = false;
			}
		}
		flash();
	}

	/**
	 * 设置属性名字与值的显示
	 * labs: 目标修改的文本列表. 按从左到右顺序依次设置。
	 * idValues: 属性id-值 列表
	 * styles: { nameStyle, valueStyle: }
	 * showName: 显示属性名字
	 * focusValue: 将属性值设定为该值
	 */
	public static showAttribute(labs: eui.Label[], idValues: { type: number, value: number }[], styles: { nameStyle?, valueStyle?} = {}, 
								showName: boolean = true, concatChar:string = " : ", focusValue: string = null): void {
		let labCount = labs.length;
		let textFlow = [];
		let name: string;
		let nameStyle = styles.nameStyle || {};
		let valueStyle = styles.valueStyle || { "textColor": 0xffbe3f };

		let index: number;
		for (let i = 0; i < idValues.length; i++) {
			index = i % labCount;
			textFlow[index] = textFlow[index] || [];

			if (idValues[i] && (idValues[i].value != null)) {
				if(textFlow[index].length > 0){
					textFlow[index].push({ text: `\n`});
				}
				// if (showName) {
				// 	name = Lang.itemComAttrName1[idValues[i].type];
				// 	textFlow[index].push({ text: `${name}${concatChar}`, style: nameStyle });
				// }
				let value:string = `${idValues[i].value}`;
				if(focusValue != null){
					value = focusValue;
				}

				textFlow[index].push({ text: `${value}`, style: valueStyle });
			}
		}

		for (let i = 0; i < labCount; i++) {
			labs[i].textFlow = textFlow[i];
		}
	}

	public static destroyDisplayObject(target) {
		if(!target) {
			return;
		}
		if(target instanceof BaseView) {
			target.$onClose();
		}
		else if(target instanceof  egret.DisplayObjectContainer) {
			for (let i: number = 0; i < target.numChildren; i++) {
				let obj = target.getChildAt(i);
				if (obj instanceof BaseView) {
					(<BaseView>obj).$onClose();
				}
				else if (obj instanceof egret.DisplayObjectContainer) {
					arguments.callee(obj);
				}
				else if(obj["$onClose"]){
					obj["$onClose"]();
				}
			}
		}
		if(target instanceof DisplayObject) {
			DisplayUtils.removeFromParent(target);
		}

	}
}
