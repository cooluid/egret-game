/**
 *  动画类
 * @author
 */
class MovieClip extends egret.MovieClip {

	/** 原始帧频 */
	private static originalRate: any = {};

	/** 动画数据工厂类 */
	private _mcFactory: egret.MovieClipDataFactory;

	/** 播放次数 */
	private playCount: number;
	/** 播放完的回调函数 */
	private _compFun: () => void;
	/** 是否自动删除 */
	private remove: boolean;

	private jsonData: any;
	private texture: egret.Texture;

	private time: number;
	/**倍率 ,越大越快*/
	public rate: number = 1;

	public constructor() {
		super();
		this._mcFactory = new egret.MovieClipDataFactory();
	}

	public playFile(name: string,
					playCount: number = 1,
					compFun: () => void = null,
					remove: boolean = true): void {

		this.time = egret.getTimer();

		this._compFun = compFun;
		this.playCount = playCount;
		this.remove = remove;

		TimerManager.ins().remove(this.playComp, this);

		if (this.name == name) {
			this.createBody();
			return;
		}

		this.name = name;

		this.jsonData = null;
		this.texture = null;

		RES.getResByUrl(this.name + ".json", (data) => {
			if (this.name != name || !data)
				return;
			this.jsonData = data;
			this.createBody();
		}, this, RES.ResourceItem.TYPE_JSON);
		RES.getResByUrl(this.name + ".png", (data) => {
			if (this.name != name || !data)
				return;
			this.texture = data;
			this.createBody();
		}, this, RES.ResourceItem.TYPE_IMAGE);
	}

	/**
	 * 创建主体动画
	 */
	private createBody(): void {
		if (!this.jsonData || !this.texture)
			return;

		this._mcFactory.mcDataSet = this.jsonData;
		this._mcFactory.texture = this.texture;
		let temp = this.name.split("/");
		let tempName = temp.pop();
		this.movieClipData = this._mcFactory.generateMovieClipData(tempName);

		if (!(this.name in MovieClip.originalRate)) {
			MovieClip.originalRate[this.name] = this.movieClipData.frameRate;
		}
		this.frameRate = (MovieClip.originalRate[this.name] * this.rate) >> 0;

		//从第一帧开始自动播放
		this.gotoAndPlay(1, this.playCount);

		this.visible = true;

		if (this.playCount > 0) {
			let tempTime = egret.getTimer() - this.time;
			tempTime = this.playTime * this.playCount - tempTime;
			if (tempTime > 0)
				TimerManager.ins().doTimer(tempTime, 1, this.playComp, this);
			else
				this.playComp();
		}
		//抛出内容已经改变事件
		this.dispatchEventWith(egret.Event.CHANGE);
	}

	/**
	 * 自动播放次数完成处理
	 * @param e
	 */
	private playComp(): void {
		if (this.stage && this._compFun)
			this._compFun();
		if (this.remove)
			DisplayUtils.removeFromParent(this);
	}

	/** 播放总时长(毫秒) */
	private get playTime(): number {
		if (!this.movieClipData)
			return 0;
		return 1 / this.frameRate * this.totalFrames * 1000;
	}

	public clearComFun() {
		this._compFun = null;
	}

	public set enableCache(value: boolean) {
		if(this._mcFactory) {
			this._mcFactory.enableCache = value;
		}
	}
}
