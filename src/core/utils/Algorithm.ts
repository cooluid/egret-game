enum AlgorithmSorting {
	/** 升序 */
	ascending,
	/** 降序 */
	descending,
}
class Algorithm {

	public static sortOn(t: any[], property: string[], type: AlgorithmSorting[] = null) {
		t.sort((a, b): number => {
			let as = 0;
			let bs = 0;
			let len = property.length;
			for (let i = 0; i < len; i++) {
				let key = property[i];
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
			return this.sortDesc(as, bs);
		});
	}
	/**升序 */
	public static sortAsc(b1, b2): number {
		if (b1 < b2) return -1;
		else if (b1 > b2) return 1;
		else return 0;
	}
	/**降序 */
	public static sortDesc(b1, b2): number {
		if (b1 > b2) return -1;
		else if (b1 < b2) return 1;
		else return 0;
	}

	//二分查找
	//tab 要检索的表
	// item 要搜索的玩意儿
	// binFunc 用于比较的函数，当纯数字tab时该参数可以为空，默认检索到的位置是最后的插入位置
	public static binSearch(tab: any[], item: any, binFunc: Function = null): number {
		if (!tab || tab.length == 0) return 0;

		if (!binFunc)
			binFunc = Algorithm.sortAsc;
		let low = 0;
		let high = tab.length - 1;

		while (low <= high) {
			let mid = (high + low) >> 1;
			let val: any = tab[mid];
			if (binFunc(val, item) <= 0) {
				low = mid + 1;
			}
			else {
				high = mid - 1;
			}
		}
		return low;
	}

	public static test() {
		let arr = [];
		const MAX = 10;
		for (let i = 0; i < MAX; i++) {
			let r = Math.floor(Math.random() * 100000);
			let index = Algorithm.binSearch(arr, r);
			arr.splice(index, 0, r);
		}
		if (arr.length != MAX)
			DebugUtils.log(`test fail!count is ${arr.length}, except:${MAX}`);
		for (let val of arr) {
			DebugUtils.log(val);
		}

		for (let i = 0; i < arr.length - 1; i++) {
			if (arr[i] > arr[i + 1]) {
				DebugUtils.log(`test fail!index:${i}`);
				break;
			}
		}
	}
}
