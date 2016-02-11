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
      },
      //{ 
      //  input: {'10p':9, '50p':10},
      //  expected: undefined,
      //  name: 'not enough change'
      //},
      //{ 
      //  input: {'13p':4},
      //  expected: undefined,
      //  name: 'invalid coin'
      //}
    ]
    tests.forEach( t => {
      it(t.name, () => {
        expect(v.removeCoins(t.input)).to.deep.equal(t.expected)
      })
    })
  })

  describe('removeProducts(products)', function() {
    let v = new VendingMachine()
    v.loadProducts({'coke':10, 'mars bar':10});
    let tests = [
      {
        input: {'coke':2, 'mars bar':3},
        expected: {'coke':8, 'mars bar':7},
        name: 'simple case'
      },
      //{ 
      //  input: {'coke':2, 'mars bar':3},
      //  expected: undefined,
      //  name: 'not enough products'
      //},
      //{ 
      //  input: {'shoe':100},
      //  expected: undefined,
      //  name: 'invalid product'
      //}
    ]
    tests.forEach( t => {
      it(t.name, () => {
        expect(v.removeProducts(t.input)).to.deep.equal(t.expected)
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

  describe('calculateChange() no product selected', function() {
    let v = new VendingMachine()
    it('no product selected', () => {
      expect(v.calculateChange()).to.equal(undefined)
    })
  })

  describe('insertCoin(coin)', function() {
    let v = new VendingMachine()
    v.loadProducts({'coke':2, 'mars bar':2})
    v.selectProduct('coke')

    let tests = [
      { input: '10p', expected: 0.9, name: 'need more coins' },
      { input: '13p', expected: undefined, name: 'invalid coin' },
      { input: '£1', expected: -0.1, name: 'give change' },
    ]

    tests.forEach( t => {
      it(t.name, () => {
        expect(v.insertCoin(t.input)).to.equal(t.expected)
      })
    })

    it('no product selected', () => {
      expect(v.insertCoin('£1')).to.equal(undefined)
    })

    v.selectProduct('coke')
    it('exact change', () => { expect(v.insertCoin('£1')).to.equal(0) })
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
})
