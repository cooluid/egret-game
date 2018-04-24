var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.LEFT = 37;
    Keyboard.UP = 38;
    Keyboard.RIGHT = 39;
    Keyboard.DOWN = 40;
    Keyboard.KC_1 = 49;
    Keyboard.KC_2 = 50;
    Keyboard.KC_3 = 51;
    Keyboard.KC_4 = 52;
    Keyboard.KC_5 = 53;
    Keyboard.KC_6 = 54;
    Keyboard.KC_7 = 55;
    Keyboard.KC_8 = 56;
    Keyboard.KC_9 = 57;
    Keyboard.KC_0 = 48;
    Keyboard.A = 65;
    Keyboard.B = 66;
    Keyboard.C = 67;
    Keyboard.D = 68;
    Keyboard.E = 69;
    Keyboard.F = 70;
    Keyboard.G = 71;
    Keyboard.H = 72;
    Keyboard.I = 73;
    Keyboard.J = 74;
    Keyboard.K = 75;
    Keyboard.L = 76;
    Keyboard.M = 77;
    Keyboard.N = 78;
    Keyboard.O = 79;
    Keyboard.P = 80;
    Keyboard.Q = 81;
    Keyboard.R = 82;
    Keyboard.S = 83;
    Keyboard.T = 84;
    Keyboard.U = 85;
    Keyboard.V = 86;
    Keyboard.W = 87;
    Keyboard.X = 88;
    Keyboard.Y = 89;
    Keyboard.Z = 90;
    Keyboard.SPACE = 32;
    /** + */
    Keyboard.SMALL_K_ADD = 107;
    /** - */
    Keyboard.SMALL_K_MIN = 109;
    /** [ */
    Keyboard.BRACE_L = 219;
    /** \ */
    Keyboard.BACKSLASH = 220;
    /** ] */
    Keyboard.BRACE_R = 221;
    /** ` */
    Keyboard.BACK_QUOTE = 192;
    /** enter */
    Keyboard.ENTER = 13; // enter	
    /* 主键盘功能键 */
    Keyboard.KC_BACKSPACE = 8; //backspace 退格键
    Keyboard.KC_TAB = 9; //tab 换行键
    Keyboard.KC_ENTER = 13; //main ENTER 回车键（主键盘区）
    Keyboard.KC_SHIFT = 16; //shift 
    Keyboard.KC_CONTROL = 17; //ctrl
    Keyboard.KC_ESCAPE = 27; //esc
    Keyboard.KC_SPACE = 32; //space 空格键
    Keyboard.KC_WINDOWS = 91; //windows
    Keyboard.KC_MENU = 93; //menu
    return Keyboard;
}());
__reflect(Keyboard.prototype, "Keyboard");
