import { Config } from './../../config';
import { ILogReader } from './ILogReader';
import { injectable } from "inversify";
const fs = require('fs');
const config: Config = require("./../../config.json");
const sizeof = require('object-sizeof');
const HashMap = require('hashmap');
const FastTail = require("fasttail");

@injectable()
export class LogReader implements ILogReader {
    /**
     *  Log Reader should not be injected more than a couple times because it uses alot of memory
     */
    public log: string[] = [];
    public map: HashMap<string, number> = new HashMap();  //indexes of the hastset

    protected logUri: string = "";

    constructor() {
        this.initLog();
    }

    public startReading(): Promise<{}> {
        return new Promise( (resolve, reject) => {
            const fastTail = new FastTail(this.logUri);
            fastTail.tailFromBeginning = true;
            fastTail.tail((line: string) => {
                this.log.push(line.replace(/[\n\r]+/g, ''));
            }, () => {
                resolve();
            })
        });
    }

    public getParsedLog(map?: string[]): Promise<string[]> {
        return new Promise( (resolve, reject) => {
            map = map || [];
            const log = this.log;

            let usefulIndex = 0;

            log.forEach(line => {
                usefulIndex++;
                const match = map.filter(s => line.includes(s));

                if(match.length) {
                    this.map.set(match[0], usefulIndex);
                }
            });

            resolve();
        });
    }

    public clear() {
        this.map.clear();
    }

    public parseBlock<T>(index: number): T {
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

    protected initLog() {
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

    protected isNullOrEmpty(str: string) {
        return !str || !str.trim();
    }
}
