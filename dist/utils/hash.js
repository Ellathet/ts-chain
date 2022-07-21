"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedHash = exports.hash = exports.hashPayload = void 0;
const crypto_1 = require("crypto");
const hashPayload = (payload) => (0, crypto_1.createHash)('sha256').update(JSON.stringify(payload)).digest('hex');
exports.hashPayload = hashPayload;
const hash = (value) => (0, crypto_1.createHash)('sha256').update(value).digest('hex');
exports.hash = hash;
const validatedHash = ({ hashToValidate, difficulty = 4, prefix = '0', }) => {
    const check = prefix.repeat(difficulty);
    return hashToValidate.startsWith(check);
};
exports.validatedHash = validatedHash;
