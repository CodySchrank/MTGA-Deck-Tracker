import { LoginResource } from './../../resources/User/LoginResource';
import { SaveDeckResource } from '../../resources/Deck/SaveDeckResource';
import { Deck } from '../../models/Deck/Deck';

export interface IUserService {
    login(body: LoginResource): Promise<{}>;
    addDeck(deck: Deck): Promise<{}>;
    addDeckToRemote(body: SaveDeckResource): Promise<{}>;
}
