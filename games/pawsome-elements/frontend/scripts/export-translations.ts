import { writeFileSync } from 'fs';
import { messages as en } from '../src/service/translation/lang/en';
import { messages as de } from '../src/service/translation/lang/de';
import { messages as es } from '../src/service/translation/lang/es';
import { messages as ru } from '../src/service/translation/lang/ru';
import { messages as fr } from '../src/service/translation/lang/fr';
import { messages as zh } from '../src/service/translation/lang/zh';
import { messages as pt } from '../src/service/translation/lang/pt';
import { messages as pl } from '../src/service/translation/lang/pl';
import { messages as nl } from '../src/service/translation/lang/nl';
import { messages as tr } from '../src/service/translation/lang/tr';
import { messages as it } from '../src/service/translation/lang/it';

(function exportTranslations() {
  console.log('🚀 Started exporting translations.');
  const translations: { locale: string; messages: any }[] = [
    { locale: 'en', messages: en.en },
    { locale: 'de', messages: de.de },
    { locale: 'es', messages: es.es },
    { locale: 'ru', messages: ru.ru },
    { locale: 'fr', messages: fr.fr },
    { locale: 'zh', messages: zh.zh },
    { locale: 'pt', messages: pt.pt },
    { locale: 'pl', messages: pl.pl },
    { locale: 'nl', messages: nl.nl },
    { locale: 'tr', messages: tr.tr },
    { locale: 'it', messages: it.it },
  ];
  translations.forEach((translation) => (translation.messages = flatten(translation.messages)));

  const localesStr = translations.map((el) => el.locale).join(', ');
  console.log(`👀 Collecting keys from ${translations.length} locale files (locales: ${localesStr}).`);
  const keys = new Set<string>();
  translations.map((el) => el.messages).forEach((messages) => Object.keys(messages).forEach((key) => keys.add(key)));
  console.log(`👀 Got ${keys.size} translation keys.`);

  console.log(`👀 Identifying missing translations.`);
  translations.forEach((translation) =>
    keys.forEach((key) => {
      if ([undefined, null].includes(translation.messages[key])) {
        console.warn(`⚠️ Missing key, locale: "${translation.locale}", key: "${key}".`);
      }
    }),
  );

  console.log(`👀 Exporting translations CSV to dist/translations.csv.`);
  let csvString = `Key,${translations.map((el) => el.locale).join(',')}\n`;
  keys.forEach((key) => {
    csvString += `${key},${translations.map((el) => escapeCsvField(el.messages[key] || '')).join(',')}\n`;
  });

  writeCsvToFile(csvString);

  console.log('✅ Finished exporting translations.');

  function writeCsvToFile(csvString) {
    writeFileSync('dist/translations.csv', csvString, 'utf8');
  }

  function escapeCsvField(str) {
    if (typeof str !== 'string') str = String(str);
    // Escape double quotes by doubling them
    str = str.replace(/"/g, '""');
    // Wrap in quotes if contains comma, newline, or quotes
    if (/[",\n]/.test(str)) {
      str = `"${str}"`;
    }
    return str;
  }

  function flatten(obj, prefix = '') {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        Object.assign(acc, flatten(val, newKey));
      } else {
        acc[newKey] = val;
      }
      return acc;
    }, {});
  }
})();
