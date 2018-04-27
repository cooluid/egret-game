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
        _this.skinName = 'NostopPlayerWinSkin';
        return _this;
    }
    NostopPlayerWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //监听按下事件和抬起事件
        this.addTouchBeginEvent(this, this.start);
        this.addTouchEndEvent(this, this.pause);
        this.addTouchEvent(this, function () {
            ViewManager.ins().close(NostopPlayerWin);
            ViewManager.ins().open(NostopWin);
        });
        this.initScene();
    };
    NostopPlayerWin.prototype.initScene = function () {
        //创建主角色移动
        this.mainPlayer = this.mainPlayer || new NostopMainItem();
        this.mainPlayer.x = this.width / 2;
        this.mainPlayer.y = this.height - this.mainPlayer.height - 300;
        this.addChild(this.mainPlayer);
        //创建敌人，先创建3个预览
        this.conf = GlobalConfig.getNostopConfByIndex(0);
        var enemy = this.createEnemy();
        this.grp.addChild(enemy);
        this.enemys.push(enemy);
        enemy.y = 200;
        this.passTime = egret.getTimer();
        TimerManager.ins().doTimer(20, 0, this.startReady, this);
    };
    NostopPlayerWin.prototype.startReady = function () {
        TimerManager.ins().remove(this.startReady, this);
        this.start(false);
    };
    NostopPlayerWin.prototype.start = function (isReady) {
        var _this = this;
        if (isReady === void 0) { isReady = true; }
        var endY = this.height / 2;
        if (!isReady && this.enemys[0].y >= endY) {
            isReady = true;
            this.pause();
            return;
        }
        var diffTime = egret.getTimer() - this.passTime;
        if (diffTime >= this.conf.interval / 5) {
            var enemy = this.createEnemy();
            this.grp.addChild(enemy);
            this.enemys.push(enemy);
            this.passTime = egret.getTimer();
            DebugUtils.log("\u6DFB\u52A0\u654C\u4EBA");
        }
        var speed = !isReady ? 6 : 1;
        var _loop_1 = function (i) {
            var enemy = this_1.enemys[i];
            if (!enemy)
                return "continue";
            // enemy.y += speed * 2;
            egret.Tween.removeTweens(enemy);
            var t = egret.Tween.get(enemy, {
                onChange: function () {
                    if (enemy.y >= 300 && _this.enemys.length < 4)
                        _this.start(false);
                }, onChangeObj: this_1
            });
            t.to({ y: 500 }, 1000).call(function () {
                egret.Tween.removeAllTweens();
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < this.enemys.length; i++) {
            _loop_1(i);
        }
    };
    NostopPlayerWin.prototype.pause = function () {
        DebugUtils.log('抬起事件');
        TimerManager.ins().remove(this.startReady, this);
    };
    NostopPlayerWin.prototype.createEnemy = function () {
        var enemy = ObjectPool.pop('NostopMoveItem');
        enemy.x = Math.random() * this.width;
        return enemy;
    };
    return NostopPlayerWin;
}(BaseEuiView));
__reflect(NostopPlayerWin.prototype, "NostopPlayerWin");
ViewManager.ins().reg(NostopPlayerWin, LayerManager.UI_Popup);
//# sourceMappingURL=NostopPlayerWin.js.map