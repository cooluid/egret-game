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
/**跑鸡地图 */
var ViewMap = (function (_super) {
    __extends(ViewMap, _super);
    function ViewMap() {
        var _this = _super.call(this) || this;
        _this.entitys = [];
        return _this;
    }
    ViewMap.ins = function () {
        if (!this.instance)
            this.instance = new ViewMap();
        return this.instance;
    };
    ViewMap.prototype.initMap = function () {
        this.touchChildren = true;
        this.touchEnabled = true;
        this._entityLayer = new egret.DisplayObjectContainer();
        this._mainLayer = new egret.DisplayObjectContainer();
        this._effectLayer = new egret.DisplayObjectContainer();
        this.addChild(this._entityLayer);
        this.addChild(this._mainLayer);
        this.addChild(this._effectLayer);
        //test
        // let shape = new egret.Shape();
        // shape.graphics.beginFill(0x0000ff);
        // shape.graphics.drawRect(0, 0, 640, 1424);
        // shape.graphics.endFill();
        // this.addChild(shape);
    };
    ViewMap.prototype.addEntity = function (entity) {
        this._entityLayer.addChild(entity);
        this.entitys.push(entity);
    };
    ViewMap.prototype.addMainEntiy = function (entity) {
        this._mainLayer.addChild(entity);
    };
    ViewMap.prototype.getEntityByIndex = function (index) {
        return this._entityLayer.getChildAt(index);
    };
    ViewMap.prototype.clearMap = function () {
        this._entityLayer.removeChildren();
        DisplayUtils.removeFromParent(this._entityLayer);
        this._entityLayer = null;
        this._mainLayer.removeChildren();
        DisplayUtils.removeFromParent(this._mainLayer);
        this._mainLayer = null;
        this._effectLayer.removeChildren();
        DisplayUtils.removeFromParent(this._effectLayer);
        this._effectLayer = null;
        this.entitys.length = 0;
        ViewMap.instance = null;
    };
    return ViewMap;
}(egret.DisplayObjectContainer));
__reflect(ViewMap.prototype, "ViewMap");
//# sourceMappingURL=ViewMap.js.map