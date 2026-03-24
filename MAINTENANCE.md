# MAINTENANCE

## 目标

本文件面向日常维护者，强调：

- 如何改内容
- 如何改页面
- 如何验证
- 如何避免破坏当前结构

## 1. 常见维护任务

### 1.1 修改正文内容

- 位置：`content/sections/<section>/*.mdx`
- 适用场景：
  - 修改文章标题
  - 调整摘要
  - 修改正文
  - 更新项目状态 / 仓库地址 / Demo 地址

建议流程：

1. 修改对应 `.mdx`
2. 本地运行 `npm run dev`
3. 检查：
   - section 聚合页
   - 对应详情页
4. 提交并 push

### 1.2 新增正文内容

1. 选择正确的 section 目录
2. 新建 `.mdx`
3. frontmatter 至少提供：
   - `title`
   - `date`
   - `summary`
   - `contentType`
   - `tags`
4. 预览页面确认生成正常

### 1.3 删除正文内容

1. 删除对应 `.mdx`
2. 本地确认该条目已不再出现在 section 页
3. push 后等待 Vercel 自动更新

### 1.4 修改首页 / About / Contact

优先修改内容文件：

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

只有在内容结构不足以表达需求时，才修改组件。

## 2. 页面修改入口

### 首页

- 路由：`app/page.tsx`
- 主组件：`components/home/HomeCubeGallery.tsx`
- 内容：`content/pages/home.json`

### About

- 路由：`app/about/page.tsx`
- 主组件：`components/about/AboutIntroPage.tsx`
- 内容：`content/pages/about.json`

### Contact

- 路由：`app/contact/page.tsx`
- 主组件：`components/contact/ContactIntroPage.tsx`
- 内容：`content/pages/contact.json`

### Section 聚合 / 详情

- 聚合页：`app/sections/[slug]/page.tsx`
- 详情页：`app/sections/[slug]/[articleSlug]/page.tsx`
- 数据入口：`lib/sections.ts`

## 3. 维护时优先修改哪一层

按优先级从上到下：

1. `content/`
2. `lib/`
3. `components/`
4. `app/`
5. 配置文件

原则：

- 内容问题先改内容文件
- 数据映射问题再改 `lib/`
- 展示问题才改组件
- 不要一上来就改路由结构

## 4. 本地验证建议

最常用：

```bash
npm run dev
```

内容编辑联调：

```bash
npm run dev:cms
```

上线前验证：

```bash
npm run build
npm run start
```

## 5. 常见排错路径

### 某篇文章不显示

优先检查：

- 文件是否在 `content/sections/<section>/`
- frontmatter 的 `contentType` 是否有效
- 是否设置了 `draft: true`
- section 路径是否正确

### section 页面 404

优先检查：

- `lib/sections.ts` 中的 `SECTION_SLUGS`
- 路由 slug 是否拼写正确

### 详情页打不开

优先检查：

- 文件名 slug
- `getAllSectionEntries()`
- `getSectionEntryBySlugs()`
- `getPostBySectionAndSlug()`

### `/admin` 没有 404

优先检查：

- `middleware.ts`
- `next.config.ts`
- 线上是否为 production 环境

## 6. 维护注意事项

- 不要把内容重新写回组件
- 不要恢复旧 `/posts`、`/notes`、`/projects` 前台入口
- 不要把 Tina 重新做成线上 CMS
- 不要为小改动做大重构
- 影响首页 / section 视觉交互的改动要格外谨慎

## 7. 推荐维护节奏

1. 先定位问题属于内容、数据、UI 还是部署
2. 只改最小必要层
3. 本地验证
4. 提交信息写清楚
5. push 后观察 Vercel 部署结果
