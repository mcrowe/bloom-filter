export interface IOptions {
    backend: IBackender;
    hasher: IHasher;
    numHashes: number;
    numBits: number;
    hashSeeds?: number[];
}
export interface IBackender {
    (numBits: number): IBackend;
}
export interface IBackend {
    setBits(indexes: number[]): Promise<void>;
    getBits(indexes: number[]): Promise<boolean[]>;
}
export interface IHasher {
    (seed: number): IHash;
}
export interface IHash {
    (word: string): number;
}
export default class Filter {
    backend: IBackend;
    hashes: IHash[];
    numBits: number;
    constructor(options: IOptions);
    test(word: string): Promise<boolean>;
    add(word: string): Promise<void>;
    getIndexes(word: string): number[];
}
