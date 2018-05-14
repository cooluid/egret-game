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
var ChickRunStreetItem = (function (_super) {
    __extends(ChickRunStreetItem, _super);
    function ChickRunStreetItem() {
        var _this = _super.call(this) || this;
        _this.YPOS = [120, 230];
        _this.allCars = [[], [], [], []];
        _this.timeTest = 4500;
        _this.skinName = 'ChickRunStreetItemSkin';
        return _this;
    }
    ChickRunStreetItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.main = ChickRunMain.ins();
        TimerManager.ins().doTimer(250, 0, this.show, this);
    };
    ChickRunStreetItem.prototype.show = function () {
        var _this = this;
        //智能车，4条道随机添加，支持变速，超车功能
        //距离一定，时间会变
        //第一条道
        var odds = Math.random();
        var cars1 = this.allCars[0];
        var lastCar = cars1 && cars1[cars1.length - 1];
        if (odds > .9 && this.checkCar(lastCar)) {
            //添加车辆
            var car_1 = this.createCar(0);
            if (car_1) {
                car_1.x = -car_1.width;
                car_1.y = this.YPOS[0] - car_1.height - Math.random() * 10 - 5;
                egret.Tween.get(car_1, { onChange: function () { _this.collision(); }, onChangeObj: this }).to({ x: 640 + car_1.width }, this.timeTest).call(function () {
                    DisplayUtils.removeFromParent(car_1);
                    var index = cars1.indexOf(car_1);
                    cars1.splice(index, 1);
                }, this);
            }
        }
        //第二条道
        odds = Math.random();
        var cars2 = this.allCars[1];
        lastCar = cars2 && cars2[cars2.length - 1];
        if (odds > .9 && this.checkCar(lastCar)) {
            //添加车辆
            var car_2 = this.createCar(1);
            if (car_2) {
                car_2.x = -car_2.width;
                car_2.y = this.YPOS[0] + Math.random() * 10 + 10;
                egret.Tween.get(car_2, { onChange: function () { _this.collision(); }, onChangeObj: this }).to({ x: 640 + car_2.width }, this.timeTest).call(function () {
                    DisplayUtils.removeFromParent(car_2);
                    var index = cars2.indexOf(car_2);
                    cars2.splice(index, 1);
                }, this);
            }
        }
        // //第三条道
        odds = Math.random();
        var cars3 = this.allCars[2];
        lastCar = cars3 && cars3[cars3.length - 1];
        if (odds > .9 && this.checkCar(lastCar, 1)) {
            //添加车辆
            var car_3 = this.createCar(2);
            if (car_3) {
                car_3.x = this.width + car_3.width;
                car_3.y = this.YPOS[1] - car_3.height - Math.random() * 10;
                egret.Tween.get(car_3, { onChange: function () { _this.collision(); }, onChangeObj: this }).to({ x: -car_3.width }, this.timeTest).call(function () {
                    DisplayUtils.removeFromParent(car_3);
                    var index = cars3.indexOf(car_3);
                    cars3.splice(index, 1);
                }, this);
            }
        }
        // //第四条道
        odds = Math.random();
        var cars4 = this.allCars[3];
        lastCar = cars4 && cars4[cars4.length - 1];
        if (odds > .9 && this.checkCar(lastCar, 1)) {
            //添加车辆
            var car_4 = this.createCar(3);
            if (car_4) {
                car_4.x = this.width + car_4.width;
                car_4.y = this.YPOS[1] + Math.random() * 10 + 10;
                egret.Tween.get(car_4, { onChange: function () { _this.collision(); }, onChangeObj: this }).to({ x: -car_4.width }, this.timeTest).call(function () {
                    DisplayUtils.removeFromParent(car_4);
                    var index = cars4.indexOf(car_4);
                    cars4.splice(index, 1);
                }, this);
            }
        }
    };
    ChickRunStreetItem.prototype.checkCar = function (car, type) {
        if (type === void 0) { type = 0; }
        if (!car)
            return true;
        if (type == 1) {
            return car.x <= this.width - car.width;
        }
        else {
            return car.x > car.width;
        }
    };
    ChickRunStreetItem.prototype.collision = function () {
        if (!this.main.parent)
            return;
        for (var _i = 0, _a = this.allCars; _i < _a.length; _i++) {
            var cars = _a[_i];
            for (var _b = 0, cars_1 = cars; _b < cars_1.length; _b++) {
                var car = cars_1[_b];
                if (!car)
                    continue;
                if ((car.hitTestPoint(this.main.x, this.main.y))) {
                    egret.Tween.removeTweens(car);
                    ChickRun.ins().postCollision(car);
                    DebugUtils.log("\u78B0\u649E\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01");
                }
            }
        }
    };
    ChickRunStreetItem.prototype.removeTween = function () {
        TimerManager.ins().removeAll(this);
        for (var _i = 0, _a = this.allCars; _i < _a.length; _i++) {
            var cars = _a[_i];
            for (var _b = 0, cars_2 = cars; _b < cars_2.length; _b++) {
                var car = cars_2[_b];
                if (!car)
                    continue;
                egret.Tween.removeTweens(car);
            }
        }
    };
    ChickRunStreetItem.prototype.createCar = function (road) {
        var cars = this.allCars[road];
        if (cars.length > 3)
            return null;
        var car = new ChickRunCarItem();
        this.addChild(car);
        cars.push(car);
        return car;
    };
    return ChickRunStreetItem;
}(BaseItemRender));
__reflect(ChickRunStreetItem.prototype, "ChickRunStreetItem");
//# sourceMappingURL=ChickRunStreetItem.js.map