class GameSocket {
	private socket_;

	public static DEFAULT_TAG: number = 0xCCEE; // 约定的信息头
	public static DEFAULT_CRC_KEY: number = 0x765D; // 默认包头校验
	public static HEAD_SIZE: number = 8; // 最小通信封包字节长度

	/** 连接中 */
	public static STATUS_CONNECTING: number = 1;
	/** 检验中 */
	public static STATUS_CHECKING: number = 2;
	/** 连接生效 */
	public static STATUS_COMMUNICATION: number = 3;
	/** 关闭连接 */
	public static STATUS_DISCONNECT: number = 4;

	public _host: string;
	public _port: number;
	private _socketStatus: number = 0;
	private _packets: GameByteArray[];
	private _lastReceiveTime: number = 0;
	private recvPack: GameByteArray;
	private pid: number = 0;

	private _onClosed: Function;
	private _onConnected: Function;

	/**
	 * 服务器协议处理注册表
	 * 格式
	 * PACK_HANDLER[sysId][msgId] = [fun,funThisObj]
	 */
	public PACK_HANDLER: any[] = [];

	public static CLASSNAME: string =
	egret.getQualifiedClassName(GameByteArray);

	public static _ins: GameSocket;

	public _serverId: number = 0;
	public _user: string = "";
	public _pwd: string = "";

	public isCrossLogin: boolean = false;
	public crossLoginKey: string;

	public static ins(): GameSocket {
		if (!GameSocket._ins) {
			GameSocket._ins = new GameSocket();
		}
		return GameSocket._ins;
	}

	public constructor() {
		egret.startTick(this.update, this);
		this.newSocket();
		this.recvPack = ObjectPool.pop(GameSocket.CLASSNAME);
		this._packets = [];
	}

	public newSocket(): void {
		// this.socket_ = new egret.WebSocket;
		// this.socket_.type = egret.WebSocket.TYPE_BINARY;
		// this.socket_.addEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
		// this.socket_.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		// this.socket_.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
		// this.socket_.addEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
	}

	/**
	 * 发送到服务器
	 * @param bytes
	 */
	public sendToServer(bytes: GameByteArray): void {
		this.send(bytes);
		// bytes.position = 0;
		// DebugUtils.log("发送协议:" + bytes.read);
		GameSocket.recycleByte(bytes);
	}

	private connectError(...p: any[]): void {
		alert(`网络中断--${this._host}:${this._port}`);
		window["connectError"]();

		TimerManager.ins().remove(this.reLogin, this);
		TimerManager.ins().doTimer(5000, 1, this.reLogin, this);
	}

	public connect(host: string, port: number): void {
		this.updateStatus(GameSocket.STATUS_CONNECTING);
		this._host = host;
		this._port = port;
		this.socket_.connect(host, port);
	}

	public close(): void {
		if (!this.socket_)
			return;
		DebugUtils.log("close socket！ip:" + this._host + " port:" + this._port);
		this.socket_.removeEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
		this.socket_.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		this.socket_.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
		this.socket_.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
		this.socket_.close();
	}

	public send(message: egret.ByteArray): boolean {
		if (this._socketStatus == GameSocket.STATUS_COMMUNICATION) {
			this.sendPack(message);
			return true;
		} else {
			DebugUtils.log("发送数据时没和服务连接或者未进入通信状态");
			return false;
		}
	}

	private onSocketConnected(e: egret.Event): void {
		DebugUtils.log("Socket connected！ip:" + this._host + " port:" + this._port);
		TimerManager.ins().remove(this.reLogin, this);

		this.updateStatus(GameSocket.STATUS_CHECKING);

		let bytes = new GameByteArray;
		bytes.writeUnsignedInt(Encrypt.getSelfSalt());
		this.socket_.writeBytes(bytes);
		this.socket_.flush();

		if (this._onConnected) {
			this._onConnected();
		}
	}

	// private big: number = 0;
	// private small: number = 0;
	// private mid: number = 0;
	private lastPos: number = -1;

	private onSocketRead(e: egret.ProgressEvent): void {
		if (this.lastPos != -1) {
			for (let i = 0; i <= this.lastPos; i++) {
				GameSocket.recycleByte(this._packets[i]);
			}
			this._packets.splice(0, this.lastPos + 1);
			this.lastPos = -1;
		}

		// 检验阶段
		if (this._socketStatus < GameSocket.STATUS_COMMUNICATION) {
			this.sendKeyToServer();
			return;
		}

		let bytesCache = this.recvPack;
		// 记录接收数据包时间
		this._lastReceiveTime = egret.getTimer();

		// 将收到的字节流写入到存储接收到服务器数据包的字节流
		this.socket_.readBytes(bytesCache, bytesCache.length);

		// 截取完成数据包并派发
		let pos: number = 0;
		bytesCache.position = 0;

		// 处理数据包数量
		while (bytesCache.bytesAvailable > GameSocket.HEAD_SIZE) {
			// 识别并记录包起始位置
			pos = bytesCache.position;
			let tag = bytesCache.readUnsignedShort();
			if (tag != GameSocket.DEFAULT_TAG) continue;

			// 读取数据包buff长度
			let buffLen = bytesCache.readUnsignedShort();
			// 预留4字节
			bytesCache.position += 4;
			// 读取buffLen长度的数据
			if (buffLen > bytesCache.bytesAvailable) {
				break;
			}

			let datasize = buffLen + GameSocket.HEAD_SIZE;
			if ((2 * datasize) > bytesCache.bytesAvailable) {
				// this.big++;
				let newbuff = ObjectPool.pop(GameSocket.CLASSNAME);
				newbuff.clear();

				if (bytesCache.bytesAvailable > buffLen) {
					let curpos = bytesCache.position;
					bytesCache.position += buffLen;
					bytesCache.readBytes(newbuff, 0, bytesCache.bytesAvailable);
					bytesCache.position = curpos;

					// this.mid++;
				}
				this._packets.push(bytesCache);

				bytesCache = this.recvPack = newbuff;
				bytesCache.position = 0;
			}
			else {
				// this.small++;
				// 读取包的数据
				let buff = ObjectPool.pop(GameSocket.CLASSNAME);
				buff.clear();

				bytesCache.readBytes(buff, 0, buffLen);

				// 收集完成的消息包，然后一次性派发，这样也便于外部模块处理异常
				this._packets.push(buff);
			}
			// 记录截取位置，即下一个包的起始位置
			pos = bytesCache.position;
			// DebugUtils.log(`big:${this.big},small:${this.small}, mid:${this.mid}`);
		}

		// 输出处理消息包的数量
		// DebugUtils.log("收包时间：" + this._lastReceiveTime, "包数量：" + numPackets);
		if (pos) {
			bytesCache.position = pos;
			bytesCache.readBytes(bytesCache);
			bytesCache.length -= pos;
		}
	}

	private update(time: number) {
		// 派发消息包
		for (let pack of this._packets) {
			this.lastPos++;
			this.processRecvPacket(pack);
			GameSocket.recycleByte(pack);
		}
		this._packets.length = 0;
		this.lastPos = -1;
		return false;
	}

	private sendKeyToServer() {
		let pack = new GameByteArray;
		this.socket_.readBytes(pack);

		pack.position = 0;
		let salt: number = pack.readUnsignedInt();
		Encrypt.setTargetSalt(salt);

		// 发送检验码到服务器
		pack.position = 0;
		pack.writeShort(Encrypt.getCheckKey());
		this.socket_.writeBytes(pack, 0, 2);

		// 进入通信状态
		this.updateStatus(GameSocket.STATUS_COMMUNICATION);
	}

	private onSocketClose(e: egret.Event): void {
		DebugUtils.log("与服务器的连接断开了！ip:" + this._host + " port:" + this._port);
		this.updateStatus(GameSocket.STATUS_DISCONNECT);
		if (this._onClosed) {
			this._onClosed();
		}
		// TimerManager.ins().remove(this.reLogin, this);
		// TimerManager.ins().doTimer(5000, 1, this.reLogin, this);
		// ConfirmWin.show(`提示`, `您已经与服务器断开连接。\n是否确认重连？`, (type) => {
		// 	if(type == 0) {
		// 		this.reLogin();
		// 	}
		// }, this, [`确定`], 0, -1, 0.5);
	}

	public reLogin() {
		this.close();

		this.newSocket();
		this.login(this._user, this._pwd,
			this._serverId, this._host, this._port);
	}

	private updateStatus(status: number): void {
		if (this._socketStatus != status) {
			let old: number = this._socketStatus;
			this._socketStatus = status;
			this.onFinishCheck(status, old);
		}
	}

	public onFinishCheck(newStatus: number, oldStatus: number): void {
		if (newStatus == GameSocket.STATUS_COMMUNICATION) {
			DebugUtils.log("与服务器建立通信成功！ip:" + this._host + " port:" + this._port);
			if(!this.isCrossLogin) {
				this.sendCheckAccount(this._user, this._pwd);
			}
			else{
			}
		} else if (newStatus == GameSocket.STATUS_DISCONNECT) {
			// TODO: output error message
		}
	}

	public get host(): string {
		return this._host;
	}

	public get port(): number {
		return this._port;
	}


	public sendCheckAccount(user: string, pwd: string): void {
		let bytes = this.getBytes();
		bytes.writeCmd(255, 1);
		bytes.writeInt(this._serverId);
		bytes.writeString(user);
		bytes.writeString(pwd);
		this.sendToServer(bytes);
	}

	/**跨服连接 */
	public crossLogin(serverId: number, ip: string, port: number, key: string){
		this.close();
		this.newSocket();
		this.isCrossLogin = true;
		this.crossLoginKey = key;
		this.connect(ip, port);
	}

	public login(user: string, pwd: string, serverID: number, ip: string, port: number): void {
		this.isCrossLogin = false;
		this._user = user;
		this._pwd = pwd;
		this._serverId = serverID;
		if (ip.split(`:`)[1] && ip.split(`:`)[1].length)
			port = parseInt(ip.split(`:`)[1]);

		if (!this.socket_.connected) {
			DebugUtils.log(`connect to ${ip} ,port: ${port}`);
			this.connect(ip, port);
		} else {
			this.sendCheckAccount(user, pwd);
		}
	}

	protected processRecvPacket(packet: GameByteArray): void {
		let sysId: number = packet.readUnsignedByte();
		let msgId: number = packet.readUnsignedByte();
		this.dispatch(sysId, msgId, packet);
	}

	/** 派发协议 */
	private dispatch(sysId: number, msgId: number, byte: GameByteArray): void {
		// DebugUtils.log("派发协议 ::::::: ", sysId, msgId);  // lyl_log
		if (!this.PACK_HANDLER[sysId] || !this.PACK_HANDLER[sysId][msgId]) {
			// egret.log("未处理服务器协议：" + sysId + "-" + msgId);
			DebugUtils.log("未处理服务器协议：" + sysId + "-" + msgId);
			return;
		}
		let arr: any[] = this.PACK_HANDLER[sysId][msgId];

		arr[0].call(arr[1], byte);
	}

	/**
	 * 回收bytes对象
	 * @param byte
	 */
	public static recycleByte(byte: GameByteArray): void {
		ObjectPool.push(byte);
	}

	/**
	 * 从对象池获取一个bytes对象
	 */
	public getBytes(): GameByteArray {
		let pack = ObjectPool.pop(GameSocket.CLASSNAME);
		pack.clear();

		pack.writeShort(GameSocket.DEFAULT_TAG);
		pack.writeShort(0);
		pack.writeShort(0);
		pack.writeShort(GameSocket.DEFAULT_CRC_KEY);

		pack.writeUnsignedInt(this.pid++);

		return pack;
	}

	/**
	 * 注册一个服务器发送到客户端的消息处理
	 */
	public registerSTCFunc(sysId: number, msgId: number,
							fun: (...params: any[]) => void,
						   sysClass: any): void {
		if (!this.PACK_HANDLER[sysId]) {
			this.PACK_HANDLER[sysId] = [];
		}
		else if (this.PACK_HANDLER[sysId][msgId]) {
			DebugUtils.error(`重复注册协议接口${sysId}-${msgId}`);
			return;
		}

		this.PACK_HANDLER[sysId][msgId] = [fun, sysClass];
	}

	public setOnClose(ex: Function, obj: any) {
		this._onClosed = ex.bind(obj);
	}

	public setOnConnected(ex: Function, obj: any) {
		this._onConnected = ex.bind(obj);
	}

	public sendPack(pack: egret.ByteArray) {
		// 初始化包头
		let headsize = GameSocket.HEAD_SIZE;

		pack.position = 2;
		pack.writeShort(pack.length - headsize);

		// 计算数据CRC
		let msgCK: number = Encrypt.getCRC16ByPos(pack, headsize);
		pack.position = 4;
		pack.writeShort(msgCK);

		// 计算包头CRC
		let headerCRC: number = Encrypt.getCRC16(pack, headsize);
		// 将计算出来的包头CRC替换默认包头CRC
		pack.position = 6;
		pack.writeShort(headerCRC);

		// 对数据CRC和包头CRC进行加密
		Encrypt.encode(pack, 4, 4);

		this.socket_.writeBytes(pack);
	}
}

