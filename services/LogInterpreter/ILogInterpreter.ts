import { Deck } from "../../models/Deck/Deck";

export interface ILogInterpreter {
    transaction(cb: Function);

    /** Wrap all gets in transaction */
    getLocalDecks(): Promise<Deck[]>;
    getUserId(): Promise<string>;
}
