var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PointUtils = (function () {
    function PointUtils() {
    }
    PointUtils.getExtendPoint2 = function (ax, ay, bx, by, distance, extend) {
        if (extend === void 0) { extend = true; }
        var dx = ax - bx;
        var dy = ay - by;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var out = new egret.Point();
        if (extend) {
            out.x = bx + (bx - ax) / dist * distance;
            out.y = by + (by - ay) / dist * distance;
        }
        else {
            if (distance > dist) {
                distance = dist;
            }
            out.x = bx - (bx - ax) / dist * distance;
            out.y = by - (by - ay) / dist * distance;
        }
        return out;
    };
    /**检测指定点是否在指定的多边形内 */
    PointUtils.checkPointInArea = function (area, point) {
        var i, j = 0;
        var result = false;
        for (i = 0, j = area.length - 1; i < area.length; j = i++) {
            if (((area[i].y > point.y) != (area[j].y > point.y)) &&
                (point.x < (area[j].x - area[i].x) * (point.y - area[i].y) / (area[j].y - area[i].y) + area[i].x)) {
                result = !result;
            }
        }
        return result;
    };
    return PointUtils;
}());
__reflect(PointUtils.prototype, "PointUtils");
//# sourceMappingURL=PointUtils.js.map