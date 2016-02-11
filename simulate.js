'use strict'

var VendingMachine = require('./vending.js')
var log = require('loglevel')
var readline = require('readline');

var debug = (process.argv[2] === '-d') ? 1 : 0;
log.setLevel('info');
if (debug) {
  log.setLevel('debug');
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run(v) {
  rl.question("what would you like to do? (buy|loadchange|loadproducts|leave)\n", mode => {
    switch (mode) {
      case 'leave': 
        log.info('bye')
        return rl.close()
      case 'buy':
        log.info(v.showStock())
        rl.question('what would you like?\n', product => {
          if (v.selectProduct(product) === undefined) {
            log.info('invalid product') 
            run(v)
          }
          function insert() {
            rl.question('insert coin (1p|2p|10p|20p|50p|£1|£2)\n', coin => {
              let response = v.insertCoin(coin)  
              if (!response) {
                insert()
              } else {
                log.info(response)
                run(v)
              }
            })
          }
          insert()
        })
        return
      case 'loadproducts':
        log.info('current stock', v.showStock())
        rl.question('submit change in JSON like {"coke":2}\n', product => {
          v.loadProducts(JSON.parse(product))
          log.info('updated stock', v.showStock())
          run(v)
        })
        return
      case 'loadchange':
        log.info('current change', v.showChange())
        rl.question('submit change in JSON like {"10p":2, "£1":100}\n', coins => {
          v.loadCoins(JSON.parse(coins))
          log.info('updated change', v.showChange())
          run(v)
        })
        return
    }
    run(v)
  })
}

rl.question('welcome to the vending machine\n\n PRESS ENTER\n', () => {
  var v = new VendingMachine()
  v.loadCoins({'10p':10, '50p':10});
  v.loadProducts({'coke':10, 'mars bar':10});

  run(v)
})
