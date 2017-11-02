"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function range(n) {
    const xs = [];
    for (let i = 0; i < n; i++) {
        xs.push(i);
    }
    return xs;
}
exports.range = range;
function all(xs, predicate) {
    for (const x of xs) {
        if (!predicate(x)) {
            return false;
        }
    }
    return true;
}
exports.all = all;
function isTruthy(x) {
    return !!x;
}
exports.isTruthy = isTruthy;
