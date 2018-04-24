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
var Jump = (function (_super) {
    __extends(Jump, _super);
    function Jump() {
        var _this = _super.call(this) || this;
        _this.canPass = [];
        _this.noPass = [];
        _this.canPassStone = [];
        _this.notPassStone = [];
        return _this;
    }
    Jump.ins = function () {
        return _super.ins.call(this);
    };
    Jump.prototype.initGame = function () {
        //打开主界面
        ViewManager.ins().open(JumpWin);
    };
    Jump.prototype.reset = function () {
        this.canPass = [];
        this.noPass = [];
        this.canPassStone = [];
        this.notPassStone = [];
    };
    //添加障碍物状态
    Jump.prototype.obstacles = function () {
        var i = Math.round(Math.random() * 10);
        var state = 0;
        if (i <= 5) {
            state = 0;
        }
        else if (i > 5 && i <= 7) {
            state = 1;
        }
        else if (i > 7 && i <= 9) {
            state = 2;
        }
        else if (i > 9 && i <= 10) {
            state = 3;
        }
        this.noPass.push(state);
    };
    Jump.prototype.createMap = function (map) {
        this.mapGrp = map;
        for (var i = 0; i < Jump.stoneNum; i++) {
            this.addStoneAndDis();
        }
    };
    Jump.prototype.mapMove = function () {
        this.removeStoneAndDis();
        var stoneW = this.canPassStone[0].width;
        var stoneH = this.canPassStone[0].height;
        var dis = this.canPass[0] ? -1 : 1;
        var endX = this.mapGrp.x + dis * (stoneW / 2);
        var endY = this.mapGrp.y + (stoneH - 26);
        var t = egret.Tween.get(this.mapGrp);
        var self = this;
        t.to({ x: endX, y: endY }, 200).call(function () {
            self.addStoneAndDis();
        });
    };
    Jump.prototype.addStoneAndDis = function () {
        var passStone = ObjectPool.pop('Stone', 0);
        this.mapGrp.addChildAt(passStone, 0);
        if (this.canPassStone[0] == null) {
            var stg = StageUtils.ins();
            passStone.x = stg.getWidth() - passStone.width >> 1;
            passStone.y = stg.getHeight() - (200 + passStone.height);
            this.canPass.push(-1);
        }
        else {
            var i = Math.round(Math.random() * 1);
            this.canPass.push(i);
            var dis = this.canPass[this.canPass.length - 1] ? 1 : -1;
            passStone.x = this.canPassStone[this.canPassStone.length - 1].x + dis * (passStone.width / 2);
            passStone.y = this.canPassStone[this.canPassStone.length - 1].y - (passStone.height - 26);
        }
        this.canPassStone.push(passStone);
        if (this.canPass.length >= 2) {
            this.obstacles();
            for (var j = 1; j <= this.noPass[this.noPass.length - 1]; j++) {
                var e = ObjectPool.pop('Stone', Math.floor(Math.random() * 4 + 1));
                this.mapGrp.addChildAt(e, 0);
                var dist = this.canPass[this.canPass.length - 1] ? -1 : 1;
                e.x = this.canPassStone[this.canPassStone.length - 2].x + dist * (passStone.width / 2) * (j);
                e.y = this.canPassStone[this.canPassStone.length - 2].y - (passStone.height - 26) * (j);
                this.notPassStone.push(e);
            }
        }
    };
    Jump.prototype.removeStoneAndDis = function () {
        var stone = this.canPassStone[0];
        var stoneY = stone.y;
        this.canPassStone.splice(0, 1);
        this.canPass.splice(0, 1);
        this.noPass.splice(0, 1);
        stone.stoneDown();
        for (var i = 0; i < this.notPassStone.length; i++) {
            if (this.notPassStone[i].y >= stoneY) {
                var s = this.notPassStone[i];
                this.notPassStone.splice(i, 1);
                s.stoneDown();
            }
        }
    };
    Jump.stoneNum = 10;
    return Jump;
}(BaseSystem));
__reflect(Jump.prototype, "Jump");
var StoneData = (function () {
    function StoneData() {
        this.index = 0;
        this.state = 0;
    }
    return StoneData;
}());
__reflect(StoneData.prototype, "StoneData");
var GameSystem;
(function (GameSystem) {
    GameSystem.jump = Jump.ins.bind(Jump);
})(GameSystem || (GameSystem = {}));
