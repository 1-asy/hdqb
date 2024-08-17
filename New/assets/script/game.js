// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let EXP_LEVEL = [3, 5, 8, 12, 20, 20, 40, 60]

cc.Class({
    extends: cc.Component,

    properties: {
        gamePanel: cc.Node,
        rockerBg: cc.Node,
        role: cc.Node,
        monsterLayer: cc.Node,
        clickLayer: cc.Node,
        monsterPosNode: cc.Node,
        bulletLayer: cc.Node,
        monBulletLayer: cc.Node,
        black: cc.Node,
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

    getBlackLayer() {
        return this.monsterLayer;
    },

    getMonsterLayer() {
        return this.monsterLayer;
    },

    getMonBulletLayer() {
        return this.monBulletLayer;
    },

    getRole() {
        return this.role;
    },
    getBulletType() {
        return this.bulletType;
    },
    getBulletSpeed() {
        return this.bulletSpeed;
    },

    getRound() {
        return this.round;
    },

    checkRound() {
        let { MonsterNum, MonsterNumMax } = g_Monster.getMonsterNum();
        let allMonster = g_Monster.getAllMonster();
        let curMonsterNum = Object.keys(allMonster).length;
        if (MonsterNum == MonsterNumMax && curMonsterNum == 0) {
            this.pause = true;
            let pre = g_Res.getRes("ui", "panelSkillSelect");
            // cc.log(pre)
            let panel = cc.instantiate(pre);
            this.UILayer.addChild(panel);
        }
    },

    nextRound() {
        this.round++;
        this.pause = false;
        role.setAttackCircle();
        g_Monster.lauchMonster();
    },

    refreshUILv() {
        let exp = g_Monster.allExp;

        let expNum = EXP_LEVEL[this.lv];
        // cc.log(">>>>>>", exp);
        if (exp > expNum) {
            this.lv++;
            exp -= expNum;

        }
        this.exp.progress = exp / EXP_LEVEL[this.lv];
        this.lbExp.string = "LV:" + this.lv;
    },

    getResultInfo() {
        // cc.log("iiiiiii", this.round);
        return {
            turn: this.round,
            kill: g_Monster.monsterDestroyNum,
            live: this.liveTime,
        }
    },

    onclear() {
        g_Hurt.clear();
        g_Monster.clear();
        g_AI.clear();
        g_Bullet.clear();
    },

    getItemLayer() {
        return this.itemLayer;
    },

    getBronLayer() {
        return this.bronLayer;
    },

    getUILayer() {
        return this.UILayer;
    },

    refreshUI() {
        let { MonsterNum, MonsterNumMax } = g_Monster.getMonsterNum();
        this.lbRound.string = "ROUND: " + this.round;
        this.lbMonsterNum.string = "怪物：" + MonsterNum + "/" + MonsterNumMax;
    },

    onTouchStart(event) {
        let pos = event.getLocation();
        let x = pos.x - cc.winSize.width / 2;
        let y = pos.y - cc.winSize.height / 2;
        this.rockerBg.x = x;
        this.rockerBg.y = y;
        // cc.log(x, y);
        this.rockerBg.opacity = 255;
    },
    onTouchMove(event) {
        let pos = event.getLocation();
        pos = this.rockerBg.convertToNodeSpaceAR(pos);
        let Z = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        let z = this.rockerBg.width / 2;
        let x = pos.x;
        let y = pos.y;
        if (Z > z) {
            x = pos.x * z / Z;
            y = pos.y * z / Z;
        }

        this.rockerItem.setPosition(x, y);
        if (y == 0) {
            y = 1;
        }
        let angle = Math.atan(x / y) * 180 / Math.PI;
        if (y < 0) {
            angle += 180;
        }
        this.role.script.setMoveDirection(angle);


    },
    onTouchEnd(event) {
        this.rockerBg.opacity = 100;
        this.rockerBg.setPosition(0, -400);
        this.rockerItem.setPosition(0, 0);
        this.role.script.stopMove()
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadRes(
            "texture/skill/6001",
            cc.SpriteFrame,
            (err, data) => {
                if (err) {
                    cc.log(err);
                    return;
                }
                let tNode = new cc.Node();
                this.gamePanel.addChild(tNode);
                let sp = tNode.addComponent(cc.Sprite);
                sp.spriteFrame = data;
            },
        );
        let cm = cc.director.getCollisionManager();
        cm.enabled = true;
    },

    // audioFire() {
    //     let resIcon = g_Res.getRes("audio", "go");;
    //     g_Audio.play(resIcon);
    // },

    start() {
        // this.audioFire();
        // this.black.opacity = 255;
        window.game = this;
        g_Music.playEffect("go");
        this.rockerBg.opacity = 100;
        this.bulletType = 1;
        this.bulletSpeed = 15;
        this.bulletLayer.x = this.role.x;
        this.bulletLayer.y = this.role.y;
        this.round = 0;
        this.lv = 0;
        this.pause = true;
        this.liveTime = 0;
        this.rockerItem = this.rockerBg.getChildByName("rockerItem");
        this.lbRound = cc.find("Canvas/UILary/top/lbRound").getComponent(cc.Label);
        this.lbExp = cc.find("Canvas/UILary/top/lbExp").getComponent(cc.Label);
        this.lbMonsterNum = cc.find("Canvas/UILary/top/lbMonsterNum").getComponent(cc.Label);
        this.UILayer = cc.find("Canvas/UILary");
        this.bronLayer = cc.find("Canvas/gamePanel/bronLayer");
        this.itemLayer = cc.find("Canvas/gamePanel/itemLayer");
        this.gameoverLayer = cc.find("Canvas/gameoverLayer");
        this.exp = cc.find("top/Exp/bar_2", this.UILayer).getComponent(cc.ProgressBar);
        this.exp.progress = 0;
        // cc.log("777777777", this.exp);
        // this.monsterItem = this.monsterLayer.getChildByName("rockerItem");
        this.clickLayer.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.clickLayer.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.clickLayer.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        g_Hurt.setLayer(this.monsterLayer);
        g_Monster.setLayer(this.monsterLayer);
        g_Monster.setMonsterPosNode(this.monsterPosNode);
        g_Bullet.setLayer(this.bulletLayer);
        g_Music.playBGM("bgm");
        this.nextRound();
    },

    update(dt) {
        this.dt = dt;
        this.liveTime += dt;
        if (this.pause) {
            return;
        }
        g_Hurt.update(dt);
        g_Monster.update(dt);
        g_AI.update(dt);
        g_Bullet.update(dt);
        g_Buff.update(dt);
        this.refreshUI();
        this.refreshUILv();
        this.checkRound();
    },
});
