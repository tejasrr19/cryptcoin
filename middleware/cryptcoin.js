const Blockchain = require('./blockchain')
const { validationResult } = require('express-validator/check')

class Cryptcoin {
  constructor() {
    this.blockchain = new Blockchain();
    this.getChain = this.getChain.bind(this);
    this.mine = this.mine.bind(this);
    this.newTransaction = this.newTransaction.bind(this);
  }

  getChain(req, res, next) {
    req.responseValue = {
      message: 'Get Chain',
      chain: this.blockchain.chain
    };
    return next();
  }

  mine(req, res, next) {
    const lastBlock = this.blockchain.lastBlock();
    const lastProof = lastBlock.proof;
    const proof = this.blockchain.proofOfWork(lastProof);

    this.blockchain.newTransaction('0', process.env.NODE_NAME, 1);

    const previousHash = this.blockchain.hash(lastProof);
    const newBlock = this.blockchain.newBlock(proof, previousHash);

    const responseValue = Object.assign({
      message: 'New Block Mined'
    }, newBlock);
    req.responseValue = responseValue;
    return next();
  }

  newTransaction(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const trans = req.body;
    const index = this.blockchain.newTransaction(trans['sender'], trans['recipient'], trans['amount']);
    const responseValue = {
      message: `Transaction will be added to Block ${index}`
    };
    req.responseValue = responseValue;
    return next();
  }
}

module.exports = new Cryptcoin()
