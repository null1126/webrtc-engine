import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';

// 导入自定义组件
import ThemeSwitch from './components/ThemeSwitch.vue';
import LanguageSwitch from './components/LanguageSwitch.vue';

export default {
  extends: DefaultTheme,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemeSwitch),
    });
  },

  enhanceApp({ app, router, siteData }) {
    // 注册自定义组件
    app.component('ThemeSwitch', ThemeSwitch);
    app.component('LanguageSwitch', LanguageSwitch);
  },
} satisfies Theme;
