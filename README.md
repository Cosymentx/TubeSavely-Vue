<div align="center">

<img src="https://raw.githubusercontent.com/Cosymentx/TubeSavely/master/assets/images/ic_logo.png" width="96" alt="TubeSavely Logo"/>

# TubeSavely-Vue

**TubeSavely 官方 Web 前端 — 基于 Vue 3 + TypeScript + Vite 构建的现代化响应式视频解析与下载平台**

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vuedotjs)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Website](https://img.shields.io/badge/Demo-Vercel-black?logo=vercel)](https://tube-savely-vue.vercel.app)
[![Stars](https://img.shields.io/github/stars/Cosymentx/TubeSavely-Vue?style=social)](https://github.com/Cosymentx/TubeSavely-Vue)

</div>

---

> ⚠️ **合规提示**：请仅下载您拥有版权、获得正规授权或属于公有领域的音视频内容，并严格遵守各主流平台的服务条款与当地法律法规。

---

## 🌐 TubeSavely 系列项目生态

TubeSavely 是一套完整的跨平台音视频解析与下载解决方案，由三个独立且深度联动的核心项目协同构成：

| 项目 / 客户端 | 技术栈 | 职责与定位 | 仓库地址 | 在线体验 / 交付物 |
| :--- | :--- | :--- | :--- | :--- |
| **TubeSavely** | Flutter 3 + Dart | iOS / Android / Windows / macOS / Linux 客户端，提供原生交互与桌面端视频转换/压缩 | [![GitHub](https://img.shields.io/badge/GitHub-TubeSavely-02569B?logo=flutter)](https://github.com/Cosymentx/TubeSavely) | [Releases 下载](https://github.com/Cosymentx/TubeSavely/releases) |
| **TubeSavely-Vue** (当前仓库) | Vue 3 + TypeScript + Vite | 现代化响应式 Web 端，无须安装即开即用，支持在线解析、格式筛选与下载 | [![GitHub](https://img.shields.io/badge/GitHub-TubeSavely--Vue-4FC08D?logo=vuedotjs)](https://github.com/Cosymentx/TubeSavely-Vue) | [访问 Web 演示站](https://tube-savely-vue.vercel.app) |
| **TubeSavely-Server** | Python 3 + FastAPI + yt-dlp | 核心音视频解析引擎、任务队列、多平台提取、支付积分与下载分发 API | [![GitHub](https://img.shields.io/badge/GitHub-TubeSavely--Server-3776AB?logo=python)](https://github.com/Cosymentx/TubeSavely-Server) | [Swagger API 文档](https://tube-savely-server.vercel.app/docs) |

---

## ✨ 功能特性

- 🔗 **全网多平台链接解析**：输入视频链接即可秒级探测平台可用音视频格式与分辨率。
- 📥 **灵活下载与格式选择**：支持视频高清分辨率（1080P/2K/4K）与纯音频格式提取。
- 👤 **账户与权限中心**：支持账号注册、JWT 登录、OAuth 社交认证授权与个人中心管理。
- 💎 **积分计费与支付闭环**：支持积分余额管理、充值订单流水与下载历史记录追踪。
- 🌓 **自适应深色模式**：全站适配浅色与深色主题切换，移动端与 PC 端无缝响应式体验。

---

## 🛠️ 技术栈

- **前端框架**：Vue 3 + Composition API
- **构建工具**：Vite 6 + `@vitejs/plugin-vue`
- **语言标准**：TypeScript 5.x
- **状态管理**：Pinia
- **路由导航**：Vue Router 4
- **UI & 样式**：Tailwind CSS + Headless UI + Iconify
- **HTTP 客户端**：Axios

---

## 🚀 快速开始

### 🛠️ 前置条件
- Node.js 20.x 或更高版本
- pnpm 8.x 或更高版本
- 可访问的 [TubeSavely-Server](https://github.com/Cosymentx/TubeSavely-Server) 后端 API

### 💻 本地运行
```bash
# 1. 克隆项目仓库
git clone https://github.com/Cosymentx/TubeSavely-Vue.git
cd TubeSavely-Vue

# 2. 安装项目依赖
pnpm install

# 3. 配置本地环境变量
cp .env.example .env.development

# 4. 启动本地开发服务器
pnpm dev
```
开发服务器启动后默认访问地址为 `http://localhost:5173`。

---

## ⚙️ 环境变量配置

在根目录下创建 `.env.development` 或 `.env.production`：

| 环境变量 | 必填 | 默认值 | 说明 |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | 否 | `https://tubesavely-server.vercel.app/api/v1` | 后端 API 服务根路径 |

> 注意：所有以 `VITE_*` 开头的变量都会打包进前端静态资源中，切勿在此填写任何数据库连接串、支付密钥或私钥敏感凭据。

---

## 🛠️ 常用开发命令

```bash
# 启动本地开发热更新服务
pnpm dev

# 执行 TypeScript 与 Vue SFC 类型检查
pnpm typecheck

# 生成生产环境静态部署包 (dist/)
pnpm build

# 本地预览生产构建产物
pnpm preview
```

---

## 📁 项目结构

```text
src/
├── assets/        # 静态资源与样式文件
├── components/    # 通用组件、布局组件与业务弹窗
├── composables/   # Vue 3 组合式函数封装
├── router/        # 路由定义与导航路由守卫
├── services/      # API 请求接口封装与 Axios 拦截器
├── stores/        # Pinia 状态管理模块 (用户/下载/支付等)
├── types/         # TypeScript 类型定义声明
├── utils/         # 通用工具函数、日期与格式化工具
└── views/         # 页面视图组件
```

---

## 📄 开源协议

Copyright © 2023-2026 TubeSavely. All rights reserved.
