# DEPLOYMENT

## 当前部署方式

- 代码托管：GitHub
- 分支：`main`
- 部署平台：Vercel
- 触发方式：push 到 GitHub 后自动部署

## 生产构建

项目当前生产构建命令：

```bash
npm run build
```

对应 `package.json`：

- `build`: `next build`
- `start`: `next start`

## 首次部署建议

在 Vercel 导入 GitHub 仓库时：

- Framework Preset：`Next.js`
- Root Directory：仓库根目录
- Build Command：默认即可
- Output Directory：默认即可
- Install Command：默认即可

## 当前部署模型

路线固定为：

1. 本地修改内容或代码
2. `git add` / `git commit`
3. `git push`
4. Vercel 自动构建与部署

不采用：

- 线上 Tina 管理后台
- 线上 Tina local mode 作为生产工作流

## 环境变量

### 当前已确认

前台生产部署通常不需要额外环境变量即可工作。

Tina 配置中存在：

- `GITHUB_BRANCH`
- `VERCEL_GIT_COMMIT_REF`
- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`

但当前生产链路不依赖 `tinacms build`，因此：

- 如果 Vercel 构建日志没有提示缺失变量，不需要预先配置
- 如果后续日志明确报错，再按报错补齐

## 与 Tina 相关的部署约束

- `dev:cms` 只用于本地开发
- `tina:build` 不应作为生产默认构建步骤
- `public/admin/` 不应作为线上正式功能暴露
- `middleware.ts` 必须继续在生产环境拦截 `/admin`

## 上线后验收清单

至少检查：

- `/`
- `/sections/ai-agent`
- `/sections/cybersecurity`
- `/sections/portfolio`
- `/sections/thoughts`
- 任意一个 `/sections/[slug]/[articleSlug]`
- `/about`
- `/contact`
- `/admin` 是否 404
- `/posts` 是否 404
- `/notes` 是否 404
- `/projects` 是否 404

## 回滚方法

优先使用平台和 Git 的常规能力：

### 方案 1：Git 回滚

1. 找到稳定提交
2. 新建一个回滚提交，或回退后重新 push
3. Vercel 自动部署回滚版本

### 方案 2：Vercel 回滚

如果只是临时恢复线上版本，可在 Vercel 后台切回上一条稳定部署。

建议：

- 以 Git 提交作为长期真实来源
- 不要只在 Vercel 平台层面“临时修复”而不回写仓库

## 常见部署问题

### 构建失败

优先检查：

- `npm run build` 本地是否通过
- Vercel 构建日志
- 是否误引入了 Tina 线上依赖
- 是否出现 `three` 类型问题

### `/admin` 还能访问

优先检查：

- `middleware.ts`
- 是否误恢复了 `public/admin/`
- `next.config.ts` 的 rewrite 是否需要进一步收口

### 页面与本地不一致

优先检查：

- 是否 push 到了 `main`
- Vercel 是否已使用最新提交构建
- 是否受 `localStorage` / 主题偏好影响

## 建议的部署处理顺序

1. 先看 Vercel 构建日志
2. 再对照本地 `npm run build`
3. 只做最小必要修复
4. 修复后重新 push 并复验
