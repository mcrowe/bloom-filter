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
const filter_1 = require("./filter");
const dummy_hasher_1 = require("./dummy-hasher");
const BufferBackend = require("./buffer-backend");
ava_1.default('basics', (t) => __awaiter(this, void 0, void 0, function* () {
    const filter = new filter_1.default({
        backend: BufferBackend.makeWithSize,
        hasher: dummy_hasher_1.default,
        numHashes: 7,
        numBits: 256
    });
    t.is(yield filter.test('abc'), false);
    yield filter.add('abc');
    t.is(yield filter.test('abc'), true);
    t.is(yield filter.test('abcd'), false);
}));
ava_1.default('error rates', (t) => __awaiter(this, void 0, void 0, function* () {
    const filter = new filter_1.default({
        backend: BufferBackend.makeWithSize,
        hasher: dummy_hasher_1.default,
        numHashes: 7,
        numBits: 959
    });
    const words = [];
    for (let i = 0; i < 100; i++) {
        words.push(randomWord());
    }
    for (const n of words) {
        yield filter.add(n);
    }
    // Should recall all
    for (const n of words) {
        t.is(yield filter.test(n), true);
    }
    let n = 0;
    for (let i = 0; i < 100; i++) {
        const word = randomWord();
        if (yield filter.test(word)) {
            n += 1;
        }
    }
    t.is(n < 15, true, 'false positives should be low');
}));
function randomWord() {
    return Math.floor(Math.random() * 1000000).toString();
}
