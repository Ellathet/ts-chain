import { hash, hashPayload, validatedHash } from './utils/hash';

export interface Block {
  header: {
    nonce: number,
    hash: string
  },
  payload: {
    sequence: number,
    timestamp: number,
    data: any,
    previousHash: string
  }
}

export class Blockchain {

  #chain: Block[] = [];

  private powPrefix = '0';

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly difficulty: number = 4) {
    this.#chain.push(this.createGenesisBlock());
  }

  private createGenesisBlock(): Block {
    const payload : Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Initial Block',
      previousHash: '',
    };

    return {
      header: {
        nonce: 0,
        hash: hashPayload(payload),
      },
      payload,
    };
  }

  private get lastBlock(): Block {
    return this.#chain.at(-1) as Block;
  }

  private lastBlockHash() : string {
    return this.lastBlock.header.hash;
  }

  createBlock(data: any): Block['payload'] {
    const newBlock : Block['payload'] = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data,
      previousHash: this.lastBlockHash(),
    };

    console.log(`New block #${newBlock.sequence} was been created:\n${JSON.stringify(newBlock)}`);

    return newBlock;
  }

  mineBlock(block: Block['payload']) {
    let nonce = 0;
    const startTimeStamps = +new Date();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const blockHash = hashPayload(block);
      const powHash = hash(blockHash + nonce);

      if (validatedHash({
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
    return this.#chain;
  }

  verifyBlock(block: Block) : boolean {
    if (block.payload.previousHash !== this.lastBlockHash()) {
      // eslint-disable-next-line max-len
      console.error(`Block #${block.payload.sequence} is invalid, last hash is other than ${block.payload.previousHash} `);
      return false;
    }

    const hashToValidate = hash(JSON.stringify(block.payload) + block.header.nonce);

    if (!validatedHash({
      hashToValidate,
      difficulty: this.difficulty,
      prefix: this.powPrefix,
    })) {
      console.error(`Block #${block.payload.sequence} is invalid, nonce can't be verified ${block.header.nonce}`);

      return false;
    }

    return true;
  }

  sendBlock(block: Block): Block[] {
    if (this.verifyBlock(block)) {
      this.#chain.push(block);
      console.log(`Block #${block.payload.sequence} was been added in chain\nBlockchain: ${JSON.stringify(block)}`);
    }
    return this.#chain;
  }

}
