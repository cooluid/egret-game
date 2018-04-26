var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameByteArray = (function (_super) {
    __extends(GameByteArray, _super);
    function GameByteArray() {
        var _this = _super.call(this) || this;
        _this.endian = egret.Endian.LITTLE_ENDIAN;
        return _this;
    }
    GameByteArray.prototype.readString = function () {
        var s = this.readUTF();
        this.position++;
        return s;
    };
    // 对于协议中要读取8字节Int64的字段，分两种情况：如果不需要加减等运算的字段，比如handle，
    // 用readDouble函数读取，如果是需要运算的数字类型，比如金币等，用readNumber读取
    // 返回uint64类型的readInt64以后不要使用了,已经使用的地方慢慢修改过来
    GameByteArray.prototype.readNumber = function () {
        var i64 = new uint64(this);
        var str = i64.toString();
        return +str;
    };
    // 对应readnumer
    GameByteArray.prototype.writeNumber = function (val) {
        var i64 = uint64.stringToUint64(val.toString());
        this.writeInt64(i64);
    };
    GameByteArray.prototype.writeInt64 = function (bigInt) {
        this.writeUnsignedInt(bigInt._lowUint);
        this.writeUnsignedInt(bigInt._highUint);
    };
    GameByteArray.prototype.writeString = function (value) {
        this.writeUTF(value);
        this.writeByte(0);
    };
    GameByteArray.prototype.writeCmd = function (id, subId) {
        this.writeByte(id);
        this.writeByte(subId);
    };
    return GameByteArray;
}(egret.ByteArray));
__reflect(GameByteArray.prototype, "GameByteArray");
//# sourceMappingURL=GameByteArray.js.map