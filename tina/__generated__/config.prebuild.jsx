// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
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
        label: "\u5185\u5BB9\u6761\u76EE",
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
            label: "\u6807\u9898",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "\u65E5\u671F",
            required: true
          },
          {
            type: "string",
            name: "summary",
            label: "\u6458\u8981",
            required: true
          },
          {
            type: "string",
            name: "contentType",
            label: "\u5185\u5BB9\u7C7B\u578B",
            required: true,
            options: [
              { label: "\u6587\u7AE0", value: "post" },
              { label: "\u7B14\u8BB0", value: "note" },
              { label: "\u9879\u76EE", value: "project" }
            ]
          },
          {
            type: "string",
            name: "section",
            label: "\u6240\u5C5E\u4E13\u9898",
            ui: {
              component: "hidden"
            }
          },
          {
            type: "string",
            name: "category",
            label: "\u5206\u7C7B"
          },
          {
            type: "string",
            name: "tag",
            label: "\u5C55\u793A\u6807\u7B7E"
          },
          {
            type: "string",
            name: "kicker",
            label: "\u524D\u7F00\u6807\u8BC6"
          },
          {
            type: "string",
            name: "author",
            label: "\u4F5C\u8005"
          },
          {
            type: "string",
            name: "readTime",
            label: "\u9605\u8BFB\u65F6\u957F"
          },
          {
            type: "image",
            name: "coverImage",
            label: "\u5C01\u9762\u56FE"
          },
          {
            type: "string",
            name: "tags",
            label: "\u6807\u7B7E",
            list: true,
            required: true
          },
          {
            type: "boolean",
            name: "draft",
            label: "\u8349\u7A3F"
          },
          {
            type: "boolean",
            name: "featured",
            label: "\u7CBE\u9009"
          },
          {
            type: "string",
            name: "stack",
            label: "\u6280\u672F\u6808",
            list: true
          },
          {
            type: "string",
            name: "status",
            label: "\u72B6\u6001"
          },
          {
            type: "string",
            name: "repo",
            label: "\u4ED3\u5E93\u5730\u5740"
          },
          {
            type: "string",
            name: "demo",
            label: "\u6F14\u793A\u5730\u5740"
          },
          {
            type: "string",
            name: "highlights",
            label: "\u4EAE\u70B9",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "\u6B63\u6587",
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
export {
  config_default as default
};
