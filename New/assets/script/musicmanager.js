window.g_Music = new class CMusicManager {
    constructor() { }

    playEffect(name) {
        let res = g_Res.getRes("audio", name);
        if (res) {
            cc.audioEngine.playEffect(res);
        }
    }
    playBGM(name) {
        let res = g_Res.getRes("audio", name);
        if (res) {
            cc.audioEngine.playMusic(res, true);
        }
    }
}