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
var JumpWin = (function (_super) {
    __extends(JumpWin, _super);
    function JumpWin() {
        var _this = _super.call(this) || this;
        _this.canPassStoneDis = [];
        _this.notPassStoneDis = [];
        _this.canPassStone = [];
        _this.notPassStone = [];
        _this.moveStone = [];
        _this.skinName = 'FrameSkin';
        return _this;
    }
    JumpWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.imgLeft2.y = this.imgLeft1.y - this.imgLeft2.height;
        this.imgRight2.y = this.imgRight1.y - this.imgRight2.height;
        this.jumpIns = Jump.ins();
        this.jumpIns.createMap(this.mapGrp);
        this.createScene();
    };
    JumpWin.prototype.createScene = function () {
        var stg = StageUtils.ins();
        this.stageW = stg.getWidth();
        this.stageH = stg.getHeight();
        var palyer = new Player();
        this.player = palyer;
        this.addChild(this.player);
        var firstStone = this.jumpIns.canPassStone[0];
        this.player.x = firstStone.x + 65;
        this.player.y = firstStone.y - 160;
        this.player.playMC(this.jumpIns.canPass[1]);
        this.addTouchEvent(this, this.playerJump);
    };
    JumpWin.prototype.playerJump = function (e) {
        // if (this.stoneDownTimer.running) {
        // 	this.stoneDownTimer.stop();
        // }
        this.canPassStoneDis = this.jumpIns.canPass;
        this.canPassStone = this.jumpIns.canPassStone;
        var downStone = this.canPassStone[0];
        var touchX = e.stageX;
        if (touchX <= this.stageW / 2) {
            this.player.playMC(1);
            if (this.canPassStoneDis[1] == 0) {
                this.jumpRight();
            }
            else {
                downStone.stoneDown();
                this.jumpDied();
            }
        }
        if (touchX > this.stageW / 2) {
            this.player.playMC(-1);
            if (this.canPassStoneDis[1] == 1) {
                this.jumpRight();
            }
            else {
                downStone.stoneDown();
                this.jumpDied();
            }
        }
    };
    JumpWin.prototype.jumpRight = function () {
        this.jumpIns.mapMove();
        var stgH = StageUtils.ins().getHeight();
        var _loop_1 = function (i) {
            var imgLeft = this_1["imgLeft" + i];
            var imgRight = this_1["imgRight" + i];
            var endY1 = imgLeft.y + 50;
            var endY2 = imgRight.y + 50;
            egret.Tween.removeTweens(imgLeft);
            egret.Tween.removeTweens(imgRight);
            var t1 = egret.Tween.get(imgLeft);
            t1.to({ y: endY1 }, 1000).call(function () {
                if (imgLeft.y >= stgH) {
                    imgLeft.y = -imgLeft.height * 2;
                }
            });
            var t2 = egret.Tween.get(imgRight);
            t2.to({ y: endY2 }, 1000).call(function () {
                if (imgRight.y >= stgH) {
                    imgRight.y = -imgRight.height * 2;
                }
            });
        };
        var this_1 = this;
        for (var i = 1; i < 3; i++) {
            _loop_1(i);
        }
    };
    JumpWin.prototype.jumpDied = function () {
        var vm = ViewManager.ins();
        this.jumpIns.reset();
        vm.close(this);
        vm.open(MainWin);
    };
    JumpWin.prototype.timeOver = function (e) {
        // this.stoneDownTimer.removeEventListener(egret.TimerEvent.TIMER, this.timeOver, this);
        console.log("time is over !");
        this.canPassStone = this.jumpIns.canPassStone;
        var downStone = this.canPassStone[0];
        downStone.stoneDown();
        this.player.playerDied(1);
    };
    return JumpWin;
}(BaseEuiView));
__reflect(JumpWin.prototype, "JumpWin");
ViewManager.ins().reg(JumpWin, LayerManager.UI_Main);
//# sourceMappingURL=JumpWin.js.map