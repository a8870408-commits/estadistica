import test from 'node:test';
import assert from 'node:assert/strict';
import {summarize} from './stats.js';
test('summary handles sorted median, mean and frequency',()=>{const s=summarize([8,3,2,4,3]);assert.equal(s.mean,4);assert.equal(s.median,3);assert.deepEqual(s.modes,[3]);assert.deepEqual(s.counts,[[2,1],[3,2],[4,1],[8,1]]);});
test('even median and multiple modes',()=>{const s=summarize([7,2,4,3]);assert.equal(s.median,3.5);assert.deepEqual(s.modes,[]);assert.deepEqual(summarize([1,1,2,2]).modes,[1,2]);});
test('decimals, negatives and invalid input',()=>{assert.equal(summarize([-1,2.5]).mean,.75);assert.throws(()=>summarize([]));assert.throws(()=>summarize([NaN]));assert.throws(()=>summarize([Infinity]));});
