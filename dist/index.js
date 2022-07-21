"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
const difficulty = Number(process.argv[2]) || 4;
const blockchain = new blockchain_1.Blockchain(difficulty);
const blocksNum = Number(process.argv[3]) || 10;
let { chain } = blockchain;
for (let i = 1; i < blocksNum; i++) {
    const block = blockchain.createBlock(`Block ${i}`);
    const { minedBlock } = blockchain.mineBlock(block);
    chain = blockchain.sendBlock(minedBlock);
}
console.log('Blockchain');
console.log(chain);
