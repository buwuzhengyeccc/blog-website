# README_TO_AI

## 1. 项目目标与定位

这是一个个人技术品牌站 / 博客站，目标不是通用 CMS，也不是多内容类型门户，而是：

- 保持固定前台信息架构
- 以 section 为前台组织维度
- 使用本地文件作为内容源
- 用 TinaCMS 辅助本地编辑
- 通过 GitHub + Vercel 完成上线与更新

这个项目后续维护应优先保持“内容站 + 低运维 + 最小改动”的原则。

---

## 2. 当前系统形态

### 已确认

- 技术栈：Next.js App Router + TypeScript + Tailwind CSS + TinaCMS + Three.js
- 内容源：
  - `content/sections/*`
  - `content/pages/*`
- 生产部署：
  - GitHub 托管
  - Vercel 自动部署
- Tina 定位：
  - 仅本地编辑辅助工具
  - 不作为线上 CMS 后台
- 生产环境 `/admin`：
  - 不是正式功能入口
  - 由 `middleware.ts` 在非 development 环境返回 404

### 已淘汰的旧思路

- 以前台 `posts / notes / projects` 作为正式入口
- 线上保留 Tina 后台
- 直接在原大仓库里继续混合维护博客项目

这些都不要恢复。

---

## 3. 前台信息架构

当前正式前台结构固定为：

- `/`
- `/sections/[slug]`
- `/sections/[slug]/[articleSlug]`
- `/about`
- `/contact`

### 当前 section 列表

- `ai-agent`
- `cybersecurity`
- `portfolio`
- `thoughts`

### 路由约束

- 所有正文详情都统一走 `/sections/[slug]/[articleSlug]`
- 不要重新引入 `/posts`、`/notes`、`/projects` 作为正式对外路由
- 当前仓库里 `app/posts`、`app/notes`、`app/projects` 目录残留为空目录/旧痕迹，不代表应该恢复旧架构

---

## 4. 内容组织方式

### 4.1 正文内容

正文统一存放于：

- `content/sections/ai-agent/*.mdx`
- `content/sections/cybersecurity/*.mdx`
- `content/sections/portfolio/*.mdx`
- `content/sections/thoughts/*.mdx`

每个 `.mdx` 文件代表一个条目，frontmatter 中的关键字段包括：

- `title`
- `date`
- `summary`
- `contentType`：`post` / `note` / `project`
- `tags`
- 可选：`draft`、`featured`、`kicker`、`category`、`tag`、`author`、`readTime`、`coverImage`、`stack`、`status`、`repo`、`demo`、`highlights`

### 4.2 静态页面内容

静态页面走 JSON 内容源：

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

不要把这些页面文案重新硬编码回页面组件。

### 4.3 section 的来源约束

`section` 的真实来源应视为“文件路径”，不是可自由编辑的业务字段。

当前读取逻辑在：

- `lib/entries.ts`
- `lib/content.ts`

其中 `sectionFromSectionsFilePath()` 会从文件路径推导 section。  
这是一条重要约束：**不要把 section 归属重新改回依赖手工填写**。

---

## 5. 页面与数据关系

### 首页

- 路由：`app/page.tsx`
- 数据源：`content/pages/home.json`
- 读取逻辑：`lib/pages.ts`
- 主组件：`components/home/HomeCubeGallery.tsx`

首页包含主题逻辑与立方体视觉交互。  
首页最近一次调整：默认首次访问主题改为 `light`。

### About

- 路由：`app/about/page.tsx`
- 数据源：`content/pages/about.json`
- 主组件：`components/about/AboutIntroPage.tsx`

### Contact

- 路由：`app/contact/page.tsx`
- 数据源：`content/pages/contact.json`
- 主组件：`components/contact/ContactIntroPage.tsx`

### Section 聚合页

- 路由：`app/sections/[slug]/page.tsx`
- 数据组装：`lib/sections.ts`
- 主组件：`components/sections/SectionGalleryPage.tsx`

### Section 详情页

- 路由：`app/sections/[slug]/[articleSlug]/page.tsx`
- 数据来源：
  - `lib/sections.ts`
  - `lib/posts.ts`
- 组件分流：
  - `post` -> `components/posts/PostDetail.tsx`
  - `note/project` -> `components/sections/SectionEntryDetail.tsx`

---

## 6. 关键目录结构

```text
app/
  page.tsx
  about/page.tsx
  contact/page.tsx
  sections/[slug]/page.tsx
  sections/[slug]/[articleSlug]/page.tsx

components/
  about/
  contact/
  home/
  layout/
  posts/
  sections/
  shared/

content/
  pages/
    about.json
    contact.json
    home.json
  sections/
    ai-agent/
    cybersecurity/
    portfolio/
    thoughts/

lib/
  content.ts
  entries.ts
  pages.ts
  posts.ts
  sections.ts

tina/
  config.ts
  __generated__/
```

---

## 7. 关键文件与职责

- `app/layout.tsx`
  - 全局布局
  - 注入首页主题初始化脚本

- `app/globals.css`
  - 全局样式
  - 首页与 section 页的主题和视觉基础

- `lib/content.ts`
  - MDX frontmatter 解析
  - section 路径推导

- `lib/entries.ts`
  - 递归读取 `content/sections`
  - 生成标准化条目数据

- `lib/pages.ts`
  - 读取 `content/pages/*.json`

- `lib/sections.ts`
  - section 元信息
  - 正文映射为前台 section 条目
  - `draft` 过滤

- `lib/posts.ts`
  - `post` 类型详情页数据拼装

- `tina/config.ts`
  - 本地 Tina schema 与内容编辑配置

- `middleware.ts`
  - 生产环境拦截 `/admin`

- `next.config.ts`
  - 包含 `/admin` rewrite 和远程图片白名单

---

## 8. 当前维护方式

当前维护方式是文件优先：

1. 修改 `content/` 下的内容文件
2. 本地运行检查
3. 提交 Git
4. push 到 GitHub
5. 等 Vercel 自动部署

本地内容编辑有两条路：

- 直接改 `content/` 文件
- 用 `npm run dev:cms` 启动 Tina 本地编辑

若只是常规维护，优先推荐直接编辑内容文件；若需要非开发人员协作编辑，可使用 Tina 本地模式。

---

## 9. 当前部署方式

### 生产链路

- GitHub 仓库：`buwuzhengyeccc/blog-website`
- 分支：`main`
- 平台：Vercel
- 自动部署触发：push 到 GitHub 后自动触发

### 生产脚本

- `npm run build` -> `next build`

### 本地脚本

- `npm run dev`
- `npm run dev:cms`
- `npm run build`
- `npm run start`
- `npm run tina:build`

### 环境变量

当前前台生产形态下，通常不依赖 Tina 线上环境变量。  
`tina/config.ts` 中存在：

- `GITHUB_BRANCH`
- `VERCEL_GIT_COMMIT_REF`
- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`

但生产构建默认并不依赖 `tinacms build`。  
如果未来 Vercel 构建日志出现 Tina 相关变量报错，再按日志处理，不要预先复杂化部署。

---

## 10. 已知约束

### 必须保持

- 前台正式结构必须维持为：
  - `/`
  - `/sections/[slug]`
  - `/sections/[slug]/[articleSlug]`
  - `/about`
  - `/contact`

- 内容源必须维持为：
  - `content/sections/*`
  - `content/pages/*`

- Tina 仅用于本地编辑，不作为线上后台

- 生产环境 `/admin` 必须不可作为正式入口使用

### 不要随便改

- 不要恢复 `/posts`、`/notes`、`/projects` 作为前台入口
- 不要重构首页交互主方向
- 不要把内容重新塞回组件硬编码
- 不要把 section 归属重新改为手工可编辑主字段
- 不要把线上部署重新变成依赖 Tina local mode

---

## 11. 常见维护任务怎么做

### 新增一篇正文

1. 在对应 section 目录新增 `.mdx`
2. 填好 frontmatter
3. 若要公开，确保不是 `draft: true`
4. 本地验证详情页和 section 聚合页

### 删除一篇正文

1. 删除对应 `.mdx`
2. 本地查看该条目是否已从聚合页消失
3. 提交并 push

### 修改首页

优先改：

- `content/pages/home.json`

若涉及交互或视觉实现，再看：

- `components/home/HomeCubeGallery.tsx`
- `app/globals.css`

### 修改 About / Contact

优先改：

- `content/pages/about.json`
- `content/pages/contact.json`

### 调整 section 元数据

查看：

- `lib/sections.ts`

这里包含 section 标题、描述、主题、提示文案。

---

## 12. 当前已知问题 / 技术债

### 已确认

- 现有 `README.md`、`docs/architecture.md` 和部分 Tina 配置文本存在乱码/编码痕迹，文档可读性较差
- `app/posts`、`app/notes`、`app/projects` 目录残留为空目录/旧路径痕迹，当前不影响运行，但容易误导新维护者
- `next.config.ts` 仍保留 `/admin -> /admin/index.html` rewrite；虽然有 `middleware.ts` 兜底，但这是后续可收口点

### 推测但未构成当前阻塞

- 主题逻辑在首页和全局布局中存在一定分散；若后续继续做主题统一，需谨慎，避免破坏当前行为

---

## 13. 如果要新增功能，先看什么

优先顺序：

1. `README_TO_AI.md`
2. `MAINTENANCE.md`
3. `DEPLOYMENT.md`
4. `lib/sections.ts`
5. `lib/entries.ts`
6. `lib/pages.ts`
7. 对应页面组件

新增功能前先判断：

- 是否会破坏固定信息架构
- 是否会破坏内容文件作为唯一内容源
- 是否会把线上重新拉回 Tina CMS 模式
- 是否属于“最小改动”还是“范围扩散”

---

## 14. AI 接手时建议优先读取的文件

- `README.md`
- `README_TO_AI.md`
- `MAINTENANCE.md`
- `DEPLOYMENT.md`
- `package.json`
- `app/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/sections/[slug]/page.tsx`
- `app/sections/[slug]/[articleSlug]/page.tsx`
- `lib/content.ts`
- `lib/entries.ts`
- `lib/pages.ts`
- `lib/sections.ts`
- `middleware.ts`
- `tina/config.ts`

---

## 15. AI 维护时的工作风格约束

- 优先最小改动
- 不做无关重构
- 不要顺手改变页面视觉主方向
- 先检查再执行
- 高风险改动前先明确说明影响
- 对“架构回退”“重新引入旧入口”“线上 Tina 扩张”保持高度克制
