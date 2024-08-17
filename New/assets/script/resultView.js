// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
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

    gameOver() {
        // let gameNode = cc.instantiate(g_Res.getRes("gameover", "gameOver"));
        // this.gameoverLayer.addChild(gameNode);
        // result = cc.find("resultLayer/turn", this.node).getComponent(cc.Label);
        // this.count = cc.find("resultLayer/turn", this.node).getComponent(cc.Label);
        // this.kill = cc.find("resultLayer/kill", this.node).getComponent(cc.Label);
        // this.live = cc.find("resultLayer/live", this.node).getComponent(cc.Label);
        // let monsterDestroyNum = g_Monster.monsterDestroyNum;
        // this.count.string = "挑战波数:" + game.round;
        // this.kill.string = "消灭怪物：" + monsterDestroyNum;
        // // hour = Math.floor(this.liveTime / 360);
        // min = Math.floor((this.liveTime / 60));
        // s = Math.floor(this.liveTime % 60);

        // this.live.string = "生存时间：" + min + "m" + s + "s";

        // this.pause = true;
        // return {
        //     count: count,
        //     kill: kill,
        //     live: live,
        // }
    },

    initPanel() {
        let data = cc.sys.localStorage.getItem("word");

        let monsterDestroyNum = g_Monster.monsterDestroyNum;
        this.lbTrue.string = "挑战波数:" + game.round;
        this.lbKill.string = "消灭怪物：" + monsterDestroyNum;
        // hour = Math.floor(this.liveTime / 360);
        let min = Math.floor((this.liveTime / 60));
        let s = Math.floor(this.liveTime % 60);

        this.lbLive.string = "生存时间：" + min + "m" + s + "s";
        if (data) {
            data = JSON.parse(data);
        }
        else {
            data = {
                ture: -1,
                kill: -1,
                live: -1,
            };
        }
        let newData = game.getResultInfo();
        // cc.log("909090", newData.turn);
        this.lbTrue.newNode.active = newData.turn > data.turn;
        this.lbKill.newNode.active = newData.kill > data.kill;
        this.lbLive.newNode.active = newData.live > data.live;
        cc.sys.localStorage.setItem("word", JSON.stringify(newData));
    },

    doChallenge() {
        game.onclear();
        cc.director.loadScene("game");
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.log("36366366363");
        this.lbTrue = cc.find("resultLayer/turn", this.node).getComponent(cc.Label);
        this.lbKill = cc.find("resultLayer/kill", this.node).getComponent(cc.Label);
        this.lbLive = cc.find("resultLayer/live", this.node).getComponent(cc.Label);
        this.lbTrue.newNode = this.lbTrue.node.getChildByName("new");
        this.lbKill.newNode = this.lbKill.node.getChildByName("new");
        this.lbLive.newNode = this.lbLive.node.getChildByName("new");
        this.liveTime = game.liveTime;
        // let { count, kill, live } = this.gameOver(this.node);
        this.initPanel();


    },

    // update (dt) {},
});
