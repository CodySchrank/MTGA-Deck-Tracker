import { Deck } from './../../models/Deck/Deck';
import * as fs from "fs";
import * as isDev from "electron-is-dev";
import * as _ from "underscore";
import * as lineByLine from "n-readlines";
import { inject, injectable, named } from "inversify";

@injectable()
export class LogReader {
    public log: string[] = [];
    private logUri: string = "";

    constructor() {
        this.initLog();
    }

    public refreshLog() {
        this.log = [];

        const liner = new lineByLine(this.logUri);  //syncronous

        let line: string;

        while (line = liner.next()) {
            const str = (line.toString()).replace(/[\n\r]+/g, ''); //removes CR and newline
            if (!this.isNullOrEmpty(str)) {
                this.log.push(str);
            }
        }
    }

    private initLog() {
        if (isDev) {
            console.log("Using Local output_log");
            this.logUri = "./output_log.txt"
        } else {
            console.log("Using Game output_log");
            if (process.platform === 'win32') {
                this.logUri = process.env.APPDATA.replace(
                    'Roaming',
                    'LocalLow\\Wizards Of The Coast\\MTGA\\output_log.txt'
                );
            } else {
                console.log("No Systems match.  Guessing Wine output_log");
                // Path for Wine, could change depending on installation method
                this.logUri =
                    process.env.HOME +
                    '/.wine/drive_c/user/' +
                    process.env.USER +
                    '/AppData/LocalLow/Wizards of the Coast/MTGA/output_log.txt';
            }
        }

        this.refreshLog();
    }

    private parseBlock<T>(index: number): T {
        index += 1; //we dont care about the header

        let breaker = this.log[index];

        if (breaker == "{") {
            breaker = "}"
        } else if (breaker == "[") {
            breaker = "]"
        } else {
            throw "unknown breaker";
        }

        const block: string[] = [];

        let valid = false;

        for (let i = index; i < this.log.length; i++) {
            block.push(this.log[i]);

            if (this.log[i] == breaker) {
                valid = true;
                break;
            }
        }

        if(!valid) {
            throw "invalid parse";
        }

        return JSON.parse(block.join("\n")) as T;
    }

    private isNullOrEmpty(str: string) {
        return !str || !str.trim();
    }
}
