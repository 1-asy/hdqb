let AI_List = {
    1000: require("./../AI/AI1000"),
    1001: require("./../AI/AI1001"),
    1002: require("./../AI/AI1002"),
    1003: require("./../AI/AI1003"),
    1004: require("./../AI/AI1004"),
};

class CAIManager {
    constructor() {
        this.data = {};
    }
    register(node, aiID) {
        if (!this.data[aiID]) {
            this.data[aiID] = {
                aiInstance: AI_List[aiID].createAI(),
                objList: [],
            };
        }
        this.data[aiID].objList.push(node);
    }

    clear() {
        this.data = {}
    }

    delAI(node, aiID = null) {
        if (aiID == null) {
            for (let iID in this.data) {
                let objList = this.data[iID].objList;
                let idx = objList.indexOf(node);
                if (idx != -1) {
                    objList.splice(idx, 1);
                }
            }
        }
        else { }
    }

    update(dt) {

        for (let aiID in this.data) {
            let info = this.data[aiID];
            for (let node of info.objList) {
                info.aiInstance.run(node, dt);
            }

        }
    }
}

window.g_AI = new CAIManager();