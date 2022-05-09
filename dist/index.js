"use strict";
/**
    Primary Attribution
    Richard Moore <ricmoo@me.com>
    https://github.com/ethers-io

    Fork and Refactor by Normalizex
    https://github.com/Normalizex
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecimalsOfUnit = exports.unitMap = exports.fromWei = exports.toWei = exports.fromWeiByDecimals = exports.toWeiByDecimals = void 0;
var bn_js_1 = __importDefault(require("bn.js"));
var unitMap = {
    noether: 0,
    wei: 0,
    kwei: 3,
    Kwei: 3,
    babbage: 3,
    femtoether: 3,
    mwei: 6,
    Mwei: 6,
    lovelace: 6,
    picoether: 6,
    gwei: 9,
    Gwei: 9,
    shannon: 9,
    nanoether: 9,
    nano: 9,
    szabo: 12,
    microether: 12,
    micro: 12,
    finney: 15,
    milliether: 15,
    milli: 15,
    ether: 18,
    kether: 21,
    grand: 21,
    mether: 24,
    gether: 27,
    tether: 30,
};
exports.unitMap = unitMap;
/**
 * Returns value of unit in Wei
 *
 * @param unitInput -  the unit to convert to, default ether
 * @returns value of the unit (in Wei)
 * @throws error if the unit is not correct:w
*/
var getDecimalsOfUnit = function (unitInput) {
    var _a;
    var unit = unitInput.toString();
    var unitValue = (_a = Object
        .entries(unitMap)
        .find(function (content) {
        return content[0] === unit ||
            content[1] === Number(unit);
    })) === null || _a === void 0 ? void 0 : _a.slice(-1)[0];
    if (typeof unitValue === 'undefined')
        throw new Error("[ethjs-unit] the unit provided " + unitInput + " doesn't exists, please use the one of the following units " + JSON.stringify(unitMap, null, 2));
    return Number(unitValue);
};
exports.getDecimalsOfUnit = getDecimalsOfUnit;
/**
 * @param numberInput
 * @param decimals - Number of zeros
 * @returns number in units
*/
var toWeiByDecimals = function (numberInput, decimals) {
    if (isNaN(Number(decimals)))
        throw new Error("[ethjs-unit] while converting number " + numberInput + " to wei, invalid decimals");
    var unitValue = "1" + '0'.repeat(Number(decimals));
    var base = new bn_js_1.default(unitValue, 10);
    var baseLength = unitValue.length - 1 || 1;
    var etherValue = numberInput.toString().slice();
    var negative = (etherValue.substring(0, 1) === '-');
    if (negative)
        etherValue = etherValue.substring(1);
    if (etherValue === '.')
        throw new Error("[ethjs-unit] while converting number " + numberInput + " to wei, invalid value");
    var comps = etherValue.split('.');
    if (comps.length > 2)
        throw new Error("[ethjs-unit] while converting number " + numberInput + " to wei,  too many decimal points");
    var _a = comps[0], whole = _a === void 0 ? '0' : _a, _b = comps[1], fraction = _b === void 0 ? '0' : _b;
    if (fraction.length > baseLength)
        throw new Error("[ethjs-unit] while converting number " + numberInput + " to wei, too many decimal places");
    var num = new bn_js_1.default(whole)
        .mul(base)
        .add(new bn_js_1.default(fraction + '0'.repeat(baseLength - fraction.length)));
    return (negative ? num.mul(new bn_js_1.default(-1)) : num).toString(10);
};
exports.toWeiByDecimals = toWeiByDecimals;
var fromWeiByDecimals = function (numberInput, decimals, options) {
    var _a;
    if (options === void 0) { options = {}; }
    if (isNaN(Number(decimals)))
        throw new Error("[ethjs-unit] while converting number " + numberInput + " to wei, invalid decimals");
    var unitValue = "1" + '0'.repeat(Number(decimals));
    var base = new bn_js_1.default(unitValue, 10);
    var baseLength = unitValue.length - 1 || 1;
    var negative = new bn_js_1.default(numberInput.toString()).lt(new bn_js_1.default(0));
    var wei = negative
        ? new bn_js_1.default(numberInput.toString()).mul(new bn_js_1.default(-1))
        : new bn_js_1.default(numberInput.toString());
    var fraction = wei.mod(base).toString(10);
    var whole = wei.div(base).toString(10);
    while (fraction.length < baseLength) {
        fraction = "0" + fraction;
    }
    if (!options.pad)
        fraction = ((_a = fraction.match(/^([0-9]*[1-9]|0)(0*)/)) === null || _a === void 0 ? void 0 : _a.slice(0)[1]) || fraction;
    if (options.commify)
        whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return "" + (negative ? "-" : "") + whole + (fraction == '0' ? '' : "." + fraction);
};
exports.fromWeiByDecimals = fromWeiByDecimals;
/**
 * @param numberInput
 * @param unit - The name or value of unitMap
 * - 'ether', 'wei'
 * - '18', 21, '3'
 * @returns number in units
*/
var toWei = function (numberInput, unit) {
    return exports.toWeiByDecimals(numberInput, getDecimalsOfUnit(unit));
};
exports.toWei = toWei;
/**
 * @param unitInput
 * @param unit - The name or value of unitMap
 * - 'ether', 'wei'
 * - '18', 21, '3'
 * @returns number in units
*/
var fromWei = function (unitInput, unit, options) {
    if (options === void 0) { options = {}; }
    return exports.fromWeiByDecimals(unitInput, getDecimalsOfUnit(unit), options);
};
exports.fromWei = fromWei;
//# sourceMappingURL=index.js.map