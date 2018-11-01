import { IDeckService } from './IDeckService';
import { ILogReader } from './../LogReader/ILogReader';
import { BasicService } from './../BasicService/BasicService';
import { Deck } from '../../models/Deck/Deck';
import * as request from 'request';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../inject/TYPES';

@injectable()
export class DeckService extends BasicService implements IDeckService {
    private decks: Deck[];
    private deckUrl: string;
    private logReader: ILogReader;

    private deckListsString = "<== Deck.GetDeckLists";

    constructor(@inject(TYPES.ILogReader) logReader: ILogReader) {
        super();

        this.logReader = logReader;
        this.deckUrl = this.baseUrl + "/api/decks";
    }

    public updateLocalDecks() {
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
                //log is probably just incomplete
                console.error(e)
            }
        }
    }

    public updateRemoteDecks() {
        request.put(this.deckUrl).form(this.decks).on("response", res => {
            console.log(res);
        })
    }

}
