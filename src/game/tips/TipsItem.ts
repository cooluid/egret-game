/**
 * 提示项
 */
class TipsItem extends BaseView {
	/**
	 * 背景
	 */
	public bg: eui.Image;

	/**
	 * 文本
	 */
	public label: eui.Label;

	public _content: string;

	/**
	 * 构造函数
	 */
	public constructor() {
		super();

		this.skinName = "tips_skin";
	}

	public get content(): string {
		return this._content;
	}

	public set content(str: string) {
		this._content = str;

		this.label.textFlow = TextFlowMaker.generateTextFlow(str);

		this.bg.y = 0;
		this.bg.alpha = 1;
		// this.bg.width = this.label.width + 80;
		this.bg.bottom = 0;

		this.label.alpha = 1;
		this.label.bottom = 0;

		let tween1:egret.Tween = egret.Tween.get(this.bg);

		tween1.to({"bottom":30}, 500
		).wait(500).to({"alpha":0}, 200).call(() => {
			DisplayUtils.removeFromParent(this);
		}, this);

		let tween2: egret.Tween = egret.Tween.get(this.label);

		tween2.to({ "bottom": 30 }, 500
		).wait(500).to({ "alpha": 0 }, 200);
	}
}