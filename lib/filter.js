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
const util_1 = require("./util");
class Filter {
    constructor(options) {
        this.hashes = [];
        this.numBits = options.numBits;
        this.backend = options.backend(options.numBits);
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
            const index = hash(word) % this.numBits;
            indexes.push(index);
        }
        return indexes;
    }
}
exports.default = Filter;
