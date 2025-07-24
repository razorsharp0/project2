import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Lost and Found',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      lost: 'Lost',
      found: 'Found',
      report: 'Report Item',
      search: 'Search',
      claim: 'Claim',
      admin: 'Admin Panel',
    },
  },
  ar: {
    translation: {
      welcome: 'مرحبًا بك في المفقودات والموجودات',
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      logout: 'تسجيل الخروج',
      lost: 'مفقود',
      found: 'موجود',
      report: 'تقرير عنصر',
      search: 'بحث',
      claim: 'مطالبة',
      admin: 'لوحة الإدارة',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n; 