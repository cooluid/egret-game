var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 颜色相关处理工具
 */
var ColorUtil = (function () {
    function ColorUtil() {
    }
    /**
     * 合并颜色值
     */
    ColorUtil.mergeARGB = function ($a, $r, $g, $b) {
        return ($a << 24) | ($r << 16) | ($g << 8) | $b;
    };
    /**
     * 获取单个通道的颜色值
     * @param $argb 颜色值
     * @param $channel 要获取的颜色通道常量
     */
    ColorUtil.getChannel = function ($argb, $channel) {
        switch ($channel) {
            case this.ALPHA:
                return ($argb >> 24) & 0xff;
            case this.RED:
                return ($argb >> 16) & 0xff;
            case this.GREEN:
                return ($argb >> 8) & 0xff;
            case this.BLUE:
                return $argb & 0xff;
        }
        return 0;
    };
    /**
     * 颜色值表示法转换number转String
     * @param $number 需要转换的number值
     * @param $prefix 字符串前缀
     */
    ColorUtil.numberToString = function ($number, $prefix) {
        if ($prefix === void 0) { $prefix = "#"; }
        return $prefix + $number.toString(16);
    };
    ColorUtil.ALPHA = 0xFF000000;
    ColorUtil.RED = 0xdc3819;
    ColorUtil.GREEN = 0x28e528;
    ColorUtil.BLUE = 0x1ec7ff;
    ColorUtil.ORANGE = 0xfe9315;
    ColorUtil.PURPLE = 0xdc3819;
    ColorUtil.WHITE = 0xf6f2ea;
    /**
     * 品质颜色数组
     * 白 绿 蓝 紫 橙 红
     */
    ColorUtil.QUALITY_COLOR = [0xeedac3, 0x17f5b0, 0x27d5ff, 0xf322ed, 0xe0a01e, 0xee1c30];
    ColorUtil.GREEN2 = 0x26B411;
    ColorUtil.RED2 = 0xbd1d1d;
    ColorUtil.ORANGE2 = 0xE0A01E;
    ColorUtil.GREEN3 = 0x32d916;
    ColorUtil.RED3 = 0xee1c30;
    /**灰色滤镜 */
    ColorUtil.GRAY_FILTERS = new egret.ColorMatrixFilter([0.3086, 0.6094, 0.082, 0, 0, 0.3086, 0.6094, 0.082, 0, 0, 0.3086, 0.6094, 0.082, 0, 0, 0, 0, 0, 1, 0]);
    return ColorUtil;
}());
__reflect(ColorUtil.prototype, "ColorUtil");
//# sourceMappingURL=ColorUtil.js.map