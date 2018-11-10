import { LoginResource } from './../../resources/User/LoginResource';
import { SaveDeckResource } from '../../resources/Deck/SaveDeckResource';
import { Deck } from '../../models/Deck/Deck';

export interface IUserService {
    login(body: LoginResource): Promise<{}>;
    addDeckToRemote(deck: Deck): Promise<{}>;
    addDecksToRemote(decks: Deck[]): Promise<{}>;
}
