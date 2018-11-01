import { IBasicService } from './IBasicService';
import { injectable } from "inversify";

@injectable()
export class BasicService implements IBasicService {
    public baseUrl: string;

    constructor() {
        this.baseUrl = "https://mtgareplay.com";
    }
}
