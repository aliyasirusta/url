const { generateShortCode } = require('../src/utils/shortCodeGenerator');

test('Should generate a valid short code', () => {
  const code = generateShortCode(6);
  expect(code).toHaveLength(6);
  expect(/^[a-zA-Z0-9]+$/.test(code)).toBe(true);
});
