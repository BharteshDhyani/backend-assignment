import _get from 'lodash/get';
import en from './en';
import hi from './hi';
import es from './es';

/**
 * Object with the languages available.
 */
const languages: any = {
  en: en,
  hi: hi,
  es: es,
};

/**
 * Replaces the parameters of a message with the args.
 */
function format(
  message: string,
  args: string[],
): string | undefined {
  if (!message) {
    return undefined;
  }

  return message.replace(
    /{(\d+)}/g,
    function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match;
    },
  );
}

/**
 * Checks if the key exists on the language.
 */
export const i18nExists = (
  languageCode: string = 'en',
  key: string,
) => {
  const dictionary =
    languages[languageCode] || languages['en'];
  const message = _get(dictionary, key);
  return Boolean(message);
};

/**
 * Returns the translation based on the key.
 */
export const i18n = (
  languageCode: string = 'en',
  key: string,
  ...args: string[]
): string | undefined => {
  const dictionary =
    languages[languageCode] || languages['en'];
  const message = _get(dictionary, key);

  if (!message) {
    return key;
  }

  return format(message, args);
};
