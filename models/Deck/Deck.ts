import { Card } from "../Card/Card";

export interface Deck {
    id: string,
    name: string,
    format: string,
    deckTileId: number,
    mainDeck: Card[],
    sideboard: Card[],
    lastUpdated: Date,
    lockedForUse: boolean,
    lockedForEdit: boolean,
    isValid: boolean
}
