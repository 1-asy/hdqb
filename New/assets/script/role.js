// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bodyNode: cc.Node,
        arrowNode: cc.Node,
        attackCircle: cc.Node,

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
    setMoveDirection(dir) {
        this.moveDir = dir;
    },
    stopMove() {
        this.moveDir = null;
        this.arrowNode.angle = 0;
        // this.role.angle = this.moveDir
    },

    getBodyDir() {
        return this.bodyNode.angle;
    },

    getAttack() {
        return this.attack;
    },

    getCrit() {
        return this.crit;
    },

    addAttackBySkill(attack_num) {
        this.attack += attack_num;
        game.nextRound();
    },

    addPoison() {
        this.poison++;
        game.nextRound();
    },

    addFlame() {
        this.flame++;
        game.nextRound();
    },

    addCrt() {
        this.crt += 0.2;
        game.nextRound();
    },

    addCrit() {
        this.crit += 0.5;
        game.nextRound();
    },

    addAttackRange() {
        this.attRound += 100;
        game.nextRound();
    },

    addVap() {
        this.vp += 0.05;
        game.nextRound();
    },

    addRoleSpeed() {
        this.speed *= 1.2;
        game.nextRound();
    },

    getPoison() {
        return this.poison;
    },

    getFlame() {
        return this.flame;
    },

    getCrt() {
        return this.crt;
    },

    getCrit() {
        return this.crit;
    },

    getHp() {
        return this.hp;
    },

    getVap() {
        return this.vp;
    },

    getLaunchSpeed() {
        return this.launchSpeed;
    },

    getHpLb() {
        this.hp = Math.floor(this.hp);
        this.lbHp.string = `${this.hp}/${this.hpMax}`;
        this.hpItem.width = this.hpItem.initw * this.hp / this.hpMax;
    },

    setAttackCircle() {
        this.attackCircle.width = this.attRound * 2;
        this.attackCircle.height = this.attRound * 2;
    },

    syncMove() {
        // this.role.angle = -this.moveDir;
        // if (this.role.x<360 && this.role.x>-360){
        //     if (this.role.y<720 && this.role.y>-720){
        //         if (this.moveDir<0 && this.moveDir>-180){
        //             this.role.x +=Math.abs(Math.cos(this.moveDir)*this.speed);
        //         }
        //         else{
        //             if(this.moveDir != null){
        //                 this.role.x -=Math.abs(Math.cos(this.moveDir)*this.speed);
        //             }    
        //         }
        //         if (this.moveDir<-90 && this.moveDir>-270){
        //             this.role.y -=Math.abs(Math.sin(this.moveDir)*this.speed);
        //         }
        //         if (this.moveDir<90 && this.moveDir>-90){
        //             this.role.y +=Math.abs(Math.sin(this.moveDir)*this.speed);
        //         }

        //     }

        // }
        if (this.moveDir == null) {
            return;
        }
        let dx = 0;
        let dy = 0;
        let anglelHD = this.moveDir * Math.PI / 180;
        dx = this.speed * Math.sin(anglelHD) * 5;
        dy = this.speed * Math.cos(anglelHD) * 5;
        this.node.x += dx;
        this.node.y += dy;
        this.arrowNode.angle = -this.moveDir
        if (this.node.x < -1120) {
            this.node.x = -1120;
        }

        if (this.node.x > 1120) {
            this.node.x = 1120;
        }

        if (this.node.y < -1600) {
            this.node.y = -1600;
        }

        if (this.node.y > 1700) {
            this.node.y = 1700;
        }
    },

    addSpeedBySkill(speed) {
        this.launchSpRatio += speed;
        this.launchTime = 0;
        if (this.launchSpRatio >= 2) {
            this.launchSpRatio = 2;
        }
        // cc.log("999999999", this.launchSpRatio)
        game.nextRound();
    },

    getLaunchNum() {
        return this.launchNum;
    },

    addLaunchNum() {
        this.launchNum += 1;
        game.nextRound();
    },


    getBulletType() {
        return this.bulletType;
    },


    // LIFE-CYCLE CALLBACKS:
    doLaunch(dt) {
        this.launchTime += dt;
        if (this.launchTime < this.launchSpeed / this.launchSpRatio) {
            return;
        }
        this.launchTime -= this.launchSpeed / this.launchSpRatio;
        if (!this.FightGoal) {
            return;
        }


        g_Bullet.launch();
    },

    onCollisionEnter(other, self) {
        if (other.node.group == "decorate") {
            other.node.opacity = 150;
        }
        else if (other.node.group == "monsterLayer") {
            this.hurtList[other.node.uid] = {
                time: 1,
                cd: 1,
            };
        }
    },

    onCollisionExit(other, self) {
        if (other.node.group == "decorate") {
            other.node.opacity = 255;
        }
        else if (other.node.group == "monsterLayer") {
            delete this.hurtList[other.node.uid];
        }
    },

    checkMonsterAttack(dt) {
        this.protectTime -= dt;
        this.protectItem.fillRange = this.protectTime / this.protectByHurt;
        if (this.protectTime > 0) {
            return;
        }
        let tLst = {};
        let curHurt = null;
        // cc.log(this.hurtList);
        for (let uid in this.hurtList) {
            let info = this.hurtList[uid];
            let monster = g_Monster.getMonsterByUid(uid);
            if (!monster) {
                continue;
            }
            if (curHurt == null || curHurt < monster.attack) {
                curHurt = monster.attack;
            }
            // delete this.hurtList[uid]
            tLst[uid] = info;
        }
        this.hurtList = tLst;
        if (curHurt != null && this.hp > 0) {
            this.onHurt(curHurt);
            this.protectTime = this.protectByHurt;
        }
    },

    onHurt(hurt) {
        if (this.hp < hurt) {
            hurt = this.hp;
        }
        g_Hurt.showHurtLabel(this.node, hurt, 3);
        this.hp -= hurt;
        this.hp = Math.floor(this.hp);
        this.lbHp.string = `${this.hp}/${this.hpMax}`;
        this.hpItem.width = this.hpItem.initw * this.hp / this.hpMax;
        if (this.hp <= 0) {
            game.pause = true;
            let pre = g_Res.getRes("gameover", "gameOver");
            let panel = cc.instantiate(pre);
            let UILayer = game.getUILayer();
            UILayer.addChild(panel);
        }
    },

    onLoad() {
        this.node.script = this;
    },


    syncBodyDirection(angle) {
        if (this.FightGoal) {
            let monster = g_Monster.getMonsterByUid(this.FightGoal);
            if (!monster) {
                return;
            }

            this.bodyNode.angle = angle;
        }
        else {
            this.bodyNode.angle = this.arrowNode.angle;
        }
    },

    checkEnemy() {
        let allMonster = g_Monster.getAllMonster();
        let minDis = null;
        let goal = null;
        let angle = 0;
        for (let uid in allMonster) {
            let monster = allMonster[uid];
            let dis = (monster.x - this.node.x) ** 2 + (monster.y - this.node.y) ** 2;
            if (minDis == null || dis < minDis) {
                minDis = dis;
                goal = uid;
            }
        }

        if (minDis && minDis <= this.attRound ** 2) {
            this.FightGoal = goal;
            let dx = allMonster[goal].x - this.node.x;
            let dy = allMonster[goal].y - this.node.y;

            if (dy == 0) {
                dy = 1;
            }
            angle = Math.atan(dx / dy) * 180 / Math.PI;
            if (dy < 0) {
                angle += 180;
            }

        }


        else {
            this.FightGoal = null;
        }
        return -angle;
    },

    start() {
        // this.role.on(cc.Node.EventType.TOUCH_START,()=>{
        //     cc.log(121313131)
        // });
        window.role = this;
        this.moveDir = null;
        this.FightGoal = null;
        this.attRound = 300;
        this.diamondRound = 60;
        this.launchSpeed = 0.1;
        this.launchSpRatio = 1;
        this.launchTime = 0;
        this.attack = 50;
        this._time = 0;
        this.launchNum = 1;
        this.hpMax = 500;
        // this.bulletType = 0;
        this.poison = 0;
        this.flame = 0;
        this.speed = 2;
        this.hp = this.hpMax;
        this.crit = 1.5;
        this.crt = 0.8;
        this.vp = 0;
        this.hurtList = {};
        this.protectTime = 0;
        this.protectByHurt = 0.1;
        this.hpItem = cc.find("hpBg/hpItem", this.node);
        this.hpItem.initw = this.hpItem.width;
        this.lbHp = cc.find("hpBg/hp", this.node).getComponent(cc.Label);
        this.protectItem = cc.find("protect/protectItem", this.node).getComponent(cc.Sprite);
        this.protectItem.fillRange = 0;
    },

    update(dt) {
        if (game.pause) {
            return;
        }
        this.syncMove();
        this.syncBodyDirection(this.checkEnemy());
        this.doLaunch(dt);
        this.checkMonsterAttack(dt);

    },
});
