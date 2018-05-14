var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var XY = (function () {
    function XY() {
        this.x = 0;
        this.y = 0;
    }
    return XY;
}());
__reflect(XY.prototype, "XY");
/**
 * Created by yangsong on 2014/11/22.
 * 数学计算工具类
 */
var MathUtils = (function () {
    function MathUtils() {
    }
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    MathUtils.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    MathUtils.getRadian = function (angle) {
        return angle / 180 * Math.PI;
    };
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.getRadian2 = function (p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    MathUtils.getDistanceByObject = function (s, t) {
        return this.getDistance(s.x, s.y, t.x, t.y);
    };
    /**获取两个点的距离的平方 */
    MathUtils.getDistanceX2ByObject = function (s, t) {
        var disX = s.x - t.x;
        var disY = s.y - t.y;
        return disX * disX + disY * disY;
    };
    /** 角度移动点 */
    MathUtils.getDirMove = function (angle, distance, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        var radian = this.getRadian(angle);
        var p = { x: 0, y: 0 };
        p.x = Math.cos(radian) * distance + offsetX;
        p.y = Math.sin(radian) * distance + offsetY;
        return p;
    };
    /**
     * 获取两个点延长线上某个距离的点
     * @param p1:起始点
     * @param p2:结束点
     */
    MathUtils.getPByDistance = function (p1, p2, disance) {
        var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var p = new egret.Point;
        p.x = p2.x + disance * Math.cos(angle);
        p.y = p2.y + disance * Math.sin(angle);
        return p;
    };
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    MathUtils.limit = function ($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    MathUtils.limitInteger = function ($from, $end) {
        return Math.round(this.limit($from, $end));
    };
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    MathUtils.randomArray = function (arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    /**取整 */
    MathUtils.toInteger = function (value) {
        return value >> 0;
    };
    /**
     * vertx, verty: 顶点X坐标和Y坐标分别组成的数组
     * testx, testy: 需要测试的点的X坐标和Y坐标
     */
    MathUtils.testInRect = function (vertx, verty, testx, testy) {
        var i, j = 0;
        var result = false;
        var count = vertx.length;
        for (i = 0, j = count - 1; i < count; j = i++) {
            if (((verty[i] > testy) != (verty[j] > testy)) &&
                (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
                result = !result;
        }
        return result;
    };
    /**
     * 计算得到矩形范围内的单位
     */
    MathUtils.getInRectList = function (sender, target, range, width, enemys, affectCount) {
        if (affectCount === void 0) { affectCount = Number.MAX_VALUE; }
        var dx = target.x - sender.x;
        var dy = target.y - sender.y;
        var radian = Math.atan2(dy, dx);
        var lx = width * Math.cos(radian);
        var ly = range * Math.sin(radian);
        var cv = Math.cos(radian);
        var sv = Math.sin(radian);
        var sl = range * Math.sin(radian);
        var cl = range * Math.cos(radian);
        var sw = width * Math.sin(radian);
        var cw = width * Math.cos(radian);
        var x3 = target.x + cl;
        var y3 = target.y + sl;
        var xVec = new Array();
        var yVec = new Array();
        xVec[0] = target.x + sw;
        yVec[0] = target.y - cw;
        xVec[1] = target.x - sw;
        yVec[1] = target.y + cw;
        xVec[3] = x3 + sw;
        yVec[3] = y3 - cw;
        xVec[2] = x3 - sw;
        yVec[2] = y3 + cw;
        var list = [];
        list.push(target);
        for (var _i = 0, enemys_1 = enemys; _i < enemys_1.length; _i++) {
            var enemy = enemys_1[_i];
            if (enemy == target) {
                continue;
            }
            if (list.length >= affectCount) {
                break;
            }
            if (this.testInRect(xVec, yVec, enemy.x, enemy.y)) {
                list.push(enemy);
            }
        }
        return list;
    };
    /**
     * 获取圆形区域内的单位
     */
    MathUtils.getInCircleList = function (target, range, enemys, affectCount) {
        if (affectCount === void 0) { affectCount = Number.MAX_VALUE; }
        var list = [];
        for (var _i = 0, enemys_2 = enemys; _i < enemys_2.length; _i++) {
            var enemy = enemys_2[_i];
            if (list.length >= affectCount) {
                break;
            }
            if (this.getDistance(target.x, target.y, enemy.x, enemy.y) <= range) {
                list.push(enemy);
            }
        }
        return list;
    };
    /**
     * 获取最近的目标点
     * @param s
     * @param ts
     * @param count
     */
    MathUtils.getClosest = function (s, ts, count) {
        if (count === void 0) { count = 1; }
        var result = [];
        var _tDis = '_tDis';
        var tsLen = ts.length;
        for (var i = 0; i < tsLen; i++) {
            var tDis = this.getDistanceByObject(s, ts[i]);
            ts[i][_tDis] = tDis;
            result.push(ts[i]);
        }
        result.sort(function (a, b) {
            return Algorithm.sortAsc(a[_tDis], b[_tDis]);
        });
        if (result.length > count)
            result.length = count;
        return result;
    };
    return MathUtils;
}());
__reflect(MathUtils.prototype, "MathUtils");
//# sourceMappingURL=MathUtils.js.map