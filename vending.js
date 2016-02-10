'use strict'

var log = require('loglevel')
var _ = require('lodash')

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

/*
 *  class VendingMachine
 */
class VendingMachine {

  /* Public Methods */
  constructor() {
    this._products = {}
    this._change = {}
    this._selected
    this._inputCoins = {}
  }

  selectProduct(product) {
    if (validProducts[product] === undefined) {
      return
    }
    if (!this._products[product]) {
      return
    }
    this._selected = product
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
    this._loadGeneric(input, this._inputCoins, validCoins)
    log.debug(this._inputCoins)
    return this.calculateChange()
  }

  calculateChange() {
    if (!this._selected) {
      return
    }
    var price = validProducts[this._selected]
    var input_sum = this._sumCoins(this._inputCoins)
    log.debug(price, input_sum)
    return price - input_sum
  }

  loadCoins(coins) {
    return this._loadGeneric(coins, this._change, _.keys(validCoins))
  }

  loadProducts(products) {
    return this._loadGeneric(products, this._products, _.keys(validProducts))
  }

  removeCoins(coins) {
    return this._removeGeneric(coins, this._change, _.keys(validCoins))
  }

  removeProducts(products) {
    return this._removeGeneric(products, this._products, _.keys(validProducts))
  }

  /* Private methods */

  _sumCoins(coins) {
    var sum = 0
    _(coins)
      .forEach( (value, key) => {
        sum += (validCoins[key] * value)
      } )
    return sum
  }

  _loadGeneric(input, load_into, valid) {
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

  giveProduct() {}

}

module.exports = VendingMachine
