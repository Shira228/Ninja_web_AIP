const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../data').data;
test('seed data has unique slugs and required fields', () => {
  assert.ok(data.length >= 5);
  assert.equal(new Set(data.map((item) => item.nick)).size, data.length);
  for (const item of data) {
    assert.ok(item.title && item.nick && item.category && item.desc);
  }
});
