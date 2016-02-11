'use strict'

var log = require('loglevel')
var _ = require('lodash')
var sprintf = require('sprintf')

const validCoins = {
  '1p'  : 0.01,
  '2p'  : 0.02,
  '5p'  : 0.05,
  '10p' : 0.1,
  '20p' : 0.2,
  '50p' : 0.5,
  '£1'  : 1,
  '£2'  : 2
}

const validProducts = {
  'coke'           : 1.00,
  'mars bar'       : 1.50,
  'chocolate milk' : 3.20,
}

class VendingMachine {

  /* Public Methods */
  constructor() {
    this._selected
    this._inputCoins = {}

    // don't mutate these outside of the store methods
    this._products = {}
    this._change = {}
  }

  selectProduct(product) {
    if (validProducts[product] === undefined) {
      return
    }
    if (!this.showStock()[product]) {
      return
    }
    this._selected = product
    log.debug("change in machine:", this.showChange())
    return this._selected
  }

  insertCoin(coin) {
    if (!this._selected) {
      return
    }
    if (validCoins[coin] === undefined) {
      return
    }
    var input = {}
    input[coin] = 1
    this._loadGeneric(input, this._inputCoins, _.keys(validCoins))
    return this.handleTransaction()
  }

  /* Private methods */
  handleTransaction(diff) {
    var diff = this.calculateDiff()
    if (diff > 0) {
      log.info(sprintf("need £%.2f more", diff))
      return 0
    } 
    if (diff <= 0) {
      var response = {}
      this
        .removeSelectedProduct(response)
        .handleChange(response, diff)
      return response
    } 
    return
  }

  handleChange(response, diff) {
    this.loadCoins(this._inputCoins)
    this._inputCoins = {}
    response['change'] = sprintf("£%.2f", diff)
    response['changecoins'] = this.removeChange(diff)
    log.debug("change in machine:", this.showChange())
  }

  calculateDiff() {
    if (!this._selected) {
      return
    }
    let price = validProducts[this._selected]
    let input = this._sumCoins(this._inputCoins)
    return _.round(price - input, 2)
  }

  removeChange(diff) {
    if (diff < 0) {
      return 
    }

    var coins = {}
    var availableChange = this.showChange()
    if (this._sumCoins(availableChange) < diff) {
      log.info('not enough change. need to load more!') 
      coins = availableChange
    }
    else {
      let a_coins = []
      _.forEach(availableChange, (value, key) => {
        let coin = {
          label: key,
          value: validCoins[key],
          quantity: value, 
        }
        a_coins.push(coin)
      })

      let sorted_coins = _(a_coins)
        .sortBy('value')
        .value()
        .reverse()

      //TODO can probably optimise this algorithm
      let a_change = []
      _.forEach(sorted_coins, (coin) => {
        while (coin.quantity > 0 && diff >= coin.value) {
          a_change.push(coin.label)
          coin.quantity --
          diff = _.round(diff - coin.value, 2)
        }
      })

      _.forEach(a_change, (coinlabel) => {
        if (coins[coinlabel] === undefined) {
          coins[coinlabel] = 0
        }
        coins[coinlabel] ++
      })
    }
    this.removeCoins(coins)
    return coins
  }

  _sumCoins(coins) {
    var sum = 0
    _(coins)
      .forEach( (value, key) => {
        sum += (validCoins[key] * value)
      } )
    return sum
  }

  /* Store methods */
  showStock() {
    let stockCopy = this._products
    return stockCopy
  }

  showChange() {
    let changeCopy = this._change
    return changeCopy
  }

  loadCoins(coins) {
    return this._loadGeneric(coins, this._change, _.keys(validCoins))
  }

  loadProducts(products) {
    return this._loadGeneric(products, this._products, _.keys(validProducts))
  }

  _loadGeneric(input, load_into, valid) {
    log.debug(input)
    _(input)
      .pick(valid)
      .forEach( (value, key) => {
        if (load_into[key] === undefined) {
          load_into[key] = 0
        }
        load_into[key] += value
      })
    return load_into
  }

  removeSelectedProduct(response) {
    if (!this._products[this._selected]) {
      return 
    }
    this._products[this._selected]--
    response['product'] = this._selected
    this._selected = undefined
    response['success'] = 1
    return this
  }

  removeCoins(coins) {
    return this._removeGeneric(coins, this._change, _.keys(validCoins))
  }

  _removeGeneric(input, remove_from, valid) {
    let temp_remove_from = remove_from
    _(input)
      .pick(valid)
      .forEach( (value, key) => {
        if (temp_remove_from[key] === undefined) {
          temp_remove_from[key] = 0
        } 
        temp_remove_from[key] -= value
      })
    
    //TODO check for negative change
    remove_from = temp_remove_from
    return remove_from
  }
}

module.exports = VendingMachine
