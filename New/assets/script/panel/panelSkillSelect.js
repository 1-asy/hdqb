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
    refreshData() {
        let childList = this.skillPanel.children;
        let idx = 0;
        let resIcon = g_Res.getRes("icon", "skillIcon.plist");
        for (let sid in this.data) {
            cc.log("=====", this.tbSkillInfo)
            let { res, name, desc } = this.tbSkillInfo[this.data[sid]];
            if (idx >= childList.length) {
                break;
            }
            let child = childList[idx++];
            let skIcon = child.getChildByName("skIcon").getComponent(cc.Sprite);

            let skName = child.getChildByName("skName").getComponent(cc.Label);
            let skDesc = child.getChildByName("skDesc").getComponent(cc.Label);
            skIcon.spriteFrame = resIcon.getSpriteFrame(res);
            skName.string = name;
            skDesc.string = desc;
            child.sid = sid;
        }
    },

    sumW() {
        let sum = 0;
        for (let cid in this.lstUid) {
            let { res, name, desc, w } = this.lstUid[cid];
            sum += w;
        }
        return sum;
    },

    relink() {
        for (let i = 0; i < 3; i++) {
            let sum = this.sumW();
            let countw = 0
            let randomNum = Math.random() * sum;

            for (let cid in this.lstUid) {
                let { res, name, desc, w } = this.lstUid[cid];
                countw += w;
                if (countw >= randomNum) {
                    // cc.log("66666666", cid)
                    this.data[i] = cid;
                    delete this.lstUid[cid]
                    break;
                }
            }
        }
        // cc.log("-----", this.data)

    },

    // LIFE-CYCLE CALLBACKS:
    onSelectSkill(sid) {
        let skID = this.data[sid];
        this.speed = role.getLaunchSpeed();
        let { res, name, desc, w, maxLV } = this.tbSkillInfo[skID];
        cc.log("=====", maxLV);
        if (skID == 1000) {
            if (this.speed > 2) {
                return;
            }
            game.role.script.addSpeedBySkill(0.2);

        }
        else if (skID == 1001) {
            if (this.speed > 2) {
                return;
            }
            game.role.script.addSpeedBySkill(0.2);

        }
        else if (skID == 1002) {
            game.role.script.addAttackBySkill(25);

        }
        else if (skID == 1003) {
            game.role.script.addAttackBySkill(50);

        }
        else if (skID == 1004) {
            if (maxLV < this.launchLV) {
                return;
            }
            this.launchLV += 1;
            game.role.script.addLaunchNum();

        }
        else if (skID == 1005) {
            this.poisonLV += 1;
            game.role.script.addPoison();

        }
        else if (skID == 1006) {
            if (maxLV < this.flameLV) {
                return;
            }
            this.flameLV += 1;
            game.role.script.addFlame();

        }
        else if (skID == 1007) {
            this.crtLV += 1;
            game.role.script.addCrt();

        }
        else if (skID == 1008) {
            if (maxLV < this.critLV) {
                return;
            }
            this.critLV += 1;
            game.role.script.addCrit();

        }
        else if (skID == 1009) {
            if (maxLV < this.arLV) {
                return;
            }
            this.arLV += 1;
            game.role.script.addAttackRange();

        }
        else if (skID == 1010) {
            if (maxLV < this.vapLV) {
                return;
            }
            this.vapLV += 1;
            game.role.script.addVap();

        }
        else if (skID == 1011) {
            if (maxLV < this.rsLV) {
                return;
            }
            this.rsLV += 1;
            game.role.script.addRoleSpeed();

        }
        this.node.destroy();

    },

    onClickButton(event, data) {
        g_Music.playEffect("button");
        let node = event.target;
        if ([0, 1, 2].indexOf(+data) != -1) {
            this.onSelectSkill(node.sid);
        }

    },

    // onLoad () {},

    start() {
        this.speedLV = 0;
        this.attackLV = 0;
        this.launchLV = 0;
        this.poisonLV = 0;
        this.flameLV = 0;
        this.crtLV = 0;
        this.critLV = 0;
        this.arLV = 0;
        this.vapLV = 0;
        this.rsLV = 0;
        this.tbSkillInfo = {
            1000: {
                res: "8001",
                name: "攻速(小)",
                desc: "提高攻击速度",
                w: 20,
                maxLV: null
            },
            1001: {
                res: "8002",
                name: "攻速2(大)",
                desc: "提高攻击速度",
                w: 10,
                maxLV: null
            },
            1002: {
                res: "8003",
                name: "战力(小)",
                desc: "提高攻击",
                w: 20,
                maxLV: null
            },
            1003: {
                res: "8004",
                name: "战力(大)",
                desc: "提高攻击",
                w: 10,
                maxLV: null
            },
            1004: {
                res: "8005",
                name: "弹道",
                desc: "增加弹道",
                w: 10,
                maxLV: 24
            },
            1005: {
                res: "8006",
                name: "毒弹",
                desc: "使怪物持续扣血",
                w: 10,
                maxLV: null
            },
            1006: {
                res: "8007",
                name: "火弹",
                desc: "使怪物持续扣血",
                w: 10,
                maxLV: null
            },
            1007: {
                res: "8016",
                name: "暴击弹",
                desc: "使角色增加暴击概率",
                w: 3,
                maxLV: 2
            },
            1008: {
                res: "8013",
                name: "暴伤弹",
                desc: "使角色增加暴击伤害",
                w: 3,
                maxLV: 2
            },
            1009: {
                res: "8012",
                name: "远程弹",
                desc: "使角色增加攻击范围",
                w: 10,
                maxLV: 3
            },
            1010: {
                res: "8029",
                name: "吸血弹",
                desc: "使角色增加吸血",
                w: 10,
                maxLV: 3
            },
            1011: {
                res: "8017",
                name: " 加速",
                desc: "使角色增加移速",
                w: 20,
                maxLV: 3
            }
        };
        this.data = {};
        this.lstUid = {};

        for (let cid in this.tbSkillInfo) {
            this.lstUid[cid] = this.tbSkillInfo[cid];
        }

        this.skillPanel = cc.find("skillPanel", this.node);
        this.relink();

        this.refreshData();
    },

    // update (dt) {},
});
