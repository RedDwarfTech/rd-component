import type { Preview } from '@storybook/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { rdComponentResources } from '../src/i18n/resources';

i18n.use(initReactI18next).init({
  resources: rdComponentResources,
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
