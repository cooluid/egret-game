var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameSocket = (function () {
    function GameSocket() {
        this._socketStatus = 0;
        this._lastReceiveTime = 0;
        this.pid = 0;
        /**
         * 服务器协议处理注册表
         * 格式
         * PACK_HANDLER[sysId][msgId] = [fun,funThisObj]
         */
        this.PACK_HANDLER = [];
        this._serverId = 0;
        this._user = "";
        this._pwd = "";
        this.isCrossLogin = false;
        // private big: number = 0;
        // private small: number = 0;
        // private mid: number = 0;
        this.lastPos = -1;
        egret.startTick(this.update, this);
        this.newSocket();
        this.recvPack = ObjectPool.pop(GameSocket.CLASSNAME);
        this._packets = [];
    }
    GameSocket.ins = function () {
        if (!GameSocket._ins) {
            GameSocket._ins = new GameSocket();
        }
        return GameSocket._ins;
    };
    GameSocket.prototype.newSocket = function () {
        // this.socket_ = new egret.WebSocket;
        // this.socket_.type = egret.WebSocket.TYPE_BINARY;
        // this.socket_.addEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
        // this.socket_.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        // this.socket_.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
        // this.socket_.addEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
    };
    /**
     * 发送到服务器
     * @param bytes
     */
    GameSocket.prototype.sendToServer = function (bytes) {
        this.send(bytes);
        // bytes.position = 0;
        // DebugUtils.log("发送协议:" + bytes.read);
        GameSocket.recycleByte(bytes);
    };
    GameSocket.prototype.connectError = function () {
        var p = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            p[_i] = arguments[_i];
        }
        alert("\u7F51\u7EDC\u4E2D\u65AD--" + this._host + ":" + this._port);
        window["connectError"]();
        TimerManager.ins().remove(this.reLogin, this);
        TimerManager.ins().doTimer(5000, 1, this.reLogin, this);
    };
    GameSocket.prototype.connect = function (host, port) {
        this.updateStatus(GameSocket.STATUS_CONNECTING);
        this._host = host;
        this._port = port;
        this.socket_.connect(host, port);
    };
    GameSocket.prototype.close = function () {
        if (!this.socket_)
            return;
        DebugUtils.log("close socket！ip:" + this._host + " port:" + this._port);
        this.socket_.removeEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
        this.socket_.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this.socket_.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
        this.socket_.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
        this.socket_.close();
    };
    GameSocket.prototype.send = function (message) {
        if (this._socketStatus == GameSocket.STATUS_COMMUNICATION) {
            this.sendPack(message);
            return true;
        }
        else {
            DebugUtils.log("发送数据时没和服务连接或者未进入通信状态");
            return false;
        }
    };
    GameSocket.prototype.onSocketConnected = function (e) {
        DebugUtils.log("Socket connected！ip:" + this._host + " port:" + this._port);
        TimerManager.ins().remove(this.reLogin, this);
        this.updateStatus(GameSocket.STATUS_CHECKING);
        var bytes = new GameByteArray;
        bytes.writeUnsignedInt(Encrypt.getSelfSalt());
        this.socket_.writeBytes(bytes);
        this.socket_.flush();
        if (this._onConnected) {
            this._onConnected();
        }
    };
    GameSocket.prototype.onSocketRead = function (e) {
        if (this.lastPos != -1) {
            for (var i = 0; i <= this.lastPos; i++) {
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
        var bytesCache = this.recvPack;
        // 记录接收数据包时间
        this._lastReceiveTime = egret.getTimer();
        // 将收到的字节流写入到存储接收到服务器数据包的字节流
        this.socket_.readBytes(bytesCache, bytesCache.length);
        // 截取完成数据包并派发
        var pos = 0;
        bytesCache.position = 0;
        // 处理数据包数量
        while (bytesCache.bytesAvailable > GameSocket.HEAD_SIZE) {
            // 识别并记录包起始位置
            pos = bytesCache.position;
            var tag = bytesCache.readUnsignedShort();
            if (tag != GameSocket.DEFAULT_TAG)
                continue;
            // 读取数据包buff长度
            var buffLen = bytesCache.readUnsignedShort();
            // 预留4字节
            bytesCache.position += 4;
            // 读取buffLen长度的数据
            if (buffLen > bytesCache.bytesAvailable) {
                break;
            }
            var datasize = buffLen + GameSocket.HEAD_SIZE;
            if ((2 * datasize) > bytesCache.bytesAvailable) {
                // this.big++;
                var newbuff = ObjectPool.pop(GameSocket.CLASSNAME);
                newbuff.clear();
                if (bytesCache.bytesAvailable > buffLen) {
                    var curpos = bytesCache.position;
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
                var buff = ObjectPool.pop(GameSocket.CLASSNAME);
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
    };
    GameSocket.prototype.update = function (time) {
        // 派发消息包
        for (var _i = 0, _a = this._packets; _i < _a.length; _i++) {
            var pack = _a[_i];
            this.lastPos++;
            this.processRecvPacket(pack);
            GameSocket.recycleByte(pack);
        }
        this._packets.length = 0;
        this.lastPos = -1;
        return false;
    };
    GameSocket.prototype.sendKeyToServer = function () {
        var pack = new GameByteArray;
        this.socket_.readBytes(pack);
        pack.position = 0;
        var salt = pack.readUnsignedInt();
        Encrypt.setTargetSalt(salt);
        // 发送检验码到服务器
        pack.position = 0;
        pack.writeShort(Encrypt.getCheckKey());
        this.socket_.writeBytes(pack, 0, 2);
        // 进入通信状态
        this.updateStatus(GameSocket.STATUS_COMMUNICATION);
    };
    GameSocket.prototype.onSocketClose = function (e) {
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
    };
    GameSocket.prototype.reLogin = function () {
        this.close();
        this.newSocket();
        this.login(this._user, this._pwd, this._serverId, this._host, this._port);
    };
    GameSocket.prototype.updateStatus = function (status) {
        if (this._socketStatus != status) {
            var old = this._socketStatus;
            this._socketStatus = status;
            this.onFinishCheck(status, old);
        }
    };
    GameSocket.prototype.onFinishCheck = function (newStatus, oldStatus) {
        if (newStatus == GameSocket.STATUS_COMMUNICATION) {
            DebugUtils.log("与服务器建立通信成功！ip:" + this._host + " port:" + this._port);
            if (!this.isCrossLogin) {
                this.sendCheckAccount(this._user, this._pwd);
            }
            else {
            }
        }
        else if (newStatus == GameSocket.STATUS_DISCONNECT) {
            // TODO: output error message
        }
    };
    Object.defineProperty(GameSocket.prototype, "host", {
        get: function () {
            return this._host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSocket.prototype, "port", {
        get: function () {
            return this._port;
        },
        enumerable: true,
        configurable: true
    });
    GameSocket.prototype.sendCheckAccount = function (user, pwd) {
        var bytes = this.getBytes();
        bytes.writeCmd(255, 1);
        bytes.writeInt(this._serverId);
        bytes.writeString(user);
        bytes.writeString(pwd);
        this.sendToServer(bytes);
    };
    /**跨服连接 */
    GameSocket.prototype.crossLogin = function (serverId, ip, port, key) {
        this.close();
        this.newSocket();
        this.isCrossLogin = true;
        this.crossLoginKey = key;
        this.connect(ip, port);
    };
    GameSocket.prototype.login = function (user, pwd, serverID, ip, port) {
        this.isCrossLogin = false;
        this._user = user;
        this._pwd = pwd;
        this._serverId = serverID;
        if (ip.split(":")[1] && ip.split(":")[1].length)
            port = parseInt(ip.split(":")[1]);
        if (!this.socket_.connected) {
            DebugUtils.log("connect to " + ip + " ,port: " + port);
            this.connect(ip, port);
        }
        else {
            this.sendCheckAccount(user, pwd);
        }
    };
    GameSocket.prototype.processRecvPacket = function (packet) {
        var sysId = packet.readUnsignedByte();
        var msgId = packet.readUnsignedByte();
        this.dispatch(sysId, msgId, packet);
    };
    /** 派发协议 */
    GameSocket.prototype.dispatch = function (sysId, msgId, byte) {
        // DebugUtils.log("派发协议 ::::::: ", sysId, msgId);  // lyl_log
        if (!this.PACK_HANDLER[sysId] || !this.PACK_HANDLER[sysId][msgId]) {
            // egret.log("未处理服务器协议：" + sysId + "-" + msgId);
            DebugUtils.log("未处理服务器协议：" + sysId + "-" + msgId);
            return;
        }
        var arr = this.PACK_HANDLER[sysId][msgId];
        arr[0].call(arr[1], byte);
    };
    /**
     * 回收bytes对象
     * @param byte
     */
    GameSocket.recycleByte = function (byte) {
        ObjectPool.push(byte);
    };
    /**
     * 从对象池获取一个bytes对象
     */
    GameSocket.prototype.getBytes = function () {
        var pack = ObjectPool.pop(GameSocket.CLASSNAME);
        pack.clear();
        pack.writeShort(GameSocket.DEFAULT_TAG);
        pack.writeShort(0);
        pack.writeShort(0);
        pack.writeShort(GameSocket.DEFAULT_CRC_KEY);
        pack.writeUnsignedInt(this.pid++);
        return pack;
    };
    /**
     * 注册一个服务器发送到客户端的消息处理
     */
    GameSocket.prototype.registerSTCFunc = function (sysId, msgId, fun, sysClass) {
        if (!this.PACK_HANDLER[sysId]) {
            this.PACK_HANDLER[sysId] = [];
        }
        else if (this.PACK_HANDLER[sysId][msgId]) {
            DebugUtils.error("\u91CD\u590D\u6CE8\u518C\u534F\u8BAE\u63A5\u53E3" + sysId + "-" + msgId);
            return;
        }
        this.PACK_HANDLER[sysId][msgId] = [fun, sysClass];
    };
    GameSocket.prototype.setOnClose = function (ex, obj) {
        this._onClosed = ex.bind(obj);
    };
    GameSocket.prototype.setOnConnected = function (ex, obj) {
        this._onConnected = ex.bind(obj);
    };
    GameSocket.prototype.sendPack = function (pack) {
        // 初始化包头
        var headsize = GameSocket.HEAD_SIZE;
        pack.position = 2;
        pack.writeShort(pack.length - headsize);
        // 计算数据CRC
        var msgCK = Encrypt.getCRC16ByPos(pack, headsize);
        pack.position = 4;
        pack.writeShort(msgCK);
        // 计算包头CRC
        var headerCRC = Encrypt.getCRC16(pack, headsize);
        // 将计算出来的包头CRC替换默认包头CRC
        pack.position = 6;
        pack.writeShort(headerCRC);
        // 对数据CRC和包头CRC进行加密
        Encrypt.encode(pack, 4, 4);
        this.socket_.writeBytes(pack);
    };
    GameSocket.DEFAULT_TAG = 0xCCEE; // 约定的信息头
    GameSocket.DEFAULT_CRC_KEY = 0x765D; // 默认包头校验
    GameSocket.HEAD_SIZE = 8; // 最小通信封包字节长度
    /** 连接中 */
    GameSocket.STATUS_CONNECTING = 1;
    /** 检验中 */
    GameSocket.STATUS_CHECKING = 2;
    /** 连接生效 */
    GameSocket.STATUS_COMMUNICATION = 3;
    /** 关闭连接 */
    GameSocket.STATUS_DISCONNECT = 4;
    GameSocket.CLASSNAME = egret.getQualifiedClassName(GameByteArray);
    return GameSocket;
}());
__reflect(GameSocket.prototype, "GameSocket");
//# sourceMappingURL=GameSocket.js.map