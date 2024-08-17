// let aiobj = null;
class CAI1002 {
    constructor() {
        this.mindir = 80;
        this.speed = 10;
        this.hurt = 5;
        this.launchTime = 0;
        this.bulletData = {};
        this.bulletData1 = {};
        this.bulletID = 1000;
        this.tempBulletData = {};
        this.chickLaunchData = {};
    }

    doLaunch(node, dt) {

        let r = game.getRole();
        node.life -= dt;

        if (dy == 0) {
            dy = 1;
        }


        let angle = node.angle;
        node.bullet.x += this.speed * Math.sin(angle * Math.PI / 180);
        node.bullet.y += this.speed * Math.cos(angle * Math.PI / 180);
        if (node.life < 0) {
            node.bullet.destroy();
            delete this.bulletData[node.bullet.bulletID];
            return;
        }
        let dx = r.x - node.bullet.x;
        let dy = r.y - node.bullet.y;

        if (dx * dx + dy * dy < this.mindir ** 2) {
            role.onHurt(5);
            node.bullet.destroy();
            delete this.bulletData[node.bullet.bulletID];
            return;
        }

    }


    run(node, dt) {
        this.layer = game.getMonBulletLayer();
        if (!this.layer) {
            return;
        }

        this.launchTime += dt;

        if (this.launchTime > 1) {
            let preBullet = g_Res.getRes("bullet", "wudi");
            let bulletNode = cc.instantiate(preBullet);
            this.layer.addChild(bulletNode);
            bulletNode.setPosition(node.getPosition());
            let role = game.getRole();
            let dx = role.x - bulletNode.x;
            let dy = role.y - bulletNode.y;

            if (dx * dx + dy * dy < this.mindir ** 2) {
                return;
            }
            if (dy == 0) {
                dy = 1;
            }
            let angle = Math.atan(dx / dy) * 180 / Math.PI;
            if (dy < 0) {
                angle += 180;
            }
            bulletNode.angle = angle;

            bulletNode.bulletID = this.bulletID++;
            this.bulletData[bulletNode.bulletID] = {
                id: this.bulletID,
                bullet: bulletNode,
                angle: bulletNode.angle,
                life: 5,
            };
            this.bulletData1[bulletNode.bulletID] = {
                id: this.bulletID,
                bullet: bulletNode,
                angle: bulletNode.angle,
                life: 5,
            };
            this.launchTime -= 1;

        }
        for (let bulletID in this.bulletData1) {
            this.doLaunch(this.bulletData1[bulletID], dt);

        }
        this.bulletData1 = {};
        for (let bulletID in this.bulletData) {
            this.bulletData1[bulletID] = this.bulletData[bulletID];

        }

        if (role.hp <= 0) {
            return;
        }
    }


}

module.exports = {
    createAI() {
        return new CAI1002();
    }
};


