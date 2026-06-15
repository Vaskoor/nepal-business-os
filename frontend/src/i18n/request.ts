import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default,
  timeZone: 'Asia/Kathmandu',
  onError: (error) => {
    console.error('i18n error:', error);
  },
}));
