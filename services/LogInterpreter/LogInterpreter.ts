import { ILogReader } from './../LogReader/ILogReader';
import { Deck } from '../../models/Deck/Deck';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../inject/TYPES';
import { ILogInterpreter } from './ILogInterpreter';

@injectable()
export class LogInterpreter implements ILogInterpreter {
    public decks: Deck[] = [];
    public userId: string = "";

    private logReader: ILogReader;
    private deckListsString = "<== Deck.GetDeckLists";
    private userIdString = "==> Log.Info";

    private hashSet = [
        this.deckListsString,
        this.userIdString
    ];

    constructor(@inject(TYPES.ILogReader) logReader: ILogReader) {
        this.logReader = logReader;
    }

    public transaction(cb: Function) {
        setTimeout(async () => {
            console.log("Start Transaction")
            await this.startTransaction()

            await cb();

            await this.endTransaction();
            console.log("End Transaction")
        }, 1);
    }

    public getUserId(): Promise<string> {
        return new Promise( (resolve, reject) => {
            return this.interpret<any>({}, this.userIdString).then( (logObj) => {
                const id = logObj.params.payloadObject.playerId;

                if(id != null) {
                    this.userId = id;
                }

                console.log(`Updated User Id ${this.userId}`);

                resolve(this.userId);
            }).catch( (err) => {
                console.log("Could not update user id");
                reject();
            })
        })
    }

    public getLocalDecks(): Promise<Deck[]> {
        return new Promise( (resolve, reject) => {
            return this.interpret<Deck[]>(this.decks, this.deckListsString).then( (decks) => {
                console.log(`Updated Deck List ${decks.length}`);
                resolve(decks);
            }).catch( (err) => {
                console.log("Could not update deck list");
                reject();
            })
        })
    }

    private async startTransaction() {
        await this.logReader.getParsedLog(this.hashSet);
    }

    private async endTransaction() {
        await this.logReader.clear();
    }

    private interpret<T>(ref: T, include: string): Promise<T> {
        return new Promise( async (resolve, reject) => {
            try {
                ref = this.logReader.parseBlock<T>(this.logReader.map.get(include));
            } catch(e) {
                console.error(e);
                reject(e)
            }

            resolve(ref);
        })
    }

}
