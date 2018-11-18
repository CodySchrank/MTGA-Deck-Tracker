import { Config } from './../../config';
import * as isDev from "electron-is-dev";
import * as _ from "underscore";
import { injectable } from "inversify";
import { LogReader } from '../LogReader/LogReader';
import { ILiveLogReader } from './ILiveLogReader';
import { Tail } from 'tail';
const rl = require("readline");
const fs = require('fs');
const config: Config = require("./../../config.json");
const sizeof = require('object-sizeof');
const HashMap = require('hashmap');

@injectable()
export class LiveLogReader extends LogReader implements ILiveLogReader {
    /**
     *  For reading the log live (ie. in game session)
     */
    public liveIndex = 0;
    private tail: Tail;

    constructor() {
        super();

        this.tail = new Tail(this.logUri, {separator: /[\r]{0,1}\n/, fromBeginning: false, useWatchFile: true, follow: true, logger: console});
    }

    public startGameSession() {
        this.tail.watch();

        this.tail.on("line", (data) => {
            console.log(data);
            this.log.push(data);
            this.liveIndex++
        });

        this.tail.on("error", (error) => {
            console.log('ERROR: ', error);
        });
    }

    public endGameSession() {
        this.tail.unwatch();

        console.log(this.log);

        this.log = [];
    }
}
