// let aiobj = null;
class CAI1003 {
    constructor() {
        this.time = 0;
    }


    run(node, dt) {
        this.time += dt;
        if (this.time > 1) {
            g_Monster.createChick(node);
            this.time -= 1;
        }

    }


}

module.exports = {
    createAI() {
        return new CAI1003();
    }
};


