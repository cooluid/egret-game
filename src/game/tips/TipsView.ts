/**
 * 提示视图
 */
class TipsView extends BaseEuiView {
	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.touchEnabled = false;
		this.touchChildren = false;
	}

	private tipsList: TipsItem[] = [];

	 public showTips(str: string): void {
		let tipsItem: TipsItem = ObjectPool.pop("TipsItem");

		//解析掉落物的文本信息
 		if(str.indexOf("获得[<#c") != -1){
			let tStr1: string[] = str.split("[<");
			str = tStr1[0] + "<font color=";
			let tStr2: string[] = tStr1[1].split("#");
			str += tStr2[1].slice(1) + ">";
			let tStr3: string[] = tStr2[2].split("/");
			str += tStr3[0] + "</font> ";
			let tStr4: string[] = tStr3[1].split("]");
			str += tStr4[1];
		}

		tipsItem.content = str;
		tipsItem.right = 0;

		this.addChild(tipsItem);

		this.tipsList.unshift(tipsItem);

		tipsItem.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTips, this);

		let size: number = this.tipsList.length;
		for (let i: number = size - 1; i >= 0; i--) {
			egret.Tween.removeTweens(this.tipsList[i]);

			let tween: egret.Tween = egret.Tween.get(this.tipsList[i]);

			tween.to({"bottom": 150 + i * 30}, 100)
				.to({"bottom": 150 + (i + 1) * 30}, 4000);
		}
	}

	private removeTips(e: egret.Event): void {
		let index: number = this.tipsList.indexOf(e.currentTarget);

		this.tipsList.splice(index, 1);

		egret.Tween.removeTweens(e.currentTarget);
		e.currentTarget.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTips, this);

		ObjectPool.push(e.currentTarget); //放入对象池
	}
}

ViewManager.ins().reg(TipsView, LayerManager.UI_Tips);