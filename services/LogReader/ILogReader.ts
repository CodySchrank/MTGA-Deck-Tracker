export interface ILogReader {
    log: string[],
    refreshLog(): void;
    parseBlock<T>(index: number): T;
}
