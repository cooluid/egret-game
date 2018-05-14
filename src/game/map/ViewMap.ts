/**跑鸡地图 */
class ViewMap extends egret.DisplayObjectContainer {
    /**实体层 */
    private _entityLayer: egret.DisplayObjectContainer;
    /**主题层 */
    private _mainLayer: egret.DisplayObjectContainer;
    /*特效层*/
    private _effectLayer: egret.DisplayObjectContainer;

    public entitys: egret.DisplayObject[] = [];

    public constructor() {
        super();
    }

    private static instance: ViewMap;

    public static ins(): ViewMap {
        if (!this.instance) this.instance = new ViewMap();
        return this.instance;
    }

    public initMap() {
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
    }

    public addEntity(entity) {
        this._entityLayer.addChild(entity);
        this.entitys.push(entity);
    }

    public addMainEntiy(entity) {
        this._mainLayer.addChild(entity);
    }

    public getEntityByIndex(index: number): egret.DisplayObject {
        return this._entityLayer.getChildAt(index);
    }

    public clearMap() {
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
    }
}