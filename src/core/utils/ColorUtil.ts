
/**
 * 颜色相关处理工具
 */
class ColorUtil {
	public static ALPHA: number = 0xFF000000;
	public static RED: number = 0xdc3819;
	public static GREEN: number = 0x28e528;
	public static BLUE: number = 0x1ec7ff;
	public static ORANGE: number = 0xfe9315;
	public static PURPLE: number = 0xdc3819;
	public static WHITE: number = 0xf6f2ea;

	/**
	 * 品质颜色数组
	 * 白 绿 蓝 紫 橙 红
	 */
	public static QUALITY_COLOR: number[] = [0xeedac3, 0x17f5b0, 0x27d5ff, 0xf322ed, 0xe0a01e, 0xee1c30];

	public static GREEN2: number = 0x26B411;
	public static RED2: number = 0xbd1d1d;
	public static ORANGE2: number = 0xE0A01E;


	public static GREEN3: number = 0x32d916;
	public static RED3: number = 0xee1c30;

	/**灰色滤镜 */
	public static GRAY_FILTERS = new egret.ColorMatrixFilter([0.3086, 0.6094, 0.082, 0, 0, 0.3086, 0.6094, 0.082, 0, 0, 0.3086, 0.6094, 0.082, 0, 0, 0, 0, 0, 1, 0]);

	/**
	 * 合并颜色值
	 */
	public static mergeARGB($a: number, $r: number, $g: number, $b: number): number {
		return ($a << 24) | ($r << 16) | ($g << 8) | $b;
	}

	/**
	 * 获取单个通道的颜色值
	 * @param $argb 颜色值
	 * @param $channel 要获取的颜色通道常量
	 */
	public static getChannel($argb: number, $channel: number): number {
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
	}

	/**
	 * 颜色值表示法转换number转String
	 * @param $number 需要转换的number值
	 * @param $prefix 字符串前缀
	 */
	public static numberToString($number: number, $prefix: String = "#"): String {
		return $prefix + $number.toString(16);
	}

}

