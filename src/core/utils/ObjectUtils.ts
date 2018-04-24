class ObjectUtils {
	public static init(data: any) {
		for (let key in data) {
			let value = data[key];

			let objCls = egret.getDefinitionByName(key);
			window[`${objCls}`] = objCls;

			if (objCls) {
				let objKey = `_obj${key}`;
				this[objKey] = new objCls();

				let boolKey = `_bool${key}`;
				this[boolKey] = false;

				let newKey = `_${key}_`;
				Object.defineProperty(this, key, {
					get: function () {
						let obj = this[newKey];
						if (this[boolKey]) {
							return obj;
						}

						let parent = this[objKey];
						for (let i in obj) {
							obj[i].__proto__ = parent;
						}
						this[boolKey] = true;

						return obj;
					},
					set: function (val) {
						this[newKey] = val;
					}
				});
			}

			this[key] = value;
		}

	}
}
