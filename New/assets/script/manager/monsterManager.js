
// let MONSTER_LIST = [301, 302, 303];

class CMonsterManager {
    constructor() {
        this.layer = null;
        this.uid = 1000;
        this.monsterPosList = [];
        this.tempPosList = [];
        this.monsterNum = 0;
        this.monsterNumMax = 0;
        this.maxMonsterValume = 0;
        this.monsterList = [];
        this.speed = 3;
        this.monsterData = [];
        this.chickenData = {};
        this.chickenParent = {};
        this.maxChickValume = 5;
        this.lst = [];
        this.monster = 0;
        this.chickNum = 0;
        this.time = 0;
        this.itemData = [];
        this.allExp = 0;
        this.id = 0;
        this.monsterDestroyNum = 0;
        this.flag = null;
        this.chickUid = 0;
    }

    clear() {
        this.monsterData = [];
        this.monsterList = [];
        this.itemData = [];
        this.monsterDestroyNum = 0;
        this.chickenData = {};
    }

    setFlag(flag) {
        this.flag = flag;
    }

    getAllMonster() {
        return this.monsterData;
    }

    getMonsterByUid(uid) {
        return this.monsterData[uid];
    }

    getMonsterNum() {
        return {
            MonsterNum: this.monsterNum,
            MonsterNumMax: this.monsterNumMax
        }
    }
    getMonster() {
        return this.monsterData;
    }

    lauchMonster() {
        let tbRound = g_Res.getRes("table", "tbRound").json;
        let info = tbRound[game.getRound()];

        if (!info) {
            return;
        };
        let sum = 0;
        let lstUid = [];
        for (let cid in info.monsterMap) {
            sum += info.monsterMap[cid];
            lstUid.push(cid);
        }
        lstUid.sort((a, b) => { return info.monsterMap[a] - info.monsterMap[b]; });
        let monsterList = [];
        for (let cid of lstUid) {
            let weight = info.monsterMap[cid];
            let tNum = Math.floor(info.monsterNum * weight / sum);
            while (tNum--) {
                monsterList.push(cid);
            }
        }
        while (monsterList.length < info.monsterNum) {
            monsterList.push(lstUid[lstUid.length - 1])
        }
        monsterList.sort(() => { return Math.random() - 0.5; })
        this.monsterList = monsterList;
        this.maxMonsterValume = info.maxMonsterValume;
        this.monsterNum = 0;
        this.monsterNumMax = info.monsterNum;
    }

    setLayer(layer) {
        // cc.log("-------");
        this.layer = layer;
    }

    setMonsterPosNode(node) {
        let childList = node.children;
        for (let child of childList) {
            this.monsterPosList.push({
                x: child.x,
                y: child.y,
            });
        }
    }

    giveItem() {
        // cc.log("-----", this.itemData);
        // cc.log("888888888", role.attRound ** 2);
        let role = game.getRole();
        for (let id in this.itemData) {
            // cc.log("25525252525525");
            let angle = null;
            let item = this.itemData[id];
            let dx = role.x - item.x;
            let dy = role.y - item.y;
            let dis = dx ** 2 + dy ** 2;

            if (dis <= 300 ** 2) {
                // angle = item.angle;
                if (dy == 0) {
                    dy = 1;
                }
                let angle = Math.atan(dx / dy) * 180 / Math.PI;
                if (dy < 0) {
                    angle += 180;
                }
                item.angle = -angle
                angle += 10;
                item.x += item.speed * Math.sin(angle * Math.PI / 180);
                item.y += item.speed * Math.cos(angle * Math.PI / 180);
            }
            if (dis <= 60 ** 2) {
                delete this.itemData[id];
                item.destroy();
            }
        }
    }


    createChick(node) {
        let curMonsterNum = Object.keys(this.chickenData).length;

        if (curMonsterNum >= this.maxChickValume) {
            return;
        }
        let pre = g_Res.getRes("actor", "mon305");
        let tMonster = cc.instantiate(pre);
        this.layer = game.getMonsterLayer();
        this.layer.addChild(tMonster);
        tMonster.setPosition(node.getPosition());
        tMonster.uid = this.uid++;
        this.chickenParent[tMonster.uid] = node;
        tMonster.speed = 5;
        tMonster.attack = 10;
        tMonster.hp = 100;
        tMonster.parentHp = 5000;
        tMonster.exp = 2;
        tMonster.shield = false;
        tMonster.shieldTime = 0;
        // tMonster.flag = 0;
        g_AI.register(tMonster, 1002);
        g_AI.register(tMonster, 1001);
        g_AI.register(tMonster, 1004);
        this.chickenData[tMonster.uid] = tMonster;
        this.monsterData[tMonster.uid] = tMonster;
    }


    createMonster() {

        if (!this.layer || this.monsterPosList.length == 0) {
            return;
        }
        if (this.monsterList.length == 0) {
            return;
        }
        let curMonsterNum = Object.keys(this.monsterData).length;

        if (curMonsterNum >= this.maxMonsterValume) {
            return;
        }
        this.monsterNum++;

        let shape = this.monsterList.pop();

        let monsterName = "enemy" + shape;
        let pre = g_Res.getRes("actor", monsterName);
        if (pre == null) {
            monsterName = "mon" + shape;
            pre = g_Res.getRes("actor", monsterName);
        }
        let tMonster = cc.instantiate(pre);
        this.layer.addChild(tMonster);
        if (this.tempPosList.length == 0) {
            this.tempPosList = JSON.parse(JSON.stringify(this.monsterPosList));
            this.tempPosList.sort(() => { return Math.random() - 0.5; });
        }
        let pos = this.tempPosList.pop();
        tMonster.x = pos.x;
        tMonster.y = pos.y;
        tMonster.uid = this.uid++;
        let tbMonster = g_Res.getRes("table", "tbMonster").json;
        let { attack, hp, speed, exp } = tbMonster[shape];

        tMonster.speed = speed;
        tMonster.attack = attack;
        tMonster.hp = hp;
        tMonster.exp = exp;
        tMonster.shield = false;
        tMonster.shieldTime = 0;

        g_AI.register(tMonster, 1000);
        if (monsterName == "mon306") {
            g_AI.register(tMonster, 1003);
        }

        this.monsterData[tMonster.uid] = tMonster;

    }


    playAnimForDie(monster) {
        let pos = monster.getPosition();
        let effect = cc.instantiate(g_Res.getRes("item", "bron"));
        let effectlayer = game.getBronLayer();
        effectlayer.addChild(effect);
        effect.setPosition(pos);
        let ani = effect.getComponent(cc.Animation);
        ani.on(cc.Animation.EventType.FINISHED, () => { effect.destroy() });
    }

    audioAced() {
        let resIcon = g_Res.getRes("audio", "aced");;
        g_Audio.play(resIcon);
    }

    onHurt(monster, hurt, type = 1) {
        // this.audioFire();

        let randomNum = Math.random();
        let crt = role.getCrt();
        let crit = role.getCrit();
        role.getHpLb();
        if (randomNum < crt) {
            hurt *= crit;
            type = 6;
        }
        else {
            hurt = hurt;
        }
        if (!monster.shield) {
            monster.hp -= hurt;
            g_Hurt.showHurtLabel(monster, hurt, type);
        }
        else {
            monster.shieldtData.hp -= hurt;
            g_Hurt.showHurtLabel(monster, hurt, 4);
        }
        if (!monster.shield) {
            let rhp = hurt * role.getVap() + role.hp;
            if (rhp >= role.hpMax) {
                role.hp = role.hpMax;
            }
            else {
                role.hp = rhp;
            }
        }



        this.lst.push(monster);
        if (monster.hp <= 0) {
            if (monster.uid in this.chickenData) {
                parent = this.chickenParent[monster.uid]
                if (parent.hp >= 0) {
                    hurt = monster.parentHp * 0.1;
                    g_Hurt.showHurtLabel(parent, hurt, 5);
                    parent.hp -= monster.parentHp * 0.1;


                }

                delete this.chickenData[monster.uid];
            }
            g_Music.playEffect("die");
            let pos = monster.getPosition();
            let itemNode = cc.instantiate(g_Res.getRes("item", "diamond"));
            let layer = game.getItemLayer();
            layer.addChild(itemNode);
            itemNode.setPosition(pos);
            itemNode.angle = monster.angle;
            itemNode.speed = 7;
            this.itemData[this.id] = itemNode;
            this.id += 1;
            cc.log("777777", this.monsterData[monster.uid])
            let Exp = this.monsterData[monster.uid].exp

            if (Exp) {
                this.allExp += this.monsterData[monster.uid].exp;
            }

            this.playAnimForDie(monster);
            delete this.monsterData[monster.uid];
            g_AI.delAI(monster);
            monster.destroy();
            this.monsterDestroyNum += 1;
        }
    }



    update(dt) {
        this.giveItem();
        this.createMonster();
    }
}

window.g_Monster = new CMonsterManager();