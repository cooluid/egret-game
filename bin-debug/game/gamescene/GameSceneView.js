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
        _this.startTime = 0;
        _this.pauseTime = 0;
        _this.skinName = 'GameSceneViewSkin';
        return _this;
    }
    GameSceneView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.map = ViewMap.ins();
        this.map.initMap();
        this.addChild(this.map);
        this.map.height = this.height + 400;
        this.map.y = -400;
        this.main = new ChickRunMain();
        this.map.addMainEntiy(this.main);
        this.main.x = (this.width - this.main.width) / 2;
        this.main.y = this.height / 2 + 200;
        this.init();
    };
    GameSceneView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.addTouchBeginEvent(this, this.pause);
        this.addTouchEndEvent(this, this.run);
    };
    GameSceneView.prototype.init = function () {
        var _this = this;
        var street = new ChickRunStreetItem();
        this.map.addEntity(street);
        egret.Tween.get(this.map).to({ y: 0 }, 1000).call(function () {
            DisplayUtils.removeFromParent(street);
            _this.run();
        }, this);
    };
    GameSceneView.prototype.close = function () {
    };
    GameSceneView.prototype.run = function () {
        var timer = TimerManager.ins();
        if (!timer.isExists(this.startup, this)) {
            this.startTime = -this.pauseTime;
            for (var i = 0; i < this.map.entitys.length; i++) {
                var item = this.map.entitys[i];
                if (!item)
                    continue;
                egret.Tween.resumeTweens(item);
            }
            timer.doTimer(20, 0, this.startup, this);
            DebugUtils.log("\u542F\u52A8 " + this.startTime);
        }
    };
    GameSceneView.prototype.pause = function () {
        TimerManager.ins().remove(this.startup, this);
        //这里记录还剩多久添加下一个的时间
        this.pauseTime = egret.getTimer() - this.startTime;
        DebugUtils.log("\u6682\u505C " + this.pauseTime);
        for (var i = 0; i < this.map.entitys.length; i++) {
            var item = this.map.entitys[i];
            if (!item)
                continue;
            egret.Tween.pauseTweens(item);
        }
    };
    GameSceneView.prototype.startup = function () {
        var _this = this;
        //现在是每隔一定的时间然后就添加一个街道
        var passTime = egret.getTimer() - this.startTime;
        DebugUtils.log(egret.getTimer());
        if (passTime > 2500) {
            this.startTime = egret.getTimer();
            this.pauseTime = 0;
            var item_1 = this.createStreet();
            this.map.addEntity(item_1);
            //移动
            var s = this.height - item_1.y;
            var v = 0.1;
            var time = s / v;
            var tt = egret.Tween.get(item_1);
            tt.to({ y: s }, time).call(function () {
                _this.removeStreet(item_1);
            }, this);
            DebugUtils.log("\u5F00\u59CB\u79FB\u52A8");
        }
    };
    GameSceneView.prototype.createStreet = function () {
        var item = ObjectPool.pop('ChickRunStreetItem');
        DebugUtils.log("\u6DFB\u52A0");
        item.y = -400;
        return item;
    };
    GameSceneView.prototype.removeStreet = function (street) {
        DisplayUtils.removeFromParent(street);
        street.x = 0;
        street.y = 0;
        ObjectPool.push(street);
        DebugUtils.log("\u79FB\u9664\u5B9E\u4F53");
    };
    return GameSceneView;
}(BaseEuiView));
__reflect(GameSceneView.prototype, "GameSceneView");
ViewManager.ins().reg(GameSceneView, LayerManager.Game_Bg);
//# sourceMappingURL=GameSceneView.js.map