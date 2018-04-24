class Player extends BaseView {
	private mc: MovieClip;
	public mcGrp: eui.Group;
	public constructor() {
		super();
		this.skinName = 'PlayerSkin';
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.mc = new MovieClip();
		this.mcGrp.addChild(this.mc);
		this.mc.anchorOffsetX = this.width / 2;
		this.mc.anchorOffsetY = this.height / 2;
	}

	public playMC(dir: number): void {
		this.mc.scaleX = dir;
		this.mc.playFile(`${RES_DIR_EFF}robotJump`, 1, null, false);
	}

	public playerDied(n: number): void {

	}
}