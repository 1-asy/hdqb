let TABLE = {
    actor: {
        path: "actor",
        type: cc.Prefab,
        list: ["enemy301", "enemy302", "enemy303", "mon305", "mon306"],
    },
    audio: {
        path: "audio",
        type: cc.AudioClip,
        list: ["bgm", "boom", "fire105", "fire1", "go", "aced"],
    },
    bullet: {
        path: "bullet",
        type: cc.Prefab,
        list: ["bullet1", "wudi"],
    },
    icon: {
        path: "icon",
        type: cc.SpriteAtlas,
        list: ["skillIcon"],
    },
    ui: {
        path: "ui",
        type: cc.Prefab,
        list: ["panelSkillSelect"],
    },
    buff: {
        path: "buff",
        type: cc.Prefab,
        list: ["poisonBuff", "fireBuff"],
    },
    table: {
        path: "table",
        type: cc.JsonAsset,
        list: ["tbMonster", "tbRound"],

    },
    item: {
        path: "prefab",
        type: cc.Prefab,
        list: ["diamond", "bron", "shield"],
    },
    gameover: {
        path: "GAMEOVER",
        type: cc.Prefab,
        list: ["gameOver"],
    }
}

class CRes {
    constructor() {
        this.data = {
            // "actor": {
            //     "enemy303": prefab
            // }
        }
        this.resNum = -1;
        this.allRes = 0;
        // this.maxResNum = 0;
    }

    // getResNum() {
    //     return this.resNum;
    // }

    getLoadNum() {
        return this.resNum;
    }

    doLoad() {
        for (let key in TABLE) {
            // cc.log(TABLE.length);
            this.allRes++;
            this.load(key);
            this.resNum++;
        }
    }

    load(key) {
        this.data[key] = {};
        let info = TABLE[key];
        if (info.list.length) {
            this, this.loadRes(key);
        }
        else {
            this.loadResDir(key);
        }
    }
    loadResDir(key) {
        let info = TABLE[key];
        cc.loader.loadResDir(
            info.path,
            info.type,
            (err, resList) => {
                this.resNum--;
                if (err) {
                    cc.log(err);
                    return;
                }
                for (let res of resList) {
                    this.data[key][res.name] = res;
                }
            }
        );
    }
    loadRes(key) {
        let info = TABLE[key];
        let fileList = [];
        for (let fName of info.list) {
            fileList.push(info.path + "/" + fName);

        }
        // for (let fDir of resList) {
        //     cc.loader.loadRes(
        //         fDir,
        //         info.type,
        //         (err, res) => {
        //             if (err) {
        //                 cc.log(err);
        //                 return;
        //             }
        //             this.data[key][res.name] = res;
        //         },
        //     );
        // }

        let func = () => {
            let tempList = fileList.splice(0, 5);
            cc.loader.loadResArray(
                tempList,
                info.type,
                (err, resList) => {
                    if (fileList.length > 0) {
                        func();
                    }
                    else {
                        this.resNum--;
                    }
                    if (err) {
                        cc.log(err);
                        return;
                    }
                    for (let res of resList) {
                        this.data[key][res.name] = res;
                    }
                }
            )
        }
        func();
    }


    getRes(key, name) {
        if (this.data[key] && this.data[key][name]) {
            return this.data[key][name]
        }
        else {
            return null;
        }
    }
}

window.g_Res = new CRes();

