import { Config } from './../../config';
import { ILogReader } from './ILogReader';
import * as isDev from "electron-is-dev";
import * as _ from "underscore";
import { injectable } from "inversify";
const rl = require("readline");
const fs = require('fs');
const config: Config = require("./../../config.json");
const sizeof = require('object-sizeof');

@injectable()
export class LogReader implements ILogReader {
    /**
     *  Log Reader should not be injected more than a couple times
     */
    public log: string[] = [];
    private logUri: string = "";

    constructor() {
        this.initLog();
    }

    public getParsedLog(): Promise<string[]> {
        return new Promise( (resolve, reject) => {
            console.time("refreshLog");
            this.log = [];

            const lineReader = rl.createInterface({
                input: fs.createReadStream(this.logUri)
            });

            lineReader.on("error", (err) => {
                this.log = [];
                resolve();
            })

            lineReader.on('line', (line) => {
                const str = (line.toString()).replace(/[\n\r]+/g, ''); //removes CR and newline
                if (!this.isNullOrEmpty(str)) {
                    this.log.push(str);
                }
            });

            lineReader.on('close', () => {
                console.log(`Updated log, sizeof: ${sizeof(this.log)} bytes, length: ${this.log.length} lines`);
                console.timeEnd("refreshLog");
                resolve();
            })
        });
    }

    clearLog() {
        this.log = [];
    }

    parseBlock<T>(index: number): T {
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

    private initLog() {
        if (config.UseLocalOutputFile) {
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
    }

    private isNullOrEmpty(str: string) {
        return !str || !str.trim();
    }
}
