import { defineConfig } from "vitepress";

export default defineConfig({
  title: "知识笔记",
  head: [
    [
      "link",
      { rel: "icon", href: "https://vitepress.dev/vitepress-logo-mini.svg" },
    ],
  ],
  appearance: true,
  base: "/kms-website/",
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: "true",
  markdown: {
    lineNumbers: true,
  },
  // theme related configurations.

  themeConfig: {
    logo: "https://vitepress.dev/vitepress-logo-mini.svg",
    lastUpdatedText: "最近更新时间",
    outline: "deep",
    outlineTitle: "本页目录",
    editLink: {
      pattern: "https://github.com/kxilong/kms-website/tree/master/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },

    nav: nav(),

    sidebar: {
      "/front-end/": sidebarFrontEnd(),
      "/bywork/": sidebarByWork(),
    },

    footer: {
      message: "基于 MIT 许可发布",
      copyright: "Copyright © 2024-present lison",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    darkModeSwitchLabel: "外观",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    langMenuLabel: "选择语言",
  },
});

function nav() {
  return [
    { text: "前端", link: "/front-end/" },
    { text: "副业", link: "/bywork/" },
  ];
}

function sidebarFrontEnd() {
  return [
    {
      text: "前言",
      link: "/front-end/",
    },
    {
      text: "Javascript进阶",
      collapsed: false,
      items: [
        {
          text: "javaScript 内存管理",
          link: "/front-end/javaScript 内存管理",
        },
        { text: "提高代码的可靠性", link: "/front-end/提高代码的可靠性" },
        {
          text: "compose 函数 pipe 函数",
          link: "/front-end/compose 函数 pipe 函数",
        },
        {
          text: "常用函数",
          link: "/front-end/常用函数",
        },
        {
          text: "防抖和节流",
          link: "/front-end/防抖和节流",
        },
        {
          text: "深拷贝和浅拷贝",
          link: "/front-end/深拷贝和浅拷贝",
        },
      ],
    },
    {
      text: "异步编程",
      collapsed: false,
      items: [
        {
          text: "理解异步",
          link: "/front-end/理解异步",
        },
        {
          text: "Event Loop 机制",
          link: "/front-end/Event Loop 机制",
        },
        {
          text: "异步编程方法-发布订阅",
          link: "/front-end/异步编程方法-发布订阅",
        },
        {
          text: "深入理解 promise",
          link: "/front-end/深入理解 promise",
        },
        {
          text: "Generator 函数及其异步的应用",
          link: "/front-end/Generator 函数及其异步的应用",
        },
      ],
    },
  ];
}

function sidebarByWork() {
  return [
    {
      text: "前言",
      link: "/bywork/",
    },
    {
      text: "Javascript进阶",
      collapsed: false,
      items: [
        {
          text: "AI代写",
          link: "/bywork/AI代写",
        },
      ],
    },
  ];
}
