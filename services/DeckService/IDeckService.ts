import { Deck } from "../../models/Deck/Deck";

export interface IDeckService {
    getLocalDecks(): Deck[];
    updateRemoteDecks(): void;
}
