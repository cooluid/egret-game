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
var NostopPlayerWin = (function (_super) {
    __extends(NostopPlayerWin, _super);
    function NostopPlayerWin() {
        var _this = _super.call(this) || this;
        _this.enemys = [];
        _this.isReady = false;
        _this.diffTime = 0;
        _this.pauseTimer = 0;
        _this.skinName = 'NostopPlayerWinSkin';
        return _this;
    }
    NostopPlayerWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //监听按下事件和抬起事件
        this.addTouchBeginEvent(this, this.pause);
        this.addTouchEndEvent(this, this.startReady);
        // this.addTouchEvent(this, () => {
        // 	ViewManager.ins().close(NostopPlayerWin);
        // 	ViewManager.ins().open(NostopWin);
        // });
        this.initScene();
    };
    NostopPlayerWin.prototype.initScene = function () {
        //创建主角色移动
        this.mainPlayer = this.mainPlayer || new NostopMainItem();
        this.mainPlayer.x = this.width / 2 - this.mainPlayer.width / 2;
        this.mainPlayer.y = this.height - this.mainPlayer.height - 200;
        this.addChild(this.mainPlayer);
        //创建敌人，先创建3个预览
        this.conf = GlobalConfig.getNostopConfByIndex(0);
        var enemy = this.createEnemy();
        this.grp.addChild(enemy);
        this.enemys.push(enemy);
        enemy.y = 200;
        this.startReady();
    };
    NostopPlayerWin.prototype.startReady = function () {
        // this.start();
        this.diffTime = egret.getTimer() - this.pauseTimer;
        var timer = TimerManager.ins();
        if (!timer.isExists(this.start, this)) {
            timer.doTimer(20, 0, this.start, this);
        }
    };
    NostopPlayerWin.prototype.start = function () {
        var endY = this.mainPlayer.y - this.enemys[0].height / 2 - 200;
        if (!this.isReady && this.enemys[0].y >= endY) {
            this.isReady = true;
            this.passTime = 0;
            this.pause();
            return;
        }
        var diffTime = egret.getTimer() - this.passTime - this.diffTime;
        this.diffTime = 0;
        var isAdd = false;
        if (!this.isReady && diffTime >= this.conf.interval / 8) {
            isAdd = true;
        }
        else {
            if (diffTime >= this.conf.interval / 2)
                isAdd = true;
        }
        if (isAdd) {
            var enemy = this.createEnemy();
            this.grp.addChild(enemy);
            this.enemys.push(enemy);
            DebugUtils.log("\u6DFB\u52A0\u654C\u4EBA:" + diffTime);
            this.passTime = egret.getTimer();
        }
        var speed = !this.isReady ? 6 : 3.5;
        for (var i = 0; i < this.enemys.length; i++) {
            var enemy = this.enemys[i];
            if (!enemy)
                continue;
            enemy.y += speed * 2;
            this.removeEnemy(enemy);
        }
    };
    NostopPlayerWin.prototype.pause = function () {
        this.pauseTimer = egret.getTimer();
        TimerManager.ins().remove(this.start, this);
    };
    NostopPlayerWin.prototype.createEnemy = function () {
        var enemy = ObjectPool.pop('NostopMoveItem', this.width);
        var pX = Math.random() * this.width;
        if (pX < 0)
            pX = 0;
        else if (pX > this.width - enemy.width)
            pX = this.width - enemy.width;
        enemy.x = pX;
        return enemy;
    };
    NostopPlayerWin.prototype.removeEnemy = function (enemy) {
        if (enemy.y > this.height) {
            DisplayUtils.removeFromParent(enemy);
            var index = this.enemys.indexOf(enemy);
            if (index > -1)
                this.enemys.splice(index, 1);
            enemy.x = 0;
            enemy.y = 0;
            ObjectPool.push(enemy);
            DebugUtils.log("\u79FB\u9664\u5B9E\u4F53");
        }
    };
    return NostopPlayerWin;
}(BaseEuiView));
__reflect(NostopPlayerWin.prototype, "NostopPlayerWin");
ViewManager.ins().reg(NostopPlayerWin, LayerManager.UI_Popup);
