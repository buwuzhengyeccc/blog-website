# Blog Website

个人技术品牌站 / 博客站，基于 Next.js App Router 构建。  
当前生产形态是“内容站 + 本地内容编辑 + GitHub 提交 + Vercel 自动部署”。

## 项目定位

- 前台是固定信息架构的品牌站与内容站
- 内容按专题 section 组织，而不是按 posts / notes / projects 作为前台入口
- TinaCMS 只用于本地编辑辅助，不作为线上 CMS 后台
- 线上站点只负责展示内容，不暴露正式 `/admin` 后台

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- TinaCMS（仅本地编辑）
- Three.js（首页 / section 视觉交互）
- npm
- Vercel（生产部署）

## 核心路由

- `/`
- `/sections/[slug]`
- `/sections/[slug]/[articleSlug]`
- `/about`
- `/contact`

当前有效 section：

- `ai-agent`
- `cybersecurity`
- `portfolio`
- `thoughts`

## 内容来源

- 正文内容：`content/sections/*`
- 静态页面内容：`content/pages/*`

说明：

- `content/sections/*` 下的每个 `.mdx` 文件都是一个内容条目
- 条目通过 frontmatter 的 `contentType` 区分 `post` / `note` / `project`
- 前台聚合与详情统一走 `/sections/...`
- `draft: true` 的条目不会在前台公开展示

## 目录简述

- `app/`：页面路由
- `components/`：页面组件与可复用 UI
- `lib/`：内容读取、数据映射、页面数据组装
- `content/pages/`：首页、About、Contact 的 JSON 内容源
- `content/sections/`：正文 MDX 内容源
- `tina/`：Tina 本地编辑配置与生成文件
- `public/`：静态资源
- `docs/`：补充说明文档

## 本地运行

安装依赖：

```bash
npm install
```

普通前台开发：

```bash
npm run dev
```

带 Tina 本地编辑一起运行：

```bash
npm run dev:cms
```

本地生产构建验证：

```bash
npm run build
npm run start
```

## 内容更新方式

### 更新正文内容

1. 在 `content/sections/<section>/` 下新增或修改 `.mdx`
2. 维护 frontmatter，例如：
   - `title`
   - `date`
   - `summary`
   - `contentType`
   - `tags`
   - 其他可选字段
3. 本地运行检查页面显示
4. `git add` / `git commit` / `git push`
5. Vercel 自动部署

### 更新首页 / About / Contact

直接修改：

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

或通过本地 Tina 编辑。

## 部署方式

- 代码托管：GitHub
- 生产部署：Vercel
- 发布路径：本地修改 -> Git 提交 -> push 到 `main` -> Vercel 自动部署

当前生产构建命令：

```bash
npm run build
```

## 常见维护入口

- 首页内容：`content/pages/home.json`
- About 页面内容：`content/pages/about.json`
- Contact 页面内容：`content/pages/contact.json`
- section 聚合与详情数据：`lib/sections.ts`
- 正文内容读取：`lib/entries.ts`
- 页面内容读取：`lib/pages.ts`
- Tina 配置：`tina/config.ts`
- 生产环境 `/admin` 拦截：`middleware.ts`

## 注意事项

- 不要恢复 `/posts`、`/notes`、`/projects` 作为正式前台入口
- 不要把 Tina 当成线上 CMS 方案继续扩展
- 生产环境不应保留可用的 `/admin` 后台
- `section` 归属以文件路径为准，不应重新改成依赖手工填写
- 修改内容优先走 `content/`，不要把内容硬编码回组件
- 修改前台视觉时，尽量保持现有首页与 section 页的交互主方向

## 维护补充

更详细的维护与 AI 接手文档见：

- `README_TO_AI.md`
- `MAINTENANCE.md`
- `DEPLOYMENT.md`
- `CHANGELOG.md`
