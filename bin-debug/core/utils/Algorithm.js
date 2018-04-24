var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AlgorithmSorting;
(function (AlgorithmSorting) {
    /** 升序 */
    AlgorithmSorting[AlgorithmSorting["ascending"] = 0] = "ascending";
    /** 降序 */
    AlgorithmSorting[AlgorithmSorting["descending"] = 1] = "descending";
})(AlgorithmSorting || (AlgorithmSorting = {}));
var Algorithm = (function () {
    function Algorithm() {
    }
    Algorithm.sortOn = function (t, property, type) {
        var _this = this;
        if (type === void 0) { type = null; }
        t.sort(function (a, b) {
            var as = 0;
            var bs = 0;
            var len = property.length;
            for (var i = 0; i < len; i++) {
                var key = property[i];
                if (type && type[i] == AlgorithmSorting.descending) {
                    if (a[key] > b[key])
                        as = as | (1 << (len - 1 - i));
                    if (a[key] < b[key])
                        bs = bs | (1 << (len - 1 - i));
                }
                else {
                    if (a[key] < b[key])
                        as = as | (1 << (len - 1 - i));
                    if (a[key] > b[key])
                        bs = bs | (1 << (len - 1 - i));
                }
                // DebugUtils.log(`a[${key}]=${a[key]}`, `b[${key}]=${b[key]}`);
            }
            // DebugUtils.log(`as=${as}`, `bs=${bs}`);
            return _this.sortDesc(as, bs);
        });
    };
    /**升序 */
    Algorithm.sortAsc = function (b1, b2) {
        if (b1 < b2)
            return -1;
        else if (b1 > b2)
            return 1;
        else
            return 0;
    };
    /**降序 */
    Algorithm.sortDesc = function (b1, b2) {
        if (b1 > b2)
            return -1;
        else if (b1 < b2)
            return 1;
        else
            return 0;
    };
    //二分查找
    //tab 要检索的表
    // item 要搜索的玩意儿
    // binFunc 用于比较的函数，当纯数字tab时该参数可以为空，默认检索到的位置是最后的插入位置
    Algorithm.binSearch = function (tab, item, binFunc) {
        if (binFunc === void 0) { binFunc = null; }
        if (!tab || tab.length == 0)
            return 0;
        if (!binFunc)
            binFunc = Algorithm.sortAsc;
        var low = 0;
        var high = tab.length - 1;
        while (low <= high) {
            var mid = (high + low) >> 1;
            var val = tab[mid];
            if (binFunc(val, item) <= 0) {
                low = mid + 1;
            }
            else {
                high = mid - 1;
            }
        }
        return low;
    };
    Algorithm.test = function () {
        var arr = [];
        var MAX = 10;
        for (var i = 0; i < MAX; i++) {
            var r = Math.floor(Math.random() * 100000);
            var index = Algorithm.binSearch(arr, r);
            arr.splice(index, 0, r);
        }
        if (arr.length != MAX)
            DebugUtils.log("test fail!count is " + arr.length + ", except:" + MAX);
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var val = arr_1[_i];
            DebugUtils.log(val);
        }
        for (var i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                DebugUtils.log("test fail!index:" + i);
                break;
            }
        }
    };
    return Algorithm;
}());
__reflect(Algorithm.prototype, "Algorithm");
