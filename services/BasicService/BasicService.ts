import { IBasicService } from './IBasicService';
import { injectable } from "inversify";
import * as isDev from "electron-is-dev";
import * as rp from "request-promise";
import * as request from "request";

@injectable()
export class BasicService implements IBasicService {
    public baseUrl: string;
    public req: request.RequestAPI<rp.RequestPromise, rp.RequestPromiseOptions, request.RequiredUriUrl>;

    constructor() {
        this.baseUrl = "https://localhost:5001";

        if(isDev) {
            this.req = rp.defaults({
                rejectUnauthorized: false
            })
        } else {
            this.req = rp;
        }
    }
}
