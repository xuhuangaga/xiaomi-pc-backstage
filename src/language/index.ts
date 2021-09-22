import { createI18n } from 'vue-i18n';
import zh from '../locales/zh-CN';
import en from '../locales/en-US';
import tw from '../locales/zh-TW';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('language') || 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en,
    'zh-TW': tw
  }
});

export default i18n;