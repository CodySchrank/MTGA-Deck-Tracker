import { Deck } from "../../models/Deck/Deck";

export interface ILogInterpreter {
    getLocalDecks(): Promise<Deck[]>;
    getUserId(): Promise<string>;
}
