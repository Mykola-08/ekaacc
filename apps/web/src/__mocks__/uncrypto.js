// Mock uncrypto for Jest tests
const crypto = require('crypto');

module.exports = {
  default: crypto.webcrypto || crypto,
  getRandomValues: (arr) => crypto.getRandomValues(arr),
  randomUUID: () => crypto.randomUUID(),
  subtle: crypto.webcrypto?.subtle || crypto.subtle,
};
