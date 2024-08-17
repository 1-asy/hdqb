class CBulletManager {
    constructor() {
        this.layer = null;
        this.bulletID = 1000;
        this.bulletData = {};

    }

    setLayer(layer) {
        this.layer = layer;
    }

    clear() {
        this.layer = null;
        this.bulletID = 1000;
        this.bulletData = {};
    }


    launch() {
        let launchNum = role.getLaunchNum();

        let angle = 0;
        let flag;
        if (launchNum & 1) {
            angle = 0
            flag = 1;
        }

        else {
            flag = -1
            angle = -7.5;
        }
        for (let i = 0; i < launchNum; i++) {
            let tAngle = angle + (15 * Math.floor((i + 1) / 2) * (i & 1 ? -flag : flag));
            this.doLaunch(tAngle);
        }
    }

    doLaunch(angle) {
        if (!this.layer) {
            return;
        }

        let role = game.getRole();
        let resName = "bullet" + game.getBulletType();
        let preBullet = g_Res.getRes("bullet", resName);
        let bulletNode = cc.instantiate(preBullet);
        this.layer.addChild(bulletNode);
        bulletNode.angle = angle + role.script.getBodyDir();
        bulletNode.setPosition(role.getPosition());
        bulletNode.attack = role.script.getAttack();
        bulletNode.bulletID = this.bulletID++;
        bulletNode.y += 50;
        this.bulletData[bulletNode.bulletID] = {
            bullet: bulletNode,
            angle: bulletNode.angle,
            speed: game.getBulletSpeed(),
            life: 5,
        };
        g_Music.playEffect("fire105");
    }

    onCollisionEnter(monster, bullet) {
        let bulletID = bullet.bulletID;
        g_Monster.onHurt(monster, bullet.attack);

        if (role.poison) {
            g_Buff.addPoisonBuff(monster.uid);
        }
        if (role.flame) {
            g_Buff.addFlameBuff(monster.uid);
        }
        bullet.destroy();
        delete this.bulletData[bulletID];
    }

    update(dt) {
        let tempBulletData = {};
        for (let bulletID in this.bulletData) {
            let info = this.bulletData[bulletID];
            let angle = info.angle;
            info.bullet.x += info.speed * Math.sin(-angle * Math.PI / 180);
            info.bullet.y += info.speed * Math.cos(-angle * Math.PI / 180);

            info.life -= dt;
            if (info.life < 0) {
                info.bullet.destroy();
            }
            else {
                tempBulletData[bulletID] = info;
            }
        }
        this.bulletData = tempBulletData;
    }
}

window.g_Bullet = new CBulletManager();