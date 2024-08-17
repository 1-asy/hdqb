// let aiobj = null;
class CAI1004 {
    constructor() {
        this.launchTime = 10;
        this.time = 0;
        this.shieldID = 0;
        this.flag = 0;
        this.blackTime = 0;
        this.blackLayer = cc.find("Canvas/UILary/black");
    }
    run(node, dt) {
        this.layer = game.getMonsterLayer();
        this.layer = game.getMonBulletLayer();
        if (this.blackLayer.opacity == 255) {
            this.blackTime += dt;
        }
        if (this.blackTime > 1) {
            this.blackLayer.opacity = 0;
            this.blackTime -= 1;
        }
        if (!this.layer) {
            return;
        }

        this.launchTime += dt;
        if (this.launchTime > 10 && node.shield == false) {
            cc.log(g_Monster.getAllMonster())
            let preShield = g_Res.getRes("item", "shield");
            let shieldNode = cc.instantiate(preShield);
            node.addChild(shieldNode);
            node.shieldtData = {
                hp: node.hp * 0.5,
                life: 20,
            };
            node.shield = true;
            this.launchTime -= 10;
        }
        if (node.shield == true) {

            node.shieldtData.life -= dt;
            if (node.shieldtData.life <= 0) {
                this.blackLayer.opacity = 255;

            }
            if (node.shieldtData.life <= 0 || node.shieldtData.hp <= 0) {
                let preShield = node.getChildByName("shield");
                preShield.destroy();
                node.shield = false;
                node.shieldtData = {};





            }
        }
    }
}

module.exports = {
    createAI() {
        return new CAI1004();
    }
};


