/**
 * 绝地跑鸡
 */
class ChickRun extends BaseSystem {
    private map: ViewMap;

    public constructor() {
        super();
    }

    public static ins(): ChickRun {
        return super.ins() as ChickRun;
    }
}
namespace GameSystem {
    let chickRun = ChickRun.ins.bind(ChickRun);
}