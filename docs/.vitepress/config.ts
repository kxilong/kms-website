import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/kms-website/",
  title: "知识笔记",
  head: [
    [
      "link",
      { rel: "icon", href: "https://vitepress.dev/vitepress-logo-mini.svg" },
    ],
  ],
  themeConfig: {
    logo: "https://vitepress.dev/vitepress-logo-mini.svg",
    nav: [
      { text: "前端", link: "/front-end/" },
      { text: "副业", link: "/bywork/" },
    ],
    outline: {
      label: "页面导航",
    },
    sidebar: {
      "front-end": [
        {
          text: "Javascript进阶",
          collapsed: false,
          base: "/front-end/",
          items: [
            {
              text: "javaScript 内存管理",
              link: "javaScript 内存管理",
            },
            {
              text: "提高代码的可靠性",
              link: "提高代码的可靠性",
            },
            {
              text: "compose 函数 pipe 函数",
              link: "compose 函数 pipe 函数",
            },
            {
              text: "常用函数",
              link: "常用函数",
            },
            {
              text: "防抖和节流",
              link: "防抖和节流",
            },
            {
              text: "深拷贝和浅拷贝",
              link: "深拷贝和浅拷贝",
            },
          ],
        },
      ],
      bywork: [
        {
          base: "/bywork/",
          items: [
            {
              text: "AI代写",
              link: "AI代写",
            },
          ],
        },
      ],
    },
    search: {
      provider: "local",
    },
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "Copyright © 2024-present lison",
    },
  },
});
