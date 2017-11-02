"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const BufferBackend = require("./buffer-backend");
const fs = require("fs");
ava_1.default('BufferBackend:basics', t => {
    const backend = BufferBackend.makeWithSize(256);
    backend.setBit(0);
    backend.setBit(9);
    t.is(backend.getBit(0), true);
    t.is(backend.getBit(1), false);
    t.is(backend.getBit(9), true);
    t.is(backend.getBit(11), false);
});
ava_1.default('BufferBackend:persistance', t => {
    const backend = BufferBackend.makeWithSize(1024);
    backend.setBit(100);
    const filename = '/tmp/buffer.dat';
    fs.writeFileSync(filename, backend.getBuffer());
    const loadedBuffer = fs.readFileSync('/tmp/buffer.dat');
    const loadedBackend = BufferBackend.makeWithBuffer(loadedBuffer);
    t.is(loadedBackend.getBit(100), true);
    t.is(loadedBackend.getBit(101), false);
});
