/**
	Primary Attribution
	Richard Moore <ricmoo@me.com>
	https://github.com/ethers-io

	Fork and Refactor by Normalizex
	https://github.com/Normalizex
*/

import BN from 'bn.js';

const unitMap = {
	noether:      0,
	wei:          0,
	kwei:         3, 
	Kwei:         3, 
	babbage:      3, 
	femtoether:   3, 
	mwei:         6, 
	Mwei:         6, 
	lovelace:     6, 
	picoether:    6, 
	gwei:         9, 
	Gwei:         9, 
	shannon:      9, 
	nanoether:    9, 
	nano:         9, 
	szabo:        12, 
	microether:   12, 
	micro:        12, 
	finney:       15, 
	milliether:   15, 
	milli:        15, 
	ether:        18, 
	kether:       21, 
	grand:        21, 
	mether:       24, 
	gether:       27, 
	tether:       30, 
};

/**
 * Returns value of unit in Wei
 *
 * @param unitInput -  the unit to convert to, default ether
 * @returns value of the unit (in Wei)
 * @throws error if the unit is not correct:w
*/
const getDecimalsOfUnit = (unitInput: string | number) => {
	const unit = unitInput.toString();

	const unitValue = Object
		.entries(unitMap)
		.find((content) =>
			content[0] === unit ||
			content[1] === Number(unit)
		)?.slice(-1)[0];

	if (typeof unitValue === 'undefined')
		throw new Error(`[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(unitMap, null, 2)}`);
  
	return Number(unitValue);
}

/**
 * @param numberInput
 * @param decimals - Number of zeros
 * @returns number in units
*/
export const toWeiByDecimals = (numberInput: string | number, decimals: number | string) => {
	if (isNaN(Number(decimals)))
		throw new Error(`[ethjs-unit] while converting number ${numberInput} to wei, invalid decimals`);

	const unitValue = `1${'0'.repeat(Number(decimals))}`;
	const base = new BN(unitValue, 10);
	const baseLength = unitValue.length - 1 || 1;

	let etherValue = numberInput.toString().slice();

	const negative = (etherValue.substring(0, 1) === '-');
	if (negative) etherValue = etherValue.substring(1);
	if (etherValue === '.')
		throw new Error(`[ethjs-unit] while converting number ${numberInput} to wei, invalid value`);

	const comps = etherValue.split('.');
	if (comps.length > 2)
		throw new Error(`[ethjs-unit] while converting number ${numberInput} to wei,  too many decimal points`);

	const [whole = '0', fraction = '0'] = comps;

	if (fraction.length > baseLength)
		throw new Error(`[ethjs-unit] while converting number ${numberInput} to wei, too many decimal places`);
	
	const num = new BN(whole)
		.mul(base)
		.add(new BN(fraction + '0'.repeat(baseLength - fraction.length)));

	return (negative ? num.mul(new BN(-1)) : num).toString(10);
}

interface fromWeiOptions {
	pad?: boolean,
	commify?: boolean
}

export const fromWeiByDecimals = (
	numberInput: string | number,
	decimals: number | string,
	options: fromWeiOptions = {}
) => {
	if (isNaN(Number(decimals)))
		throw new Error(`[ethjs-unit] while converting number ${numberInput} to wei, invalid decimals`);

	const unitValue = `1${'0'.repeat(Number(decimals))}`;
	const base = new BN(unitValue, 10);
	const baseLength = unitValue.length - 1 || 1;
	const negative = new BN(numberInput.toString()).lt(new BN(0));
	const wei = negative
		? new BN(numberInput.toString()).mul(new BN(-1))
		: new BN(numberInput.toString())

	let fraction = wei.mod(base).toString(10);
	let whole = wei.div(base).toString(10);

	while (fraction.length < baseLength) {
		fraction = `0${fraction}`;
	}

	if (!options.pad) fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)?.slice(0)[1] || fraction;
	if (options.commify) whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	
	return `${negative ? "-": ""}${whole}${fraction == '0' ? '' : `.${fraction}`}`;
};

/**
 * @param numberInput 
 * @param unit - The name or value of unitMap
 * - 'ether', 'wei'
 * - '18', 21, '3'
 * @returns number in units
*/
export const toWei = (numberInput: string | number, unit: string) =>
	toWeiByDecimals(numberInput, getDecimalsOfUnit(unit));

/**
 * @param unitInput 
 * @param unit - The name or value of unitMap
 * - 'ether', 'wei'
 * - '18', 21, '3'
 * @returns number in units
*/
export const fromWei = (
	unitInput: string | number,
	unit: string,
	options: fromWeiOptions = {}
) =>
	fromWeiByDecimals(unitInput, getDecimalsOfUnit(unit), options);

export {
	unitMap,
	getDecimalsOfUnit,
}