import { i18n, i18nExists } from '../i18n';
import CustomError from './CustomError';

export default class Error403 extends CustomError {
  constructor(language?: string, messageCode?: string) {
    let message;

    if (messageCode && i18nExists(language, messageCode)) {
      message = i18n(language, messageCode);
    }

    message =
      message || i18n(language, 'errors.forbidden.message');

    super(message);
    this.code = 403;
  }
}
