const test = require('node:test');
const assert = require('node:assert/strict');
const { check } = require('./check-dependency-audit.cjs');
function fixture(dev = true, url = 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm') {
  return [{ metadata: { vulnerabilities: {} }, vulnerabilities: {
    braces: { severity: 'high', nodes: ['node_modules/braces'], via: [{ severity: 'high', url }] },
    builder: { severity: 'high', nodes: ['node_modules/builder'], via: ['braces'] }
  } }, { packages: { 'node_modules/braces': { dev }, 'node_modules/builder': { dev } } }];
}
test('reviewed advisory is accepted only for development dependency chains', () => {
  assert.deepEqual(check(...fixture()).blocked, []);
  assert.deepEqual(check(...fixture(false)).blocked.sort(), ['braces', 'builder']);
});
test('a new advisory in an already reviewed package still blocks CI', () => {
  assert.deepEqual(check(...fixture(true, 'https://github.com/advisories/NEW')).blocked.sort(), ['braces', 'builder']);
});
test('missing lock entries do not silently classify a dependency as development', () => {
  const [report, lock] = fixture(); delete lock.packages['node_modules/braces'];
  assert.deepEqual(check(report, lock).blocked, ['braces']);
});
test('registry failure or incomplete diagnostic cannot pass as a clean audit', () => {
  assert.throws(() => check({error:{}}, {packages:{}}));
});
