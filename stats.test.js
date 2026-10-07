import test from 'node:test';
import assert from 'node:assert/strict';
import {summarize} from './stats.js';
test('summary handles sorted median, mean and frequency',()=>{const s=summarize([8,3,2,4,3]);assert.equal(s.mean,4);assert.equal(s.median,3);assert.deepEqual(s.modes,[3]);assert.deepEqual(s.counts,[[2,1],[3,2],[4,1],[8,1]]);});
test('even median and multiple modes',()=>{const s=summarize([7,2,4,3]);assert.equal(s.median,3.5);assert.deepEqual(s.modes,[]);assert.deepEqual(summarize([1,1,2,2]).modes,[1,2]);});
test('decimals, negatives and invalid input',()=>{assert.equal(summarize([-1,2.5]).mean,.75);assert.throws(()=>summarize([]));assert.throws(()=>summarize([NaN]));assert.throws(()=>summarize([Infinity]));});

import {parseData,frequencies,toCSV} from './stats.js';
test('parse Catalan decimals and reject malformed numeric data',()=>{assert.deepEqual(parseData('2,5; -1; 3.5'),[2.5,-1,3.5]);assert.throws(()=>parseData('2, 3'));assert.throws(()=>parseData(''));assert.throws(()=>parseData(Array(101).fill('1').join(';')));});
test('category normalization and relative frequencies',()=>{const values=parseData('A peu; bicicleta; a PEU',true);assert.deepEqual(values,['a peu','bicicleta','a peu']);assert.equal(frequencies(values)[0].relative,2/3);assert.throws(()=>parseData('a;;b',true));});
test('CSV escapes quotes and includes frequency data',()=>{const csv=toCSV(frequencies(['a"b','a"b','c']));assert.ok(csv.includes('"a""b";"2"'));assert.ok(csv.includes('Freqüència relativa'));});
