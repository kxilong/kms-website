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

    sidebar: {
      "front-end": [
        {
          items: [
            {
              text: "概览",
              link: "config",
              collapsed: true,
              base: "/bywork/",
              items: [
                { text: "概览", link: "config" },
                { text: "导航栏", link: "nav" },
                { text: "侧边栏", link: "sidebar" },
                { text: "主页", link: "home-page" },
                { text: "页脚", link: "footer" },
                { text: "布局", link: "layout" },
                { text: "徽章", link: "badge" },
                { text: "团队页", link: "team-page" },
                { text: "上下页链接", link: "prev-next-links" },
                { text: "编辑链接", link: "edit-link" },
                { text: "最后更新时间戳", link: "last-updated" },
                { text: "搜索", link: "search" },
                { text: "Carbon Ads", link: "carbon-ads" },
              ],
            },
            { text: "导航栏", link: "nav" },
            { text: "侧边栏", link: "sidebar" },
            { text: "主页", link: "home-page" },
            { text: "页脚", link: "footer" },
            { text: "布局", link: "layout" },
            { text: "徽章", link: "badge" },
            { text: "团队页", link: "team-page" },
            { text: "上下页链接", link: "prev-next-links" },
            { text: "编辑链接", link: "edit-link" },
            { text: "最后更新时间戳", link: "last-updated" },
            { text: "搜索", link: "search" },
            { text: "Carbon Ads", link: "carbon-ads" },
          ],
        },
      ],
      bywork: [
        {
          items: [
            {
              text: "Index",
              base: "/bywork/",
              items: [
                { text: "概览", link: "config" },
                { text: "导航栏", link: "nav" },
                { text: "侧边栏", link: "sidebar" },
                { text: "主页", link: "home-page" },
                { text: "页脚", link: "footer" },
                { text: "布局", link: "layout" },
                { text: "徽章", link: "badge" },
                { text: "团队页", link: "team-page" },
                { text: "上下页链接", link: "prev-next-links" },
                { text: "编辑链接", link: "edit-link" },
                { text: "最后更新时间戳", link: "last-updated" },
                { text: "搜索", link: "search" },
                { text: "Carbon Ads", link: "carbon-ads" },
              ],
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
