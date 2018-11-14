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
    private logReader: ILogReader;

    private deckListsString = "<== Deck.GetDeckLists";
    private userIdString = "==> Log.Info";

    constructor(@inject(TYPES.ILogReader) logReader: ILogReader) {
        this.logReader = logReader;  //this is the deck service's log reader
    }

    public getUserId() {

    }

    public getLocalDecks(): Deck[] {
        this.logReader.refreshLog()

        const indecies = [];

        this.logReader.log.forEach((val, index) => {
            if (val.includes(this.deckListsString)) {
                indecies.push(index);
            }
        })

        //Get most recent deck list, if it exists
        if(indecies.length != 0 ) {
            try {
                this.decks = this.logReader.parseBlock<Deck[]>(indecies[indecies.length - 1]);
                console.log(`Updated deck list (${this.decks.length})`);
            } catch(e) {
                try {
                    this.decks = this.logReader.parseBlock<Deck[]>(indecies[indecies.length - 2]);
                    console.log(`Updated deck list (${this.decks.length})`);
                } catch(e) {
                    //Log is incomplete/corrupt
                    console.log(`Could not update deck list`);
                }
            }
        }

        return this.decks;
    }

}
