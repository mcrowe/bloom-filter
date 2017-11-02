/// <reference types="node" />
/**
 * Make a buffer backend from an existing buffer.
 *
 * @param buffer Initial buffer
 */
export declare function makeWithBuffer(buffer: Buffer): {
    getBuffer(): Buffer;
    getBits(indexes: number[]): Promise<boolean[]>;
    setBits(indexes: number[]): Promise<void>;
    setBit(index: number): void;
    getBit(index: number): boolean;
};
/**
 * Make a buffer backend with the given size.
 *
 * @param size Number of bits
 */
export declare function makeWithSize(size: number): {
    getBuffer(): Buffer;
    getBits(indexes: number[]): Promise<boolean[]>;
    setBits(indexes: number[]): Promise<void>;
    setBit(index: number): void;
    getBit(index: number): boolean;
};
