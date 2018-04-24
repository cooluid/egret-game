var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Encrypt = (function () {
    function Encrypt() {
    }
    Encrypt.encode = function (inBuff, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        if (offset >= inBuff.length)
            return 0;
        var end = length ? offset + length : inBuff.length;
        if (end > inBuff.length)
            end = inBuff.length;
        inBuff.position = offset;
        for (var i = offset; i < end; ++i) {
            var byte = inBuff.readByte();
            byte ^= Encrypt.sKeyBuff[i % 4];
            inBuff.position--;
            inBuff.writeByte(byte);
        }
        return end - offset;
    };
    Encrypt.decode = function (inBuff, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        // 当前的加密算法和解密算法是一样的，反向操作
        return Encrypt.encode(inBuff, offset, length);
    };
    Encrypt.getCRC16 = function (bytes, length) {
        if (length === void 0) { length = 0; }
        return CRC16.update(bytes, 0, length);
    };
    Encrypt.getCRC16ByPos = function (bytes, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        return CRC16.update(bytes, offset, length);
    };
    Encrypt.getCheckKey = function () {
        var bytes = new egret.ByteArray();
        bytes.endian = egret.Endian.LITTLE_ENDIAN;
        bytes.writeUnsignedInt(Encrypt.sKey);
        var ck = CRC16.update(bytes);
        return ck;
    };
    Encrypt.getSelfSalt = function () {
        return Encrypt.sSelfSalt;
    };
    Encrypt.getTargetSalt = function () {
        return Encrypt.sTargetSalt;
    };
    Encrypt.setTargetSalt = function (value) {
        Encrypt.sTargetSalt = value;
        Encrypt.makeKey();
    };
    Encrypt.makeSalt = function () {
        var d = new Date();
        return Math.random() * d.getTime();
    };
    Encrypt.makeKey = function () {
        Encrypt.sKey = (Encrypt.sSelfSalt ^ Encrypt.sTargetSalt) + 8254;
        for (var i = 0; i < 4; ++i) {
            Encrypt.sKeyBuff[i] = (Encrypt.sKey & (0xFF << (i << 3))) >> (i << 3);
        }
    };
    Encrypt.sSelfSalt = Encrypt.makeSalt();
    Encrypt.sKeyBuff = new Array(4);
    return Encrypt;
}());
__reflect(Encrypt.prototype, "Encrypt");
