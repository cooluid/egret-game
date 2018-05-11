class Nostop extends BaseSystem {
	public constructor() {
		super();
	}

	public static ins(): Nostop {
		return super.ins() as Nostop;
	}
}
namespace GameSystem {
	export let nostop = Nostop.ins.bind(Nostop);
}