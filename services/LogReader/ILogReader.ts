export interface ILogReader {
    log: string[];
    getParsedLog(): Promise<{}>;
    clearLog(): void;
    parseBlock<T>(index: number): T;
}
