# Frontend Architecture

## 当前目标

这个项目当前只处理前端页面工程化整理，核心目标是把已有主页、文章页、项目页、笔记页和联系页整理成一个适合长期维护的 Next.js 项目。

- 使用 `Next.js App Router`
- 使用 `TypeScript`
- 使用 `Tailwind CSS`
- 暂不接入 CMS
- 暂不处理部署
- 暂不处理数据库和 API

## 目录职责

- `app/`：只负责路由定义和页面装配
- `components/`：放可复用组件，按页面领域分组
- `components/layout/`：站点头部、底部和页面外壳
- `components/home/`：首页专用模块
- `components/posts/`：文章列表、文章详情、目录等模块
- `components/projects/`：项目页模块
- `components/notes/`：笔记页模块
- `components/shared/`：跨多个页面复用的基础 UI 组件
- `lib/`：轻量数据文件和简单工具函数
- `public/`：静态资源
- `docs/`：项目规则、结构说明和后续开发提示

## 当前不做的事情

- 不接入 TinaCMS 或其他 CMS
- 不处理 Markdown 渲染链路
- 不处理部署方案
- 不增加数据库
- 不新增 API
- 不引入复杂状态管理
- 不大改现有视觉风格

## 后续可以再做但当前暂不处理

- 将 `lib/` 中的内容迁移到更正式的内容源
- 增加文章元数据和筛选能力
- 为项目页和笔记页补充详情页
- 为静态资源建立更明确的归档方式
- 在结构稳定后再考虑 CMS 和部署
