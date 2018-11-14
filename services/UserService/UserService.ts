import { SaveDeckResource } from './../../resources/Deck/SaveDeckResource';
import { LoginResource } from './../../resources/User/LoginResource';
import { BasicService } from './../BasicService/BasicService';
import { Deck } from '../../models/Deck/Deck';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../inject/TYPES';
import { IUserService } from './IUserService';
import { SaveDeckCardResource } from '../../resources/Deck/SaveDeckCardResource';

@injectable()
export class UserService extends BasicService implements IUserService {
    private userUrl: string;
    private auth_token: string;

    constructor() {
        super();

        this.userUrl = this.baseUrl + "/api/users";
    }

    public login(body: LoginResource): Promise<{}> {
        return new Promise((resolve) => this.req({
            method: 'POST',
            uri: `${this.userUrl}/login`,
            body: body,
            json: true
        }).then(req => {
            if(req.auth_token) {
                this.auth_token = req.auth_token
                console.log("Set Auth Token");
                resolve();
            }
        }));
    }

    public addDeckToRemote(deck: Deck): Promise<{}> {
        const saveDeck = this.convertDeckToSave(deck);

        return new Promise((resolve) => {
            return this.sendAddDeckRequest(saveDeck).then(resolve).then(() => {
                console.log("Updated decks in the background");
            });
        });
    }

    public addDecksToRemote(decks: Deck[]): Promise<{}> {
        const saveDecks: SaveDeckResource[] = [];

        decks.forEach(deck => {
            const newSaveDeck = this.convertDeckToSave(deck);
            saveDecks.push(newSaveDeck);
        });

        return new Promise( (resolve) => {
            return this.sendAddDecksRequest(saveDecks).then(resolve).then(() => {
                console.log("Updated decks in the background");
            });
        });
    }

    private convertDeckToSave(deck: Deck): SaveDeckResource {
        const newDeck: SaveDeckResource = {
            arenaDeckId: deck.id,
            name: deck.name,
            format: deck.format,
            deckTileId: deck.deckTileId,
            mainDeck: deck.mainDeck.map(x => {
                return {
                    arenaId: parseInt(x.id),
                    quantity: x.quantity
                };
            }),
            sideBoard: deck.sideboard.map(x => {
                return {
                    arenaId: parseInt(x.id),
                    quantity: x.quantity
                };
            })
        }

        return newDeck
    }

    private sendAddDeckRequest(body: SaveDeckResource): Promise<{}> {
        return new Promise((resolve) => this.req({
            method: 'POST',
            uri: `${this.userUrl}/user/deck/mtga`,
            auth: {
                bearer: this.auth_token
            },
            body: body,
            json: true
        }).then(resolve));
    }

    private sendAddDecksRequest(body: SaveDeckResource[]): Promise<{}> {
        return new Promise((resolve) => this.req({
            method: 'POST',
            uri: `${this.userUrl}/user/decks/mtga`,
            auth: {
                bearer: this.auth_token
            },
            body: body,
            json: true
        }).then(resolve));
    }
}
