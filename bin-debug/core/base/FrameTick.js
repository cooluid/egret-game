var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FrameTick = (function () {
    function FrameTick() {
        this.list = [];
    }
    FrameTick.prototype.tick = function (idx) {
        this.list[idx] = TimerManager.ins().getFrameId();
    };
    FrameTick.prototype.isTick = function (idx) {
        return this.list[idx] == TimerManager.ins().getFrameId();
    };
    FrameTick.prototype.checkAndTick = function (idx) {
        if (this.isTick(idx)) {
            return true;
        }
        else {
            this.tick(idx);
            return false;
        }
    };
    return FrameTick;
}());
__reflect(FrameTick.prototype, "FrameTick");
//# sourceMappingURL=FrameTick.js.map