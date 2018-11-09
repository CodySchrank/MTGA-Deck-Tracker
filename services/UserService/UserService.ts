import { SaveDeckResource } from './../../resources/Deck/SaveDeckResource';
import { LoginResource } from './../../resources/User/LoginResource';
import { ILogReader } from './../LogReader/ILogReader';
import { BasicService } from './../BasicService/BasicService';
import { Deck } from '../../models/Deck/Deck';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../inject/TYPES';
import { IUserService } from './IUserService';
import { SaveDeckCardResource } from '../../resources/Deck/SaveDeckCardResource';

@injectable()
export class UserService extends BasicService implements IUserService {
    private userUrl: string;
    private logReader: ILogReader;
    private auth_token: string;

    constructor(@inject(TYPES.ILogReader) logReader: ILogReader) {
        super();

        this.logReader = logReader;
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

    public addDeck(deck: Deck): Promise<{}> {
        return new Promise((resolve) => {
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

            return this.addDeckToRemote(newDeck).then(resolve);
        });
    }

    public addDeckToRemote(body: SaveDeckResource): Promise<{}> {
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
