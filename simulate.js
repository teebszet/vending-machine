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
          v.selectProduct(product) 
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
      case 'loadchange':
        log.info('current stock')
          //TODO
        return
      case 'loadproducts':
        log.info('something')
          //TODO
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
