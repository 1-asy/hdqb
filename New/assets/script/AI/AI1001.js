// let aiobj = null;
class CAI1001 {
    constructor() {
        this.mindir = 600;
    }
    run(node, dt) {
        let role = game.getRole();
        let dx = role.x - node.x;
        let dy = role.y - node.y;

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
        node.angle = -angle
        angle += 10;

        node.x += node.speed * Math.sin(angle * Math.PI / 180);
        node.y += node.speed * Math.cos(angle * Math.PI / 180);


    }
}

module.exports = {
    createAI() {
        return new CAI1001();
    }
};


