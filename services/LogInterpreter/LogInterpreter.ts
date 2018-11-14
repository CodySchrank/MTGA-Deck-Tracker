import { SaveDeckResource } from './../../resources/Deck/SaveDeckResource';
import { ILogReader } from './../LogReader/ILogReader';
import { BasicService } from './../BasicService/BasicService';
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

    constructor(@inject(TYPES.ILogReader) logReader: ILogReader) {
        this.logReader = logReader;  //this is the deck service's log reader
    }

    public getUserId(): Promise<string> {
        return new Promise( (resolve, reject) => {
            return this.interpret<any>({}, this.userIdString).then( (logObj) => {
                console.log(`Updated User Id`);
                const id = logObj.params.payloadObject.playerId;

                if(id != null) {
                    this.userId = id;
                }

                console.log(`User Id: ${this.userId}`);

                resolve(this.userId);
            }).catch( (err) => {
                console.log("Could not update deck list");
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

    private interpret<T>(ref: T, include: string): Promise<T> {
        return new Promise( async (resolve, reject) => {
            await this.logReader.getParsedLog()

            const indecies = [];

            this.logReader.log.forEach((val, index) => {
                if (val.includes(include)) {
                    indecies.push(index);
                }
            })

            //Get most recent deck list, if it exists
            if(indecies.length != 0 ) {
                try {
                    ref = this.logReader.parseBlock<T>(indecies[indecies.length - 1]);
                } catch(e) {
                    try {
                        ref = this.logReader.parseBlock<T>(indecies[indecies.length - 2]);
                    } catch(e) {
                        reject(e);
                    }
                }
            }

            this.logReader.clearLog();

            resolve(ref);
        })
    }

}
