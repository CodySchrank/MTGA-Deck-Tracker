import { SaveDeckResource } from './../../resources/Deck/SaveDeckResource';
import { IDeckService } from './IDeckService';
import { ILogReader } from './../LogReader/ILogReader';
import { BasicService } from './../BasicService/BasicService';
import { Deck } from '../../models/Deck/Deck';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../inject/TYPES';

@injectable()
export class DeckService extends BasicService implements IDeckService {
    private decks: Deck[] = [];
    private deckUrl: string;
    private logReader: ILogReader;

    private deckListsString = "<== Deck.GetDeckLists";

    constructor(@inject(TYPES.ILogReader) logReader: ILogReader) {
        super();

        this.logReader = logReader;
        this.deckUrl = this.baseUrl + "/api/decks";
    }

    public getLocalDecks() {
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
