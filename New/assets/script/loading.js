// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Node,
        progress: cc.ProgressBar,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    initOver() {
        // cc.director.preloadScene("game");
        cc.director.loadScene('game');
    },

    //onLoad () {},

    start() {
        this.progress.progress = 0;
        let proNode = this.progress.node;
        let lbProNode = proNode.getChildByName("lbPro");
        this.lbPro = lbProNode.getComponent(cc.Label);
        this.lbPro.string = "0%";
        // this.npNode = proNode.getChildByName("np");
        // this.npPosition = npNode.position.x
        // this.np.position.x = -222;
        g_Res.doLoad();
        this.line = 0;
        this.allRes = g_Res.getLoadNum();
        // this.loadRes = g_Res.getResNum();
    },

    update(dt) {
        this.line = (this.allRes - g_Res.getLoadNum()) / g_Res.allRes;
        // cc.log("344343434", g_Res.allRess);
        if (this.progress.progress < this.line) {
            this.progress.progress += 0.02;
            this.lbPro.string = Math.floor(this.progress.progress * 100) + "%";
            // this.np.position.x = this.progress.progress*488+this.np.position.x;
            // cc.log(this.npPosition)
            if (this.progress.progress >= 1) {
                this.initOver();
            }
        }

    },
});
