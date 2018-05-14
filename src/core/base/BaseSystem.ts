class BaseSystem extends BaseClass {
	public sysId: number;

	public constructor() {
		super();

		//必须在init前
		// let cls = egret.getDefinitionByName(egret.getQualifiedClassName(this));
		// MessageCenter.compile(cls);

		this.observe(GameApp.postLoginInit, this.initLogin);
	}

	public regNetMsg(msgId: number, fun: (...params: any[]) => void): void {
		GameSocket.ins().registerSTCFunc(this.sysId, msgId, fun, this);
	}

	/**
	 * 游戏登录初始化
	 */
	protected initLogin(): void {

	}

	/**
	 * 从对象池获取一个bytes对象
	 */
	private getGameByteArray(): GameByteArray {
		return GameSocket.ins().getBytes();
	}

	public getBytes(msgId: number): GameByteArray {
		let bytes = this.getGameByteArray();
		bytes.writeCmd(this.sysId, msgId);
		return bytes;
	}

	public sendBaseProto(msgId: number) {
		let bytes = this.getGameByteArray();
		bytes.writeCmd(this.sysId, msgId);
		this.sendToServer(bytes);
	}

	/**
	 * 发送到服务器
	 * @param bytes
	 */
	public sendToServer(bytes: GameByteArray): void {
		GameSocket.ins().sendToServer(bytes);
	}

	public observe(func: Function, myFunc: Function) {
		MessageCenter.addListener(func, myFunc, this);
	}
	public removeObserveOne(func: any, myFunc: Function) {
		MessageCenter.ins().removeListener(func.funcallname, myFunc, this);
	}

	public removeObserve() {
		MessageCenter.ins().removeAll(this);
	}

	protected associated(fun: Function, ...funs: Function[]): void {
		for (let i of funs) {
			this.observe(i, fun);
		}
	}
}
