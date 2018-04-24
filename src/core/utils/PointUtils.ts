class PointUtils {

	public static getExtendPoint2(ax: number, ay: number, bx: number, by: number, distance: number, extend: boolean = true): egret.Point {
		let dx: number = ax - bx;
		let dy: number = ay - by;
		let dist: number = Math.sqrt(dx * dx + dy * dy);
		let out: egret.Point = new egret.Point();
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
	}

	/**检测指定点是否在指定的多边形内 */
	public static checkPointInArea(area: XY[], point: XY): boolean {
		let i, j: number = 0;
		let result: boolean = false;
		for (i = 0, j = area.length - 1; i < area.length; j = i++) {
			if (((area[i].y > point.y) != (area[j].y > point.y)) &&
				(point.x < (area[j].x - area[i].x) * (point.y - area[i].y) / (area[j].y - area[i].y) + area[i].x)) {
				result = !result;
			}
		}
		return result;
	}

}
