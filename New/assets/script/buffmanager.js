window.g_Buff = new class CBuffManager {
    constructor() {
        this.data = {};
        this.poisonTime = 3;
        this.flameTime = 3;
    }

    addPoisonBuff(uid) {
        this.data[uid] = this.data[uid] || {
            time: this.poisonTime,
            interval: 0,
            fps: 1,
        };
        cc.log("222222")
        this.data[uid].time = this.poisonTime;
        let monster = g_Monster.getMonsterByUid(uid);
        if (!monster) {
            return;
        }
        if (!monster.pBuff) {
            let pBuff = cc.instantiate(g_Res.getRes("buff", "poisonBuff"));
            monster.addChild(pBuff);
            monster.pBuff = pBuff;
        }
    }

    addFlameBuff(uid) {
        this.data[uid] = this.data[uid] || {
            time: this.flameTime,
            interval: 0,
            fps: 1,
        };
        this.data[uid].time = this.flameTime;
        let monster = g_Monster.getMonsterByUid(uid);
        if (!monster) {
            return;
        }
        if (!monster.fBuff) {
            let fBuff = cc.instantiate(g_Res.getRes("buff", "fireBuff"));
            monster.addChild(fBuff);
            monster.fBuff = fBuff;
        }
    }

    calPoisonHurt(monster) {
        let poison = game.role.script.getPoison();
        let attack = game.role.script.getAttack();
        let Phurt = Math.ceil(poison * 0.2 * attack + 5 * poison);


        g_Monster.onHurt(monster, Phurt, 2);
    }

    calflameHurt(monster) {
        let flame = role.getFlame();
        let attack = game.role.script.getAttack();;
        let Fhurt = Math.ceil(flame * 0.2 * attack + 5 * flame);
        // 
        g_Monster.onHurt(monster, Fhurt, 3);
    }

    update(dt) {
        let tData = {};
        for (let uid in this.data) {
            let info = this.data[uid];
            let monster = g_Monster.getMonsterByUid(uid);
            if (!monster) {
                continue;
            }
            info.interval += dt;
            if (info.interval >= info.fps) {
                info.interval -= info.fps;
                if (monster.pBuff) {
                    this.calPoisonHurt(monster);
                }
                if (monster.fBuff) {
                    this.calflameHurt(monster)
                }

            }
            info.time -= dt;
            if (info.time < 0) {
                if (monster.pBuff) {
                    monster.pBuff.destroy();
                    monster.pBuff = null;
                    cc.log("999999999", monster.pBuff)
                }
                if (monster.fBuff) {
                    monster.fBuff.destroy();
                    monster.fBuff = null;
                }

                continue;
            }

            tData[uid] = this.data[uid];
        }
        this.data = tData;
    }
}