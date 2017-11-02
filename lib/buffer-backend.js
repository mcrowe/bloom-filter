"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Make a buffer backend from an existing buffer.
 *
 * @param buffer Initial buffer
 */
function makeWithBuffer(buffer) {
    return {
        getBuffer() {
            return buffer;
        },
        getBits(indexes) {
            return __awaiter(this, void 0, void 0, function* () {
                const bits = [];
                for (const index of indexes) {
                    bits.push(this.getBit(index));
                }
                return bits;
            });
        },
        setBits(indexes) {
            return __awaiter(this, void 0, void 0, function* () {
                for (const index of indexes) {
                    this.setBit(index);
                }
            });
        },
        setBit(index) {
            const byte = Math.floor(index / 8);
            const shift = index % 8;
            buffer[byte] = buffer[byte] | (0x1 << shift);
        },
        getBit(index) {
            const byte = Math.floor(index / 8);
            const shift = index % 8;
            return (buffer[byte] & (0x1 << shift)) !== 0;
        }
    };
}
exports.makeWithBuffer = makeWithBuffer;
/**
 * Make a buffer backend with the given size.
 *
 * @param size Number of bits
 */
function makeWithSize(size) {
    const buffer = Buffer.alloc(Math.ceil(size / 8));
    return makeWithBuffer(buffer);
}
exports.makeWithSize = makeWithSize;
