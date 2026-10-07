import test from 'node:test';
import assert from 'node:assert/strict';
import {submissionEndpoint,isSubmissionEndpoint} from './submission-config.js';
test('accept deployed XTEC and standard Apps Script endpoints',()=>{assert.equal(isSubmissionEndpoint(submissionEndpoint),true);assert.equal(isSubmissionEndpoint('https://script.google.com/macros/s/ABC-123/exec'),true);});
test('reject alternate hosts, insecure URLs and development endpoints',()=>{for(const url of ['https://script.google.com.evil.test/macros/s/ABC/exec','http://script.google.com/macros/s/ABC/exec','https://script.google.com/macros/s/ABC/dev'])assert.equal(isSubmissionEndpoint(url),false);});
