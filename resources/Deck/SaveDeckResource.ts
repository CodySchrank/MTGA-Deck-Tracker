import { SaveDeckCardResource } from './SaveDeckCardResource';

export interface SaveDeckResource {
    arenaDeckId: string,
    name: string,
    format: string,
    deckTileId: number,
    mainDeck: SaveDeckCardResource[],
    sideBoard: SaveDeckCardResource[]
}
