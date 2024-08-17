window.g_Hurt = new class CHurtManager {
    constructor() {
        this.monsterLayer = null;
        this.hurtNode = null;
        this.data = [];
        this.speed = 3;
    }



    setLayer(layer) {
        this.layer = layer;
        this.hurtNode = layer.getChildByName("lbHurt");
        this.hurtNode.removeFromParent();
    }

    clear() {
        this.monsterLayer = null;
        this.hurtNode = null;
        this.data = [];
    }

    showHurtLabel(obj, hurt, type) {
        let node = cc.instantiate(this.hurtNode);
        this.layer.addChild(node);
        node.getComponent(cc.Label).string = Math.abs(hurt);
        cc.log("666666", node)
        node.setPosition(cc.v2(0, 50).add(obj.getPosition()));
        if (type == 1) {
            node.color = cc.color(255, 255, 255);
        }
        else if (type == 2) {
            node.color = cc.color(0, 255, 51);
        }
        else if (type == 3) {
            node.color = cc.color(255, 0, 0);
        }
        else if (type == 4) {
            node.color = cc.color(245, 150, 150);
        }
        else if (type == 5) {
            node.color = cc.color(255, 255, 0);
        }
        else if (type == 6) {
            node.color = cc.color(255, 0, 0);
            node.width = 132;
            node.height = 100;
        }
        this.data.push({
            node,
            time: 0.2,
        });
    }
    update(dt) {
        let tempLst = [];
        for (let info of this.data) {
            info.node.y += this.speed;
            info.time -= dt;
            if (info.time > 0) {
                tempLst.push(info);
            }
            else {
                info.node.destroy();
            }
        }
        this.data = tempLst;
    }
}