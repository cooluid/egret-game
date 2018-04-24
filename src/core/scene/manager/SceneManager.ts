class SceneManager extends BaseClass {
	private _currScene: BaseScene;

	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	public static ins(): SceneManager {
		return super.ins() as SceneManager;
	}

	/**
	 * 清空处理
	 */
	public clear(): void {
		let nowScene: BaseScene = this._currScene;
		if (nowScene) {
			nowScene.onExit();
			this._currScene = undefined;
		}
	}

	/**
	 * 切换场景
	 * @param key 场景唯一标识
	 */
	public runScene(SceneClass: any): void {
		if (SceneClass == null) {
			Debug.log("runScene:scene is null");
			return;
		}

		let oldScene: BaseScene = this._currScene;
		if (oldScene) {
			oldScene.onExit();
			oldScene = undefined;
		}
		let s: BaseScene = new SceneClass();
		s.onEnter();
		this._currScene = s;
	}

	/**
	 * 获取当前Scene
	 * @returns {number}
	 */
	public getCurrScene(): BaseScene {
		return this._currScene;
	}
}
