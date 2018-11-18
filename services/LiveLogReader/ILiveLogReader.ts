export interface ILiveLogReader {
    log: string[];
    map: HashMap<string, number>;
    liveIndex: number;
    startGameSession();
    endGameSession();
}
