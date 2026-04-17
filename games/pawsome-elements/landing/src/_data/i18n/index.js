const merge = require('deepmerge');
const en = require('./en');
const ru = require('./ru');

function mapDeep(obj, fn) {
  if (Array.isArray(obj)) {
    return obj.map((item) => mapDeep(item, fn));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = mapDeep(obj[key], fn);
      return acc;
    }, {});
  } else {
    return fn(obj);
  }
}

function cookLocale(localeObj, locale) {
  return mapDeep(localeObj, (v) => ({ [locale]: v }));
}

const locales = [cookLocale(en, 'en'), cookLocale(ru, 'ru')];
let result = {};

locales.forEach((locale) => (result = merge(result, locale)));

module.exports = result;
