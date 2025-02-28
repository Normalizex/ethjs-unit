const units = require('../dist/index.js'); // eslint-disable-line
const BigNumber = require('bn.js'); // eslint-disable-line
const ActualBigNumber = require('bignumber.js');
const Web3 = require('web3'); // eslint-disable-line
const web3 = new Web3(); // eslint-disable-line
const assert = require('chai').assert; // eslint-disable-line
const totalTypes = Object.keys(units.unitMap).length;

function testRandomValueAgainstWeb3ToWei(negative) {
  const stringTestValue = `${negative ? '-' : ''}${String(Math.floor((Math.random() * 100000000000000000) + 1))}`;
  const randomunitsType = Object.keys(units.unitMap)[Math.floor((Math.random() * (totalTypes - 1)) + 1)];
  const unitsValue = units.toWei(stringTestValue, randomunitsType);
  const web3Value = web3.toWei(stringTestValue, randomunitsType);

  // it(`toWei should work like web3 val ${unitsValue} should equal ${web3Value}`, () => {
  assert.deepEqual(unitsValue, web3Value);
  // });
}

function testRandomValueAgainstWeb3FromWei(negative) {
  const stringTestValue = `${negative ? '-' : ''}${String(Math.floor((Math.random() * 100000000000000000) + 1))}`;
  const randomunitsType = Object.keys(units.unitMap)[Math.floor((Math.random() * (totalTypes - 1)) + 1)];
  const unitsValue = units.fromWei(stringTestValue, randomunitsType);
  const web3Value = web3.fromWei(stringTestValue, randomunitsType);

  // it(`fromWei should work like web3 rounded val ${unitsValue.substr(0, web3Value.length - 1)} should equal ${web3Value.substr(0, web3Value.length - 1)} for unit type ${randomunitsType}`, () => {
  assert.deepEqual(unitsValue.substr(0, web3Value.length - 1), web3Value.substr(0, web3Value.length - 1));
  // });
}

describe('getValueOfUnit', () => {
  it('should throw when undefined or not string', () => {
    function invalidFromWei() {
      units.fromWei(1000000000000000000, 'something');
    }
    assert.throws(invalidFromWei, Error);
  });
});

describe('toWei', () => {
  it('should handle edge cases', () => {
    assert.equal(units.toWei(0, 'wei'), '0');
    assert.equal(units.toWei('0.0', 'wei'), '0');
    assert.equal(units.toWei('.3', 'ether'), '300000000000000000');
    assert.throws(() => units.toWei('.', 'wei'), Error);
    assert.throws(() => units.toWei('1.243842387924387924897423897423', 'ether'), Error);
    assert.throws(() => units.toWei('8723.98234.98234', 'ether'), Error);
  });

  it('should return the correct value', () => {
    assert.equal(units.toWei(1, 'wei'), '1');
    assert.equal(units.toWei(1, 'kwei'), '1000');
    assert.equal(units.toWei(1, 'Kwei'), '1000');
    assert.equal(units.toWei(1, 'babbage'), '1000');
    assert.equal(units.toWei(1, 'mwei'), '1000000');
    assert.equal(units.toWei(1, 'Mwei'), '1000000');
    assert.equal(units.toWei(1, 'lovelace'), '1000000');
    assert.equal(units.toWei(1, 'gwei'), '1000000000');
    assert.equal(units.toWei(1, 'Gwei'), '1000000000');
    assert.equal(units.toWei(1, 'shannon'), '1000000000');
    assert.equal(units.toWei(1, 'szabo'), '1000000000000');
    assert.equal(units.toWei(1, 'finney'), '1000000000000000');
    assert.equal(units.toWei(1, 'ether'), '1000000000000000000');
    assert.equal(units.toWei(1, 'kether'), '1000000000000000000000');
    assert.equal(units.toWei(1, 'grand'), '1000000000000000000000');
    assert.equal(units.toWei(1, 'mether'), '1000000000000000000000000');
    assert.equal(units.toWei(1, 'gether'), '1000000000000000000000000000');
    assert.equal(units.toWei(1, 'tether'), '1000000000000000000000000000000');

    assert.equal(units.toWei(1, 'kwei'), units.toWei(1, 'femtoether'));
    assert.equal(units.toWei(1, 'szabo'), units.toWei(1, 'microether'));
    assert.equal(units.toWei(1, 'finney'), units.toWei(1, 'milliether'));
    assert.equal(units.toWei(1, 'milli'), units.toWei(1, 'milliether'));
    assert.equal(units.toWei(1, 'milli'), units.toWei(1000, 'micro'));

    assert.throws(() => { units.toWei(1, 'wei1'); }, Error);
  });
});

describe('fromWei', () => {
  it('should handle options', () => {
    assert.equal(units.fromWei(10000000, 'wei', { commify: true }), '10,000,000');
  });

  it('should return the correct value', () => {
    assert.equal(units.fromWei(1000000000000000000, 'wei'), '1000000000000000000');
    assert.equal(units.fromWei(1000000000000000000, 'kwei'), '1000000000000000');
    assert.equal(units.fromWei(1000000000000000000, 'mwei'), '1000000000000');
    assert.equal(units.fromWei(1000000000000000000, 'gwei'), '1000000000');
    assert.equal(units.fromWei(1000000000000000000, 'szabo'), '1000000');
    assert.equal(units.fromWei(1000000000000000000, 'finney'), '1000');
    assert.equal(units.fromWei(1000000000000000000, 'ether'), '1');
    assert.equal(units.fromWei(1000000000000000000, 'kether'), '0.001');
    assert.equal(units.fromWei(1000000000000000000, 'grand'), '0.001');
    assert.equal(units.fromWei(1000000000000000000, 'mether'), '0.000001');
    assert.equal(units.fromWei(1000000000000000000, 'gether'), '0.000000001');
    assert.equal(units.fromWei(1000000000000000000, 'tether'), '0.000000000001');
  });
});

describe('units', () => {
  describe('normal functionality', () => {
    it('should be the same as web3', () => {
      for (var i = 0; i < 15000; i++) { // eslint-disable-line
        testRandomValueAgainstWeb3ToWei(false);
        testRandomValueAgainstWeb3ToWei(true);
        testRandomValueAgainstWeb3FromWei(false);
        testRandomValueAgainstWeb3FromWei(true);
      }
    });
  });
});