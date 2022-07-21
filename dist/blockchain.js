"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Blockchain_chain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const hash_1 = require("./utils/hash");
class Blockchain {
    // eslint-disable-next-line no-unused-vars
    constructor(difficulty = 4) {
        this.difficulty = difficulty;
        _Blockchain_chain.set(this, []);
        this.powPrefix = '0';
        __classPrivateFieldGet(this, _Blockchain_chain, "f").push(this.createGenesisBlock());
    }
    createGenesisBlock() {
        const payload = {
            sequence: 0,
            timestamp: +new Date(),
            data: 'Initial Block',
            previousHash: '',
        };
        return {
            header: {
                nonce: 0,
                hash: (0, hash_1.hashPayload)(payload),
            },
            payload,
        };
    }
    get lastBlock() {
        return __classPrivateFieldGet(this, _Blockchain_chain, "f").at(-1);
    }
    lastBlockHash() {
        return this.lastBlock.header.hash;
    }
    createBlock(data) {
        const newBlock = {
            sequence: this.lastBlock.payload.sequence + 1,
            timestamp: +new Date(),
            data,
            previousHash: this.lastBlockHash(),
        };
        console.log(`New block #${newBlock.sequence} was been created:\n${JSON.stringify(newBlock)}`);
        return newBlock;
    }
    mineBlock(block) {
        let nonce = 0;
        const startTimeStamps = +new Date();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const blockHash = (0, hash_1.hashPayload)(block);
            const powHash = (0, hash_1.hash)(blockHash + nonce);
            if ((0, hash_1.validatedHash)({
                hashToValidate: powHash,
                difficulty: this.difficulty,
                prefix: this.powPrefix,
            })) {
                const finalTimeStamps = +new Date();
                const reduceHash = blockHash.slice(0, 12);
                const mineTime = (finalTimeStamps - startTimeStamps) / 1000;
                console.log(`Block ${block.sequence} was mined in ${mineTime}s. \nHash ${reduceHash} in ${nonce} attempts`);
                return {
                    minedBlock: {
                        payload: { ...block },
                        header: {
                            nonce,
                            hash: blockHash,
                        },
                    },
                };
            }
            // eslint-disable-next-line no-plusplus
            nonce++;
        }
    }
    get chain() {
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    }
    verifyBlock(block) {
        if (block.payload.previousHash !== this.lastBlockHash()) {
            // eslint-disable-next-line max-len
            console.error(`Block #${block.payload.sequence} is invalid, last hash is other than ${block.payload.previousHash} `);
            return false;
        }
        const hashToValidate = (0, hash_1.hash)(JSON.stringify(block.payload) + block.header.nonce);
        if (!(0, hash_1.validatedHash)({
            hashToValidate,
            difficulty: this.difficulty,
            prefix: this.powPrefix,
        })) {
            console.error(`Block #${block.payload.sequence} is invalid, nonce can't be verified ${block.header.nonce}`);
            return false;
        }
        return true;
    }
    sendBlock(block) {
        if (this.verifyBlock(block)) {
            __classPrivateFieldGet(this, _Blockchain_chain, "f").push(block);
            console.log(`Block #${block.payload.sequence} was been added in chain\nBlockchain: ${JSON.stringify(block)}`);
        }
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    }
}
exports.Blockchain = Blockchain;
_Blockchain_chain = new WeakMap();
