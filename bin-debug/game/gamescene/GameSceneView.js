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
/**游戏场景 */
var GameSceneView = (function (_super) {
    __extends(GameSceneView, _super);
    function GameSceneView() {
        var _this = _super.call(this) || this;
        _this.intervalTime = 0;
        _this.interval = 2500;
        _this.downv = 0.2;
        _this.startTime = 0;
        _this.passTime = 0;
        _this.score = 0;
        _this.skinName = 'GameSceneViewSkin';
        return _this;
    }
    GameSceneView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.map = ViewMap.ins();
        this.map.initMap();
        this.mapGrp.addChild(this.map);
        this.main = ChickRunMain.ins();
        this.map.addMainEntiy(this.main);
        this.main.x = (this.width) / 2;
        this.main.y = this.height / 2 + 200;
    };
    GameSceneView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.addTouchBeginEvent(this, this.pause);
        this.addTouchEndEvent(this, this.run);
        this.observe(ChickRun.ins().postCollision, this.collision);
        this.observe(ChickRun.ins().postChangeConf, this.changeConf);
        this.run();
        this.saveScore();
    };
    GameSceneView.prototype.saveScore = function () {
        var _this = this;
        //每隔1s积分一次
        egret.Tween.get(this.scoreValueTF).wait(1000).call(function () {
            _this.score += 1;
            _this.scoreValueTF.text = _this.score.toString();
            if (_this.score % 20 == 0 && _this.score != 0) {
                ChickRun.ins().postChangeConf();
            }
            _this.saveScore();
        }, this);
    };
    GameSceneView.prototype.changeConf = function () {
        this.interval -= 50;
        this.downv += .05;
    };
    GameSceneView.prototype.close = function () {
        this.map.clearMap();
    };
    GameSceneView.prototype.collision = function (car) {
        this.pause();
        ViewManager.ins().open(ChickRunOverWin);
        for (var i = 0; i < this.map.entitys.length; i++) {
            var street = this.map.entitys[i];
            if (!street)
                continue;
            street.removeTween();
        }
    };
    GameSceneView.prototype.run = function () {
        var timer = TimerManager.ins();
        if (!timer.isExists(this.startup, this)) {
            this.startTime = egret.getTimer() - this.passTime;
            for (var i = 0; i < this.map.entitys.length; i++) {
                var item = this.map.entitys[i];
                if (!item)
                    continue;
                egret.Tween.resumeTweens(item);
            }
            timer.doTimer(20, 0, this.startup, this);
            egret.Tween.resumeTweens(this.scoreValueTF);
            egret.Tween.resumeTweens(this.main);
        }
    };
    GameSceneView.prototype.pause = function () {
        TimerManager.ins().remove(this.startup, this);
        for (var i = 0; i < this.map.entitys.length; i++) {
            var item = this.map.entitys[i];
            if (!item)
                continue;
            egret.Tween.pauseTweens(item);
        }
        egret.Tween.pauseTweens(this.scoreValueTF);
        egret.Tween.pauseTweens(this.main);
    };
    GameSceneView.prototype.startup = function () {
        var _this = this;
        //现在是每隔一定的时间然后就添加一个街道
        this.passTime = egret.getTimer() - this.startTime;
        if (this.passTime > this.intervalTime) {
            this.startTime = egret.getTimer();
            var item_1 = this.createStreet();
            this.map.addEntity(item_1);
            this.intervalTime = this.interval;
            //移动
            var s = this.height - item_1.y;
            var time = s / this.downv;
            var tt = egret.Tween.get(item_1);
            tt.to({ y: s }, time).call(function () {
                _this.removeStreet(item_1);
            }, this);
        }
    };
    GameSceneView.prototype.createStreet = function () {
        var item = ObjectPool.pop('ChickRunStreetItem');
        item.y = -640;
        return item;
    };
    GameSceneView.prototype.removeStreet = function (street) {
        DisplayUtils.removeFromParent(street);
        street.x = 0;
        street.y = 0;
        ObjectPool.push(street);
        var index = this.map.entitys.indexOf(street);
        if (index > -1) {
            this.map.entitys.splice(index, 1);
        }
    };
    return GameSceneView;
}(BaseEuiView));
__reflect(GameSceneView.prototype, "GameSceneView");
ViewManager.ins().reg(GameSceneView, LayerManager.Game_Bg);
//# sourceMappingURL=GameSceneView.js.map