var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var WatcherUtils = (function () {
    function WatcherUtils() {
    }
    WatcherUtils.removeFromArrayCollection = function (dataPro) {
        if (dataPro && dataPro.source && dataPro.source.length) {
            for (var _i = 0, _a = dataPro.source; _i < _a.length; _i++) {
                var source = _a[_i];
                WatcherUtils.removeFromObject(source);
            }
        }
    };
    WatcherUtils.removeFromObject = function (obj) {
        if (obj instanceof egret.EventDispatcher) {
            var event_1 = obj.$getEventMap();
            var list = event_1[eui.PropertyEvent.PROPERTY_CHANGE];
            if (list) {
                for (var index = list.length - 1; index >= 0; index--) {
                    var obj_1 = list[index];
                    if (obj_1.thisObject instanceof eui.Watcher) {
                        obj_1.thisObject.unwatch();
                        list.splice(index, 1);
                    }
                }
            }
        }
        else {
            var listeners = obj['__listeners__'];
            if (listeners && listeners.length) {
                for (var i = 0; i < listeners.length; i += 2) {
                    // let listener:Function = listeners[i];
                    var target = listeners[i + 1];
                    if (target instanceof eui.Watcher) {
                        target.unwatch();
                        // listeners.splice(i,2);  //在 eui.Watcher 中的 unwatch 已经移除
                        i -= 2;
                    }
                }
            }
        }
    };
    return WatcherUtils;
}());
__reflect(WatcherUtils.prototype, "WatcherUtils");
