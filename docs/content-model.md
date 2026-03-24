# Content Model

本文档用于说明当前仓库 `content/` 目录下的内容模型与维护约束。  
目标是让维护者和 AI 在修改内容时，不需要反复猜测字段含义、文件位置与前台映射关系。

## 一、正文内容来源

### 1.1 正文文件位置

当前正文内容统一位于：

- `content/sections/ai-agent/*.mdx`
- `content/sections/cybersecurity/*.mdx`
- `content/sections/portfolio/*.mdx`
- `content/sections/thoughts/*.mdx`

每一个 `.mdx` 文件都代表一个正文条目。

### 1.2 section 归属规则

当前实现中，section 归属由**文件路径**决定，而不是由 frontmatter 中的手工字段决定。

依据代码：

- `lib/content.ts` 中的 `sectionFromSectionsFilePath()`
- `lib/entries.ts` 中的 `readEntryFile()`

这意味着：

- 文件放在 `content/sections/ai-agent/` 下，就会被视为 `ai-agent`
- 不应把 section 归属重新改回依赖人工填写的字段
- frontmatter 中即使保留 `section` 字段，也不应将它视为真实来源

### 1.3 当前正式 section 列表

当前正式 section 列表来自 `lib/sections.ts`：

- `ai-agent`
- `cybersecurity`
- `portfolio`
- `thoughts`

前台正式结构固定为：

- `/sections/ai-agent`
- `/sections/cybersecurity`
- `/sections/portfolio`
- `/sections/thoughts`

## 二、MDX frontmatter 字段规范

### 2.1 当前项目实际读取的字段

根据 `lib/entries.ts`、`lib/posts.ts`、`lib/sections.ts`，当前项目会读取或依赖以下 frontmatter 字段：

- `title`
- `date`
- `summary`
- `contentType`
- `tags`
- `draft`
- `featured`
- `kicker`
- `category`
- `tag`
- `author`
- `readTime`
- `coverImage`
- `stack`
- `status`
- `repo`
- `demo`
- `highlights`

### 2.2 字段分组

#### 必填

- `title`
- `date`
- `summary`
- `contentType`
- `tags`

#### 常用可选

- `draft`
- `featured`
- `kicker`

#### 仅 `post` 常用

- `category`
- `tag`
- `author`
- `readTime`
- `coverImage`

#### 仅 `note` 常用

- `kicker`

#### 仅 `project` 常用

- `stack`
- `status`
- `repo`
- `demo`
- `highlights`
- `featured`
- `kicker`

### 2.3 字段逐项说明

#### `title`

- 类型：`string`
- 含义：正文标题
- 是否必填：是
- 示例：

```yaml
title: Agent Collaboration
```

#### `date`

- 类型：`string`
- 含义：内容日期源字段；系统会进一步格式化成前台显示日期
- 是否必填：是
- 示例：

```yaml
date: 2026-03-24
```

#### `summary`

- 类型：`string`
- 含义：列表摘要 / 内容简介
- 是否必填：是
- 示例：

```yaml
summary: A note about multi-agent coordination in daily workflows.
```

#### `contentType`

- 类型：`string`
- 含义：条目内部类型
- 是否必填：是
- 可选值：
  - `post`
  - `note`
  - `project`
- 示例：

```yaml
contentType: post
```

#### `tags`

- 类型：`string[]`
- 含义：标签列表
- 是否必填：是
- 示例：

```yaml
tags:
  - ai-agent
  - workflow
```

#### `draft`

- 类型：`string`，实际被解析为布尔值
- 含义：是否作为草稿隐藏
- 是否必填：否
- 当前观察到的用途：
  - `lib/entries.ts` 用 `parseBoolean()` 解析
  - `lib/sections.ts` 中 `getAllSectionEntries()` 会过滤 `draft: true`
- 示例：

```yaml
draft: true
```

#### `featured`

- 类型：`string`，实际被解析为布尔值
- 含义：是否标记为精选
- 是否必填：否
- 当前观察到的用途：
  - 主要在 `project` 类型映射时保留给 `ProjectCardData`
- 示例：

```yaml
featured: true
```

#### `kicker`

- 类型：`string`
- 含义：短前缀说明 / 小标题
- 是否必填：否
- 当前观察到的用途：
  - `note`
  - `project`
- 示例：

```yaml
kicker: Workflow Note
```

#### `category`

- 类型：`string`
- 含义：`post` 类型分类
- 是否必填：否，但对 `post` 更有意义
- 示例：

```yaml
category: AI Agent
```

#### `tag`

- 类型：`string`
- 含义：`post` 类型单标签 / 辅助展示字段
- 是否必填：否，但对 `post` 更有意义
- 示例：

```yaml
tag: Collaboration
```

#### `author`

- 类型：`string`
- 含义：作者名称
- 是否必填：否，但对 `post` 更有意义
- 示例：

```yaml
author: Buwuzhengye
```

#### `readTime`

- 类型：`string`
- 含义：阅读时长
- 是否必填：否，但对 `post` 更有意义
- 示例：

```yaml
readTime: 6 min read
```

#### `coverImage`

- 类型：`string`
- 含义：封面图地址
- 是否必填：否，但对 `post` 更有意义
- 当前观察到的用途：
  - `post` 类型优先使用该图
  - section 列表中 `post` 也会优先使用该图
- 示例：

```yaml
coverImage: /image/example-cover.jpg
```

#### `stack`

- 类型：`string[]`
- 含义：项目技术栈
- 是否必填：否，但对 `project` 更有意义
- 示例：

```yaml
stack:
  - Next.js
  - TypeScript
  - Tailwind CSS
```

#### `status`

- 类型：`string`
- 含义：项目当前状态
- 是否必填：否，但对 `project` 更有意义
- 示例：

```yaml
status: In Progress
```

#### `repo`

- 类型：`string`
- 含义：项目仓库地址
- 是否必填：否，但对 `project` 更有意义
- 示例：

```yaml
repo: https://github.com/example/repo
```

#### `demo`

- 类型：`string`
- 含义：项目演示地址
- 是否必填：否，但对 `project` 更有意义
- 示例：

```yaml
demo: https://example.com/demo
```

#### `highlights`

- 类型：`string[]`
- 含义：项目亮点列表
- 是否必填：否，但对 `project` 更有意义
- 当前观察到的用途：
  - 在 `buildProjectSource()` 中映射为 `points`
- 示例：

```yaml
highlights:
  - Section-based content architecture
  - Local Tina editing workflow
```

## 三、按 contentType 分类型说明

### 3.1 `post`

#### 适用场景

- 正式文章
- 更完整的结构化阅读内容
- 需要作者、阅读时长、封面、分类等字段的内容

#### 推荐字段

- `title`
- `date`
- `summary`
- `contentType`
- `tags`
- `category`
- `tag`
- `author`
- `readTime`
- `coverImage`

#### 最小 frontmatter 示例

```yaml
---
title: Agent Collaboration
date: 2026-03-24
summary: A post about structured collaboration between AI agents.
contentType: post
tags:
  - ai-agent
  - collaboration
---
```

#### 更完整的 frontmatter 示例

```yaml
---
title: Agent Collaboration
date: 2026-03-24
summary: A post about structured collaboration between AI agents.
contentType: post
tags:
  - ai-agent
  - collaboration
category: AI Agent
tag: Collaboration
author: Buwuzhengye
readTime: 6 min read
coverImage: /image/agent-collaboration.jpg
draft: false
featured: false
---
```

### 3.2 `note`

#### 适用场景

- 轻量笔记
- 思考记录
- 不需要完整文章结构的短内容

#### 推荐字段

- `title`
- `date`
- `summary`
- `contentType`
- `tags`
- `kicker`
- `draft`

#### 最小 frontmatter 示例

```yaml
---
title: Experiment Notes
date: 2026-03-24
summary: Quick notes from a local workflow experiment.
contentType: note
tags:
  - thoughts
  - experiment
---
```

#### 更完整的 frontmatter 示例

```yaml
---
title: Experiment Notes
date: 2026-03-24
summary: Quick notes from a local workflow experiment.
contentType: note
tags:
  - thoughts
  - experiment
kicker: Lab Note
draft: false
featured: false
---
```

### 3.3 `project`

#### 适用场景

- 作品 / 案例 / 项目记录
- 需要技术栈、状态、仓库地址、演示地址、亮点列表等信息

#### 推荐字段

- `title`
- `date`
- `summary`
- `contentType`
- `tags`
- `kicker`
- `stack`
- `status`
- `repo`
- `demo`
- `highlights`
- `featured`

#### 最小 frontmatter 示例

```yaml
---
title: Portfolio Gallery System
date: 2026-03-24
summary: A section-based portfolio presentation system.
contentType: project
tags:
  - portfolio
  - frontend
---
```

#### 更完整的 frontmatter 示例

```yaml
---
title: Portfolio Gallery System
date: 2026-03-24
summary: A section-based portfolio presentation system.
contentType: project
tags:
  - portfolio
  - frontend
kicker: Case Study
stack:
  - Next.js
  - TypeScript
  - Tailwind CSS
status: In Progress
repo: https://github.com/example/portfolio-gallery
demo: https://example.com
highlights:
  - Section-based routing
  - Local-file content model
featured: true
draft: false
---
```

## 四、静态页面 JSON 内容结构

### 4.1 `content/pages/home.json`

#### 用途

- 首页立方体场景与入口卡片内容源

#### 当前结构概览

根对象包含：

- `items`: 数组

每个 `items[]` 元素当前包含：

- `id`: string
- `tag`: string
- `titleLines`: string[]
- `imageSrc`: string
- `description`: string
- `ctaText`: string
- `detailHref`: string
- `stats?`: `{ value: string, label: string }[]`

#### 最小结构示意

```json
{
  "items": [
    {
      "id": "s0",
      "tag": "SECTION / ABOUT",
      "titleLines": ["ABOUT", "ME"],
      "imageSrc": "/image/home-about-profile.jpg",
      "description": "Short description",
      "ctaText": "Enter",
      "detailHref": "/about"
    }
  ]
}
```

### 4.2 `content/pages/about.json`

#### 用途

- About 页面内容源

#### 当前结构概览

根对象当前包含：

- `hudLabel`
- `brandLabel`
- `watermark`
- `hero`
- `overview`
- `vision`
- `manifesto`
- `footer`

对应 `lib/pages.ts` 中的结构：

- `hero`
  - `eyebrow`
  - `title`: string[]
  - `terminalText`
- `overview`
  - `quote`
  - `paths`: array
  - `bridgeText`
- `vision`
  - `statement`
  - `eyebrow`
  - `paragraphs`: string[]
- `manifesto`
  - `watermark`
  - `intro`
  - `lines`: string[]
  - `quote`
- `footer`
  - `description`
  - `ctaLabel`
  - `statusLabel`

#### 最小结构示意

```json
{
  "hudLabel": "SYS.INIT",
  "brandLabel": "AGENT.REVERSE",
  "watermark": "INTERSECTION OF SYSTEMS",
  "hero": {
    "eyebrow": "USER.PROFILE // 0x01",
    "title": ["BRIDGING", "THE", "BOUNDARIES"],
    "terminalText": "Intro text"
  },
  "overview": {
    "quote": "Quote text",
    "paths": [],
    "bridgeText": "Bridge text"
  },
  "vision": {
    "statement": "Vision statement",
    "eyebrow": "INSIGHT",
    "paragraphs": []
  },
  "manifesto": {
    "watermark": "MANIFESTO",
    "intro": "Intro",
    "lines": [],
    "quote": "Quote"
  },
  "footer": {
    "description": "Footer description",
    "ctaLabel": "ENTER_SYS",
    "statusLabel": "SYSTEM.READY"
  }
}
```

### 4.3 `content/pages/contact.json`

#### 用途

- Contact 页面内容源

#### 当前结构概览

根对象当前包含：

- `nav`
- `hero`
- `emailCard`
- `socialsTitle`
- `socials`

对应 `lib/pages.ts` 中的结构：

- `nav`
  - `backLabel`
  - `title`
- `hero`
  - `eyebrow`
  - `titleLine1`
  - `titleLine2`
  - `description`
- `emailCard`
  - `label`
  - `email`
  - `copyLabel`
  - `copiedLabel`
- `socialsTitle`
- `socials`: array
  - `name`
  - `desc`
  - `url`

#### 最小结构示意

```json
{
  "nav": {
    "backLabel": "Back",
    "title": "Contact"
  },
  "hero": {
    "eyebrow": "CONTACT / CONNECT",
    "titleLine1": "Let's",
    "titleLine2": "Talk",
    "description": "Contact intro"
  },
  "emailCard": {
    "label": "Electronic Mail",
    "email": "hello@example.com",
    "copyLabel": "Copy",
    "copiedLabel": "Copied"
  },
  "socialsTitle": "Social Networks",
  "socials": [
    {
      "name": "GitHub",
      "desc": "Profile link",
      "url": "https://github.com"
    }
  ]
}
```

## 五、维护约束

### 5.1 内容优先改 `content/`

如果需求是：

- 改文案
- 改文章
- 改首页/关于页/联系页内容

优先修改：

- `content/sections/*`
- `content/pages/*`

不要把内容重新硬编码回组件。

### 5.2 不要恢复旧前台入口

不要把：

- `/posts`
- `/notes`
- `/projects`

重新作为正式前台入口恢复。

当前正式前台结构已经固定为 `/sections/...`。

### 5.3 不要把 `section` 改回手工字段驱动

当前 section 归属来自文件路径。  
不要把这条规则改回依赖 frontmatter 中人工填写的 `section`。

### 5.4 `draft: true` 不应在前台公开显示

当前实现中，`lib/sections.ts` 会过滤 `draft: true` 的内容。  
这条规则应当保持。

### 5.5 `contentType` 会影响详情页展示逻辑

当前详情页逻辑中：

- `post` -> 使用 `PostDetail`
- `note` / `project` -> 使用 `SectionEntryDetail`

因此：

- `contentType` 不是随便写的展示标签
- 修改它会改变前台详情渲染路径

### 5.6 当前排序规则值得注意

`lib/entries.ts` 与 `lib/sections.ts` 当前使用的是：

- `slug.localeCompare()` 倒序排序

也就是说，前台排序当前更接近“按 slug 倒序”，而不是严格按日期排序。  
这属于**当前真实实现**，后续如要改动，需单独评估。

## 六、维护建议

### 6.1 新增一篇内容的推荐流程

1. 选择正确的 section 目录
2. 新建 `.mdx`
3. 填写最小 frontmatter
4. 补正文内容
5. 本地运行：

```bash
npm run dev
```

6. 检查：
   - 对应 `/sections/[slug]`
   - 对应 `/sections/[slug]/[articleSlug]`
7. 如涉及上线安全，再跑：

```bash
npm run build
npm run start
```

### 6.2 修改首页 / About / Contact 内容的推荐流程

1. 修改目标 JSON 文件：
   - `content/pages/home.json`
   - `content/pages/about.json`
   - `content/pages/contact.json`
2. 本地运行：

```bash
npm run dev
```

3. 检查目标页面显示
4. 如需上线前确认，再跑：

```bash
npm run build
npm run start
```

### 6.3 提交前最小检查项

至少检查：

- `/`
- `/sections/ai-agent`
- `/sections/cybersecurity`
- `/sections/portfolio`
- `/sections/thoughts`
- 一个详情页，例如：
  - `/sections/ai-agent/agent-collaboration`
- `/about`
- `/contact`

如果要做接近生产的检查，再补：

- 运行 `npm run build`
- 运行 `npm run start`
- 检查生产态 `/admin` 不应作为正式入口可用

## 七、值得后续人工确认的点

以下是当前文档编写过程中发现、但建议后续人工确认的点：

1. `frontmatter.section`
   - 类型定义中仍保留该字段
   - 但当前真实归属来自文件路径
   - 建议继续保持“路径优先”，并避免误导内容编辑者

2. 排序规则
   - 当前实现按 `slug` 倒序排序
   - 不一定符合“按日期倒序”的直觉
   - 若后续希望内容按日期排序，需要单独改代码，而不是只改文档

3. JSON 与部分正文内容存在历史编码痕迹
   - 当前 PowerShell 输出里仍能看到乱码
   - 文档是根据结构与类型写的，不影响字段层理解
   - 但建议后续人工在编辑器中确认源文件实际编码状态
