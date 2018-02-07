const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check')

const CryptCoin = require('../middleware/cryptcoin')

const responseMiddleware = (req, res, next) => {
  return res.json(req.responseValue);
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crypt Coin' });
});

router.post('/transactions/new', [
  check('sender', 'Sender must be a String').exists(),
  check('recipient', 'Sender must be a String').exists(),
  check('amount', 'Sender must be a Int Value').isInt().exists()
], CryptCoin.newTransaction, responseMiddleware)

router.get('/mine', CryptCoin.mine, responseMiddleware)

router.get('/chain', CryptCoin.getChain, responseMiddleware)

module.exports = router
