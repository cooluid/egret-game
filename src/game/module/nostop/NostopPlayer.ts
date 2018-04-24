class NostopPlayer extends BaseView{
	public constructor() {
		super();
	}

	private mainPlayer: NostopMainItem;
	private initScene() {
		//创建主角色移动
		this.mainPlayer = this.mainPlayer || new NostopMainItem();
		this.mainPlayer.x = this.width / 2;
		this.mainPlayer.y = this.height /2;
	}
}