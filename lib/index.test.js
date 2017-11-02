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
const ava_1 = require("ava");
// import { doSomething } from './index'
const util_1 = require("./util");
class BloomFilter {
    constructor(options) {
        this.hashes = [];
        this.backend = options.backend;
        const seeds = options.hashSeeds || util_1.range(options.numHashes);
        this.hashes = seeds.map(options.hasher);
    }
    test(word) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexes = this.getIndexes(word);
            const bits = yield this.backend.getBits(indexes);
            return util_1.all(bits, util_1.isTruthy);
        });
    }
    add(word) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexes = this.getIndexes(word);
            yield this.backend.setBits(indexes);
        });
    }
    getIndexes(word) {
        const indexes = [];
        for (const hash of this.hashes) {
            indexes.push(hash(word));
        }
        return indexes;
    }
}
function basicHasher(seed) {
    return (word) => {
        const str = seed + word;
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h += str.charCodeAt(i);
        }
        return h;
    };
}
class BufferBackend {
    constructor(bits) {
        this.buffer = Buffer.alloc(Math.ceil(bits / 8));
    }
    getBits(indexes) {
        return __awaiter(this, void 0, void 0, function* () {
            const bits = [];
            for (const index of indexes) {
                bits.push(this.getBit(index));
            }
            return bits;
        });
    }
    setBits(indexes) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const index of indexes) {
                this.setBit(index);
            }
        });
    }
    setBit(index) {
        const byte = Math.floor(index / 8);
        const shift = index % 8;
        this.buffer[byte] = this.buffer[byte] | (0x1 << shift);
    }
    getBit(index) {
        const byte = Math.floor(index / 8);
        const shift = index % 8;
        return (this.buffer[byte] & (0x1 << shift)) !== 0;
    }
}
ava_1.default('BufferBackend', t => {
    const backend = new BufferBackend(256);
    backend.setBit(0);
    backend.setBit(9);
    t.is(backend.getBit(0), true);
    t.is(backend.getBit(1), false);
    t.is(backend.getBit(9), true);
    t.is(backend.getBit(11), false);
});
ava_1.default('BloomFilter', t => {
    const backend = new BufferBackend(256);
    const filter = new BloomFilter({
        backend: backend,
        hasher: basicHasher,
        numHashes: 7,
        numBits: 256
    });
});
