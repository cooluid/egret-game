class BmpNumber extends egret.DisplayObjectContainer {

	private bmps: egret.Bitmap[] = [];
	private maxHeight: number = 0;
	private maxWidth: number = 0;

	public constructor() {
		super();
	}

	/**
	 * 设置数字
	 * @value 整数,或者字符串
	 * @type 类型 NumberType中的值
	 * @spacing 叠加间距 NumberType中的值
	 * */
	public setNumber(value: number | string, numberType: number | string, spacing: number = 0): void {
		let valueStr: string = value.toString();
		valueStr = valueStr.replace(RegExpUtil.DOT_NUMBER, "");
		let len: number = Math.max(valueStr.length, this.bmps.length);
		let lastX: number = 0;
		this.maxHeight = this.maxWidth = 0;
		for (let i = 0; i < len; i++) {
			let bmp: egret.Bitmap = this.bmps[i];
			if (!bmp) {
				bmp = new egret.Bitmap;
				this.bmps[i] = bmp;
				this.addChild(bmp);
			}
			if (i < valueStr.length) {
				let texture: egret.Texture = RES.getRes(BmpNumber.parserUrl((numberType) + valueStr[i]));
				if (texture) {
					bmp.visible = true;
					bmp.texture = texture;
					this.maxHeight = Math.max(bmp.texture.textureHeight, this.maxHeight);
					this.maxWidth += bmp.texture.textureWidth;
				}
				else
					throw new Error(`BmpNumber类使用的数字资源必须提前预加载,在 num.png 中打包成图集` + (BmpNumber.parserUrl((numberType) + valueStr[i])));
			}
			else {
				bmp.texture = null;
				bmp.visible = false;
			}
			bmp.x = lastX + spacing;
			lastX = bmp.x + bmp.width;
		}
	}



	static parserUrl(str: string): string {
		return str;
	}

	public get height(): number {
		return this.maxHeight;
	}

	public get width(): number {
		return this.maxWidth;
	}

	public reset(): void {
		this.alpha = this.scaleX = this.scaleY = 1;
		this.maxHeight = this.maxWidth = 0;
		for (let bmp of this.bmps) {
			bmp.texture = null;
		}
	}

}

