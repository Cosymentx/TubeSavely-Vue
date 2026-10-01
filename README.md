# TubeSavely Frontend

TubeSavely 的 Vue 3 前端。它提供视频链接解析、格式选择与下载、账户和积分管理、充值与下载历史等界面。下载、鉴权、积分扣除和支付验证由后端 API 负责。

> 请仅下载您拥有权利、获得授权或属于公共领域的内容，并遵守内容平台的服务条款和当地法律。

## TubeSavely 系列项目

TubeSavely 系列由三个仓库组成，分别维护 Flutter 客户端、Vue Web 客户端和 Python API 服务。

| 项目 | 技术栈 | 用途 |
| --- | --- | --- |
| [TubeSavely](https://github.com/Cosymentx/TubeSavely) | Flutter / Dart | 移动端与桌面端客户端 |
| [TubeSavely-Vue](https://github.com/Cosymentx/TubeSavely-Vue) | Vue 3 / TypeScript | Web 客户端 |
| [TubeSavely-Server](https://github.com/Cosymentx/TubeSavely-Server) | Python / FastAPI | 用户、视频、积分和支付 API |

[访问 Web 客户端](https://tube-savely-vue.vercel.app) · [查看 API 文档](https://tube-savely-server.vercel.app/docs)

## 技术栈

- Vue 3 + TypeScript
- Vite 6
- Vue Router 4
- Pinia
- Tailwind CSS
- Axios
- Headless UI 与 Iconify

## 功能

- 账号注册、登录、OAuth 回调和个人资料管理
- 视频链接解析、可用格式选择和浏览器下载
- 后端统一处理下载权限、积分校验、扣费和文件交付
- 积分余额、充值、支付结果和历史记录
- 深色模式、全局提示和响应式页面

## 前置条件

- Node.js 20 或更高版本
- pnpm 8 或更高版本
- 可访问的 TubeSavely 后端 API

## 快速开始

```bash
git clone https://github.com/Cosymentx/tubesavely-vue.git
cd tubesavely-vue
pnpm install
cp .env.example .env.development
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`。未设置 API 地址时，应用会请求本地 `http://localhost:9527/api/v1`。

## 环境变量

从 `.env.example` 创建本地配置文件：

```bash
cp .env.example .env.development
```

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 否 | 后端 API 根路径，例如 `https://api.example.com/api/v1`。开发时可留空，使用本地默认地址。 |

`VITE_*` 变量会被打包到浏览器，因此只能放公开配置。不要提交 `.env`、OAuth client secret、支付密钥、令牌或生产凭据。

## 常用命令

```bash
# 启动开发服务
pnpm dev

# TypeScript 与 Vue 类型检查
pnpm typecheck

# 生成生产构建
pnpm build

# CI 完整检查：冻结依赖安装、类型检查与生产构建
sh scripts/ci-test.sh

# 本地预览生产构建
pnpm preview

# CI：冻结安装、Vue 类型检查和生产构建
sh scripts/ci-test.sh
```

GitHub Actions 在 master 的 push 和 pull request 时运行 CI 脚本。Dependabot 每周检查 npm
和 GitHub Actions 更新。

## 项目结构

```text
src/
├── components/    # 可复用组件、布局和用户相关对话框
├── composables/   # 组合式函数
├── router/        # 路由、权限守卫与页面懒加载
├── services/      # Axios 实例与后端 API 封装
├── stores/        # Pinia 状态：用户、视频、支付、主题、提示
├── types/         # API 和业务类型
├── utils/         # 校验、格式化、存储与错误处理
└── views/         # 路由页面
```

## API 与认证约定

- API 根路径由 `VITE_API_BASE_URL` 配置。
- 前端请求默认携带 Cookie，并在令牌存在时发送 `Authorization: Bearer <token>`。
- 未认证请求受路由守卫保护；收到 `401` 后会清除本地会话缓存。
- OAuth 授权地址和回调由后端生成与校验；前端仅发起流程并处理回调结果。
- 下载请求使用 `/videos/download`。后端应原子地完成鉴权、余额校验、扣费和文件响应，避免客户端重复扣费或绕过扣费。

## 生产部署

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

将 `dist/` 部署到静态 Web 服务器，并为 Vue History 路由配置回退到 `index.html`。生产环境应使用 HTTPS，并将 `VITE_API_BASE_URL` 指向 HTTPS API。

示例 Nginx 回退规则：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 安全说明

- 仓库忽略 `.env*` 和 `client_secret*.json`；`.env.example` 只包含公开示例值。
- 如果任何凭据曾提交或推送，请立即在对应平台轮换或撤销它，即使随后已从仓库删除。
- 生产认证建议使用 `HttpOnly`、`Secure`、适当 `SameSite` 属性的 Cookie，并配合后端 CSRF 防护。

## 贡献

欢迎通过 Issue 或 Pull Request 提交问题与改进。提交前请执行：

```bash
pnpm typecheck
pnpm build
```

## 许可证

目前仓库没有随附许可证文件。在添加许可证前，请勿假定可以将代码用于特定用途或再分发。
