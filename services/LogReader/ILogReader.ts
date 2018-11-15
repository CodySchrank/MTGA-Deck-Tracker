export interface ILogReader {
    log: string[];
    map: HashMap<string, number>;
    getParsedLog(map?: string[]): Promise<{}>;
    clear(): void;
    parseBlock<T>(index: number): T;
}
