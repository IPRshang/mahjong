export default {
  title: '麻趣阁',
  description: '学技巧 · 找场馆 · 看主播 · 买好物 · 约牌局',
  lang: 'zh-CN',
  base: '/mahjong/',
  lastUpdated: true,

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' }
  },

  search: {
    provider: 'local'
  },

  themeConfig: {
    lastUpdated: {
      text: '最后更新'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '麻将技巧', link: '/skills/' },
      { text: '场馆推荐', link: '/venues/' },
      { text: '主播推荐', link: '/streamers/' },
      { text: '周边好物', link: '/goods/' },
      { text: '线上娱乐', link: '/play/' }
    ],

    sidebar: {
      '/skills/': [
        { text: '技巧总览', link: '/skills/' },
        { text: '四川麻将', link: '/skills/sichuan' },
        { text: '广东麻将', link: '/skills/guangdong' },
        { text: '国标麻将', link: '/skills/guobiao' },
        { text: '日本麻将', link: '/skills/riichi' },
        { text: '各地规则', link: '/skills/rules' },
        { text: '防老千秘籍', link: '/skills/anti-cheat' }
      ],
      '/venues/': [
        { text: '场馆推荐', link: '/venues/' }
      ],
      '/streamers/': [
        { text: '主播推荐', link: '/streamers/' }
      ],
      '/goods/': [
        { text: '周边好物', link: '/goods/' }
      ],
      '/play/': [
        { text: '线上娱乐', link: '/play/' }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '麻趣阁 - 麻将爱好者的聚集地',
      copyright: 'Copyright © 2026 麻趣阁'
    }
  }
}
