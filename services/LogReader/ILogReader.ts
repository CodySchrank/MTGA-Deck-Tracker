export interface ILogReader {
    log: string[],
    refreshLog(): void;
    clearLog(): void;
    parseBlock<T>(index: number): T;
}
