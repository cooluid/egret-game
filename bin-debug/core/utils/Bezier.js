function bezierAbs(e, t, tt, time, changeCB) {
    egret.Tween.removeTweens(e);
    var factor = "$factor";
    e[factor] = 0;
    var ex = e.x;
    var ey = e.y;
    var tween = egret.Tween.get(e, {
        onChange: function () {
            var value = e[factor];
            if (value == 0) {
                return;
            }
            e.x = (1 - value) * (1 - value) * ex + 2 * value * (1 - value) * t.x + value * value * tt.x;
            e.y = (1 - value) * (1 - value) * ey + 2 * value * (1 - value) * t.y + value * value * tt.y;
            if (changeCB) {
                changeCB();
            }
        },
        onChangeObj: e
    });
    tween.to({ $factor: 1 }, time);
    return tween;
}
function bezier(e, t, tt, time, changeCB) {
    var ex = e.x;
    var ey = e.y;
    t.x += ex;
    t.y += ey;
    tt.x += ex;
    tt.y += ey;
    return bezierAbs(e, t, tt, time, changeCB);
}
/**获取贝塞尔曲线的p1点 */
function getP1ByP0P2(p0, p2, minDis) {
    var p1 = new egret.Point;
    p1.x = Math.min(p0.x + (p2.x - p0.x) * 3 / 5);
    p1.y = Math.min(p2.y, p0.y - minDis);
    return p1;
}
