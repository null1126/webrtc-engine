import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'WebRTC Player',
  description: 'A lightweight WebRTC video player library',

  // GitHub Pages 部署路径
  // ⚠️ 请根据你的 GitHub 仓库路径修改：
  //   - 用户仓库: /webrtc-player/
  //   - 组织仓库: /your-org/webrtc-player/
  base: '/webrtc-player/',

  // 多语言支持
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
    },
  },

  // 主题配置
  themeConfig: {
    // logo
    logo: '/logo.svg',

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/null1126/webrtc-player' }],

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    // 文档底部
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 导航栏
    nav: [
      { text: '指南', link: '/zh/guide/', activeMatch: '/zh/guide/' },
      { text: 'API', link: '/zh/api/', activeMatch: '/zh/api/' },
      { text: '示例', link: '/zh/examples/', activeMatch: '/zh/examples/' },
      {
        text: '语言',
        items: [
          { text: '简体中文', link: '/zh/' },
          { text: 'English', link: '/en/' },
        ],
      },
    ],

    // 侧边栏
    sidebar: {
      '/zh/guide/': [
        {
          text: '指南',
          items: [
            { text: '简介', link: '/zh/guide/' },
            { text: '快速开始', link: '/zh/guide/getting-started' },
            { text: '事件监听', link: '/zh/guide/events' },
          ],
        },
      ],
      '/zh/api/': [
        {
          text: 'API',
          items: [
            { text: 'WebRTCPlayer', link: '/zh/api/' },
            { text: 'PlayerOptions', link: '/zh/api/options' },
            { text: 'StateEnum', link: '/zh/api/state' },
          ],
        },
      ],
      '/zh/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础用法', link: '/zh/examples/' },
            { text: '切换视频源', link: '/zh/examples/switch-stream' },
          ],
        },
      ],
      '/en/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/en/guide/' },
            { text: 'Getting Started', link: '/en/guide/getting-started' },
            { text: 'Events', link: '/en/guide/events' },
          ],
        },
      ],
      '/en/api/': [
        {
          text: 'API',
          items: [
            { text: 'WebRTCPlayer', link: '/en/api/' },
            { text: 'PlayerOptions', link: '/en/api/options' },
            { text: 'StateEnum', link: '/en/api/state' },
          ],
        },
      ],
      '/en/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Usage', link: '/en/examples/' },
            { text: 'Switch Stream', link: '/en/examples/switch-stream' },
          ],
        },
      ],
    },

    // footer
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024 WebRTC Player',
    },
  },

  // 头部脚本
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'WebRTC Player' }],
    ['meta', { name: 'og:description', content: 'A lightweight WebRTC video player library' }],
  ],
});
