import { Deck } from "../../models/Deck/Deck";

export interface ILogInterpreter {
    getLocalDecks(): Deck[];
    // getUserId(): string;
}
