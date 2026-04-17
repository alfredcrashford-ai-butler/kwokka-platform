const eleventySass = require('eleventy-sass');
const i18n = require('eleventy-plugin-i18n');
const { minify } = require('terser');
const translations = require('./src/_data/i18n');
const { format } = require('date-fns/format');
const cookieConsentCSS = require.resolve('@kwokka/cookie-consent/style.css');
const cookieConsentJS = require.resolve('@kwokka/cookie-consent');

function setupScriptsMinification(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncFilter('jsmin', async function (code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error('Terser error: ', err);
      callback(null, code);
    }
  });
}

function setupSass(eleventyConfig) {
  eleventyConfig.addPlugin(eleventySass);
}

function setupTranslations(eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en',
    },
  });
}

function setupFilters(eleventyConfig) {
  eleventyConfig.addFilter('date', function (date, dateFormat) {
    return format(date, dateFormat);
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    'html',
    'njk',
    'md',
    'js',
    // Static Assets:
    'jpeg',
    'jpg',
    'png',
    'webp',
    'svg',
    'woff',
    'woff2',
    'mp4',
  ]);
  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/robots.txt');
  eleventyConfig.addPassthroughCopy('src/ads.txt');
  eleventyConfig.addPassthroughCopy({
    [cookieConsentCSS]: 'style/cookie-consent.css',
    [cookieConsentJS]: 'public/script/cookie-consent-lib.js',
  });

  setupSass(eleventyConfig);
  setupScriptsMinification(eleventyConfig);
  setupTranslations(eleventyConfig);
  setupFilters(eleventyConfig);

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      output: 'dist',
    },
  };
};
