import assert from 'node:assert/strict';
import test from 'node:test';
import { ESLint } from 'eslint';

const eslint = new ESLint();

test('browser source does not inherit Node globals', async () => {
  const [result] = await eslint.lintText(
    'export const value = process.env.NODE_ENV;\n',
    { filePath: 'src/browser-global-check.mjs' },
  );

  assert.ok(
    result.messages.some(
      (message) => message.ruleId === 'no-undef' && message.message.includes("'process'"),
    ),
    'process should be reported as undefined in browser source',
  );
});

test('Node-only files allow Node globals', async () => {
  const [result] = await eslint.lintText(
    'export const value = process.env.NODE_ENV;\n',
    { filePath: 'scripts/node-global-check.mjs' },
  );

  assert.equal(result.errorCount, 0);
});
