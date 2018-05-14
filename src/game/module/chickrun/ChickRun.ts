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

    public postCollision(car: ChickRunCarItem): ChickRunCarItem {
        return car;
    }

    public postChangeConf() {
        DebugUtils.log(`改变配置`);
    }
}
MessageCenter.compile(ChickRun);
namespace GameSystem {
    export let chickRun = ChickRun.ins.bind(ChickRun);
}