'use strict'

var expect = require('chai').expect
var VendingMachine = require('./vending.js')
var log = require('loglevel')

log.setLevel('debug')

describe('vending.js', function() {

  describe('loadCoins(coins)', function() {
    let v = new VendingMachine()

    let tests = [
      { input: {'10p':2, '50p':3},         expected: {'10p':2, '50p':3},         name: 'simple case' },
      { input: {'10p':4, '50p':5, '£1':8}, expected: {'10p':6, '50p':8, '£1':8}, name: 'add to change' },
      { input: {'13p':4}, expected: {'10p':6, '50p':8, '£1':8}, name: 'invalid coin' }
    ]
    tests.forEach( t => {
      it(t.name, () => {
        expect(v.loadCoins(t.input)).to.deep.equal(t.expected)
      })
    })
  })

  describe('loadProducts(products)', function() {
    let v = new VendingMachine()

    let tests = [
      { 
        input: {'coke':2, 'mars bar':3},
        expected: {'coke':2, 'mars bar':3},
        name: 'simple case'
      },
      { 
        input: {'coke':4, 'mars bar':5, 'chocolate milk':8},
        expected: {'coke':6, 'mars bar':8, 'chocolate milk':8},
        name: 'add to products'
      },
      { 
        input: {'shoe':4},
        expected: {'coke':6, 'mars bar':8, 'chocolate milk':8},
        name: 'invalid product'
      }
    ]
    tests.forEach( t => {
      it(t.name, () => {
        expect(v.loadProducts(t.input)).to.deep.equal(t.expected)
      })
    })
  })

  describe('removeCoins(coins)', function() {
    let v = new VendingMachine()
    v.loadCoins({'10p':10, '50p':10});
    let tests = [
      {
        input: {'10p':2, '50p':3},
        expected: {'10p':8, '50p':7},
        name: 'simple case'
      }
    ]
    tests.forEach( t => {
      it(t.name, () => {
        expect(v.removeCoins(t.input)).to.deep.equal(t.expected)
      })
    })
  })

  describe('selectProduct(product)', function() {
    let v = new VendingMachine()
    v.loadProducts({'coke':1, 'mars bar':2})

    let tests = [
      { input: 'coke', expected: 'coke', name: 'simple case' },
      { input: 'mars bar', expected: 'mars bar', name: 'select changes' },
      { input: 'shoe', expected: undefined, name: 'bad product' },
      { input: 'chocolate milk', expected: undefined, name: 'out of stock' },
    ]

    tests.forEach( t => {
      it(t.name, () => {
        expect(v.selectProduct(t.input)).to.deep.equal(t.expected)
      })
    })
  })

  describe('insertCoin(coin) no product selected', function() {
    let v = new VendingMachine()
    it('no product selected', () => {
      expect(v.insertCoin('£1')).to.equal(undefined)
    })
  })

  describe('calculateDiff() no product selected', function() {
    let v = new VendingMachine()
    it('no product selected', () => {
      expect(v.calculateDiff()).to.equal(undefined)
    })
  })

  describe('_sumCoins(coins)', function() {
    let v = new VendingMachine()
    let tests = [
      { input: {'10p':10, '50p':10}, expected: 6, name: 'simple case' },
      { input: {'10p':12, '£2':10}, expected: 21.2, name: 'another simple case' },
    ]
    tests.forEach( t => {
      it(t.name, () => {
        expect(v._sumCoins(t.input)).to.equal(t.expected)
      })
    })
  })

  describe('removeChange(diff)', function() {
    let v = new VendingMachine()
    v.loadCoins({'10p':10, '2p':10, '1p':10})
    let tests = [
      { input: 0, expected: {'10p':10, '2p':10, '1p':10}, name: 'no change to be given' },
      { input: 0.13, expected: {'10p':9, '2p':9, '1p':9}, name: 'simple case' },
      { input: 0.11, expected: {'10p':8, '2p':9, '1p':8}, name: 'another simple case' },
      { input: 2.10, expected: {'10p':0, '2p':0, '1p':0}, name: 'not enough change' },
    ]
    tests.forEach( t => {
      it(t.name, () => {
        v.removeChange(t.input)
        expect(v.showChange()).to.deep.equal(t.expected)
      })
    })
  })
})
