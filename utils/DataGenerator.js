const { randomBytes, randomInt } = require('node:crypto');

const SPECIAL_CHARACTERS = '!@#$%^&*()-_=+[]{}';

function shortUnique(prefix = '') {
  return `${prefix}${randomBytes(4).toString('hex')}`;
}

function randomHexColour() {
  return `#${randomBytes(3).toString('hex')}`;
}

function integerAmount(min, max) {
  if (
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    min > max ||
    max === Number.MAX_SAFE_INTEGER ||
    max - min >= 2 ** 48
  ) {
    throw new RangeError('integerAmount requires a supported range of safe integer bounds with min <= max');
  }
  return randomInt(min, max + 1);
}

function getRandomSpecialChar() {
  return SPECIAL_CHARACTERS[randomInt(0, SPECIAL_CHARACTERS.length)];
}

function generateRandomSpecialString(length) {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('String length must be a non-negative safe integer');
  }
  return Array.from({ length }, getRandomSpecialChar).join('');
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

module.exports = {
  shortUnique,
  randomHexColour,
  integerAmount,
  getRandomSpecialChar,
  generateRandomSpecialString,
  getTodayDate
};
