import { BasicService } from './../BasicService/BasicService';
import { LogReader } from './../LogReader/LogReader';
import { Deck } from '../../models/Deck/Deck';
import * as request from 'request';

export class DeckService extends BasicService {
    private deckUrl: string;

    constructor() {
        super();

        this.deckUrl = this.baseUrl + "/api/decks";
    }

    public updateDecks(decks: Deck[]) {
        request.put(this.deckUrl).form().on("response", res => {
            console.log(res);
        })
    }

}
