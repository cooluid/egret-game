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
/**
 *  动画类
 * @author
 */
var MovieClip = (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip() {
        var _this = _super.call(this) || this;
        /**倍率 ,越大越快*/
        _this.rate = 1;
        _this._mcFactory = new egret.MovieClipDataFactory();
        return _this;
    }
    MovieClip.prototype.playFile = function (name, playCount, compFun, remove) {
        var _this = this;
        if (playCount === void 0) { playCount = 1; }
        if (compFun === void 0) { compFun = null; }
        if (remove === void 0) { remove = true; }
        this.time = egret.getTimer();
        this._compFun = compFun;
        this.playCount = playCount;
        this.remove = remove;
        TimerManager.ins().remove(this.playComp, this);
        if (this.name == name) {
            this.createBody();
            return;
        }
        this.name = name;
        this.jsonData = null;
        this.texture = null;
        RES.getResByUrl(this.name + ".json", function (data) {
            if (_this.name != name || !data)
                return;
            _this.jsonData = data;
            _this.createBody();
        }, this, RES.ResourceItem.TYPE_JSON);
        RES.getResByUrl(this.name + ".png", function (data) {
            if (_this.name != name || !data)
                return;
            _this.texture = data;
            _this.createBody();
        }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    /**
     * 创建主体动画
     */
    MovieClip.prototype.createBody = function () {
        if (!this.jsonData || !this.texture)
            return;
        this._mcFactory.mcDataSet = this.jsonData;
        this._mcFactory.texture = this.texture;
        var temp = this.name.split("/");
        var tempName = temp.pop();
        this.movieClipData = this._mcFactory.generateMovieClipData(tempName);
        if (!(this.name in MovieClip.originalRate)) {
            MovieClip.originalRate[this.name] = this.movieClipData.frameRate;
        }
        this.frameRate = (MovieClip.originalRate[this.name] * this.rate) >> 0;
        //从第一帧开始自动播放
        this.gotoAndPlay(1, this.playCount);
        this.visible = true;
        if (this.playCount > 0) {
            var tempTime = egret.getTimer() - this.time;
            tempTime = this.playTime * this.playCount - tempTime;
            if (tempTime > 0)
                TimerManager.ins().doTimer(tempTime, 1, this.playComp, this);
            else
                this.playComp();
        }
        //抛出内容已经改变事件
        this.dispatchEventWith(egret.Event.CHANGE);
    };
    /**
     * 自动播放次数完成处理
     * @param e
     */
    MovieClip.prototype.playComp = function () {
        if (this.stage && this._compFun)
            this._compFun();
        if (this.remove)
            DisplayUtils.removeFromParent(this);
    };
    Object.defineProperty(MovieClip.prototype, "playTime", {
        /** 播放总时长(毫秒) */
        get: function () {
            if (!this.movieClipData)
                return 0;
            return 1 / this.frameRate * this.totalFrames * 1000;
        },
        enumerable: true,
        configurable: true
    });
    MovieClip.prototype.clearComFun = function () {
        this._compFun = null;
    };
    Object.defineProperty(MovieClip.prototype, "enableCache", {
        set: function (value) {
            if (this._mcFactory) {
                this._mcFactory.enableCache = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /** 原始帧频 */
    MovieClip.originalRate = {};
    return MovieClip;
}(egret.MovieClip));
__reflect(MovieClip.prototype, "MovieClip");
