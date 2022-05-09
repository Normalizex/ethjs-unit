/**
    Primary Attribution
    Richard Moore <ricmoo@me.com>
    https://github.com/ethers-io

    Fork and Refactor by Normalizex
    https://github.com/Normalizex
*/
declare const unitMap: {
    noether: number;
    wei: number;
    kwei: number;
    Kwei: number;
    babbage: number;
    femtoether: number;
    mwei: number;
    Mwei: number;
    lovelace: number;
    picoether: number;
    gwei: number;
    Gwei: number;
    shannon: number;
    nanoether: number;
    nano: number;
    szabo: number;
    microether: number;
    micro: number;
    finney: number;
    milliether: number;
    milli: number;
    ether: number;
    kether: number;
    grand: number;
    mether: number;
    gether: number;
    tether: number;
};
/**
 * Returns value of unit in Wei
 *
 * @param unitInput -  the unit to convert to, default ether
 * @returns value of the unit (in Wei)
 * @throws error if the unit is not correct:w
*/
declare const getDecimalsOfUnit: (unitInput: string | number) => number;
/**
 * @param numberInput
 * @param decimals - Number of zeros
 * @returns number in units
*/
export declare const toWeiByDecimals: (numberInput: string | number, decimals: number | string) => string;
interface fromWeiOptions {
    pad?: boolean;
    commify?: boolean;
}
export declare const fromWeiByDecimals: (numberInput: string | number, decimals: number | string, options?: fromWeiOptions) => string;
/**
 * @param numberInput
 * @param unit - The name or value of unitMap
 * - 'ether', 'wei'
 * - '18', 21, '3'
 * @returns number in units
*/
export declare const toWei: (numberInput: string | number, unit: string) => string;
/**
 * @param unitInput
 * @param unit - The name or value of unitMap
 * - 'ether', 'wei'
 * - '18', 21, '3'
 * @returns number in units
*/
export declare const fromWei: (unitInput: string | number, unit: string, options?: fromWeiOptions) => string;
export { unitMap, getDecimalsOfUnit, };
