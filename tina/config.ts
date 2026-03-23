import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "entry",
        label: "内容条目",
        path: "content/sections",
        format: "mdx",
        ui: {
          router: ({ document }) => {
            const breadcrumbs = document._sys.breadcrumbs || [];
            const articleSlug = breadcrumbs[breadcrumbs.length - 1];
            const section = breadcrumbs[breadcrumbs.length - 2];

            if (!section || !articleSlug) {
              return "/sections";
            }

            return `/sections/${section}/${articleSlug}`;
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "标题",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "日期",
            required: true
          },
          {
            type: "string",
            name: "summary",
            label: "摘要",
            required: true
          },
          {
            type: "string",
            name: "contentType",
            label: "内容类型",
            required: true,
            options: [
              { label: "文章", value: "post" },
              { label: "笔记", value: "note" },
              { label: "项目", value: "project" }
            ]
          },
          {
            type: "string",
            name: "section",
            label: "所属专题",
            ui: {
              component: "hidden"
            }
          },
          {
            type: "string",
            name: "category",
            label: "分类"
          },
          {
            type: "string",
            name: "tag",
            label: "展示标签",
          },
          {
            type: "string",
            name: "kicker",
            label: "前缀标识"
          },
          {
            type: "string",
            name: "author",
            label: "作者",
          },
          {
            type: "string",
            name: "readTime",
            label: "阅读时长",
          },
          {
            type: "image",
            name: "coverImage",
            label: "封面图",
          },
          {
            type: "string",
            name: "tags",
            label: "标签",
            list: true,
            required: true
          },
          {
            type: "boolean",
            name: "draft",
            label: "草稿"
          },
          {
            type: "boolean",
            name: "featured",
            label: "精选"
          },
          {
            type: "string",
            name: "stack",
            label: "技术栈",
            list: true
          },
          {
            type: "string",
            name: "status",
            label: "状态"
          },
          {
            type: "string",
            name: "repo",
            label: "仓库地址"
          },
          {
            type: "string",
            name: "demo",
            label: "演示地址"
          },
          {
            type: "string",
            name: "highlights",
            label: "亮点",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "正文",
            isBody: true
          }
        ]
      },
      {
        name: "about",
        label: "About Page",
        path: "content/pages",
        format: "json",
        match: {
          include: "about"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          { type: "string", name: "hudLabel", label: "HUD Label" },
          { type: "string", name: "brandLabel", label: "Brand Label" },
          { type: "string", name: "watermark", label: "Watermark" },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              { type: "string", name: "title", label: "Title Lines", list: true },
              { type: "string", name: "terminalText", label: "Terminal Text", ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "overview",
            label: "Overview",
            fields: [
              { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
              {
                type: "object",
                name: "paths",
                label: "Paths",
                list: true,
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "badge", label: "Badge" }
                ]
              },
              { type: "string", name: "bridgeText", label: "Bridge Text", ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "vision",
            label: "Vision",
            fields: [
              { type: "string", name: "statement", label: "Statement", ui: { component: "textarea" } },
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "manifesto",
            label: "Manifesto",
            fields: [
              { type: "string", name: "watermark", label: "Watermark" },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "string", name: "lines", label: "Lines", list: true },
              { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "CTA Label" },
              { type: "string", name: "statusLabel", label: "Status Label" }
            ]
          }
        ]
      },
      {
        name: "contact",
        label: "Contact Page",
        path: "content/pages",
        format: "json",
        match: {
          include: "contact"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "nav",
            label: "Nav",
            fields: [
              { type: "string", name: "backLabel", label: "Back Label" },
              { type: "string", name: "title", label: "Title" }
            ]
          },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              { type: "string", name: "titleLine1", label: "Title Line 1" },
              { type: "string", name: "titleLine2", label: "Title Line 2" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "emailCard",
            label: "Email Card",
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "email", label: "Email" },
              { type: "string", name: "copyLabel", label: "Copy Label" },
              { type: "string", name: "copiedLabel", label: "Copied Label" }
            ]
          },
          { type: "string", name: "socialsTitle", label: "Socials Title" },
          {
            type: "object",
            name: "socials",
            label: "Socials",
            list: true,
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "desc", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "url", label: "URL" }
            ]
          }
        ]
      },
      {
        name: "home",
        label: "Home Page",
        path: "content/pages",
        format: "json",
        match: {
          include: "home"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Items",
            list: true,
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "titleLines", label: "Title Lines", list: true },
              { type: "image", name: "imageSrc", label: "Image" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "CTA Text" },
              { type: "string", name: "detailHref", label: "Detail Href" },
              {
                type: "object",
                name: "stats",
                label: "Stats",
                list: true,
                fields: [
                  { type: "string", name: "value", label: "Value" },
                  { type: "string", name: "label", label: "Label" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
