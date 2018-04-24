function bezierAbs(e: egret.DisplayObject,
	t: { x: number, y: number },
	tt: { x: number, y: number },
	time: number, changeCB?: () => any): egret.Tween {
	egret.Tween.removeTweens(e);
	let factor = `$factor`;
	e[factor] = 0;
	let ex = e.x;
	let ey = e.y;
	let tween = egret.Tween.get(e, {
		onChange: () => {
			let value = e[factor];
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

function bezier(e: egret.DisplayObject,
	t: { x: number, y: number },
	tt: { x: number, y: number },
	time: number, changeCB?: () => any): egret.Tween {
	let ex = e.x;
	let ey = e.y;
	t.x += ex;
	t.y += ey;
	tt.x += ex;
	tt.y += ey;
	return bezierAbs(e, t, tt, time, changeCB);
}

/**获取贝塞尔曲线的p1点 */
function getP1ByP0P2(p0: { x: number, y: number },
	p2: { x: number, y: number },
	minDis: number): { x: number, y: number } {
	let p1: egret.Point = new egret.Point;
	p1.x = Math.min(p0.x + (p2.x - p0.x) * 3 / 5);
	p1.y = Math.min(p2.y, p0.y - minDis);
	return p1;
}