/**
 * Tips接口.使用Tips通过这里
 */
class TipsControl extends BaseClass {
	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	/**
	 * 获取类的单例
	 */
	public static ins(): TipsControl {
		return super.ins() as TipsControl;
	}

	/**
	 * 显示提示
	 */
	public showTips(str: string): void {
		let view: TipsView = ViewManager.ins().open(TipsView) as TipsView;

		DelayOptManager.ins().addDelayOptFunction(view, view.showTips, str);
	}
}