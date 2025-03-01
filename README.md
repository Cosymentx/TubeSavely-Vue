# TubeSavely Frontend

基于 Vue 3 + TypeScript + Vite 构建的视频下载和管理系统前端应用。

## 技术栈

- Vue 3.5.13 (Composition API)
- TypeScript 5.8.2
- Vite 6.0.9
- Pinia 3.0.1
- Vue Router 4.5.0
- Tailwind CSS 3.3.5
- Headless UI 1.7.23
- VueUse 10.1.2
- Axios 1.8.1
- Iconify 4.3.0

## 项目结构

```
frontend/
├── src/
│   ├── assets/                        # 静态资源
│   │   ├── styles/                    # 样式文件
│   │   │   ├── global.css             # 全局样式
│   │   │   └── tailwind.css           # Tailwind 基础样式
│   │   └── main.css                   # 主样式入口
│   ├── components/                    # 通用组件
│   │   ├── common/                    # 基础组件
│   │   │   ├── Button.vue             # 按钮组件
│   │   │   ├── Input.vue              # 输入框组件
│   │   │   ├── Toast.vue              # 提示组件
│   │   │   ├── Loading.vue            # 加载组件
│   │   │   ├── Error.vue              # 错误提示
│   │   │   └── SupportedServices.vue  # 支持的服务列表
│   │   ├── layout/                    # 布局组件
│   │   │   ├── Navigation.vue         # 导航栏
│   │   │   └── Footer.vue             # 页脚
│   │   ├── user/                      # 用户相关组件
│   │   │   ├── UserMenu.vue           # 用户菜单
│   │   │   ├── UserAvatar.vue         # 用户头像
│   │   │   ├── RechargeDialog.vue     # 充值对话框
│   │   │   └── EditProfileDialog.vue  # 编辑资料对话框
│   │   ├── payment/                   # 支付相关组件
│   │   │   ├── PaymentMethods.vue     # 支付方式选择
│   │   │   ├── PaymentQRCode.vue      # 支付二维码
│   │   │   └── PaymentStatus.vue      # 支付状态
│   │   ├── task/                      # 任务相关组件
│   │   │   ├── TaskList.vue           # 任务列表
│   │   │   ├── TaskCard.vue           # 任务卡片
│   │   │   └── TaskProgress.vue       # 任务进度
│   │   ├── VideoInfoCard.vue          # 视频信息卡片
│   │   ├── BackgroundEffect.vue       # 背景效果
│   │   └── logo.vue                   # 网站 Logo
│   ├── composables/                   # 组合式函数
│   │   ├── useApi.ts                  # API 调用 Hook
│   │   ├── usePayment.ts              # 支付相关 Hook
│   │   ├── useTask.ts                 # 任务相关 Hook
│   │   └── useCredit.ts               # 积分相关 Hook
│   ├── router/                        # 路由配置
│   ├── services/                      # API 服务
│   │   ├── api.ts                     # Axios 实例配置
│   │   ├── interceptors.ts            # 请求/响应拦截器
│   │   ├── auth.ts                    # 认证服务
│   │   ├── user.ts                    # 用户服务
│   │   ├── video.ts                   # 视频服务
│   │   ├── payment.ts                 # 支付服务
│   │   ├── task.ts                    # 任务服务
│   │   └── feedback.ts                # 反馈服务
│   ├── stores/                        # Pinia 状态管理
│   │   ├── user.ts                    # 用户状态
│   │   ├── video.ts                   # 视频状态
│   │   ├── payment.ts                 # 支付状态
│   │   ├── task.ts                    # 任务状态
│   │   ├── theme.ts                   # 主题状态
│   │   └── toast.ts                   # 通知状态
│   ├── types/                         # TypeScript 类型定义
│   │   ├── api.ts                     # API 相关类型
│   │   ├── services.ts                # 服务接口定义
│   │   ├── user.ts                    # 用户相关类型
│   │   ├── video.ts                   # 视频相关类型
│   │   ├── payment.ts                 # 支付相关类型
│   │   ├── task.ts                    # 任务相关类型
│   │   └── feedback.ts                # 反馈相关类型
│   ├── utils/                         # 工具函数
│   │   ├── validation.ts              # 表单验证
│   │   ├── format.ts                  # 格式化工具
│   │   ├── storage.ts                 # 本地存储
│   │   ├── clipboard.ts               # 剪贴板操作
│   │   └── error.ts                   # 错误处理
│   ├── views/                         # 页面组件
│   │   ├── Home.vue                   # 首页（视频下载）
│   │   ├── Login.vue                  # 登录页面
│   │   ├── Register.vue               # 注册页面
│   │   ├── Profile.vue                # 用户资料
│   │   ├── Settings.vue               # 用户设置
│   │   ├── Credits.vue                # 积分中心
│   │   ├── Tasks.vue                  # 任务中心
│   │   ├── Contact.vue                # 联系/反馈
│   │   ├── About.vue                  # 关于我们
│   │   ├── Terms.vue                  # 服务条款
│   │   ├── Admin.vue                  # 管理面板
│   │   └── NotFound.vue               # 404 页面
│   ├── App.vue                        # 根组件
│   ├── main.ts                        # 应用入口
│   └── env.d.ts                       # 环境变量类型
├── public/                            # 公共资源
├── index.html                         # 入口 HTML
├── vite.config.ts                     # Vite 配置
├── tsconfig.json                      # TypeScript 配置
├── postcss.config.js                  # PostCSS 配置
└── tailwind.config.js                 # Tailwind 配置
```

## 主要功能模块

1. 用户管理
   - 用户注册和登录
   - OAuth2 社交登录集成 (Google, GitHub, WeChat)
   - 用户资料管理
   - 头像上传和裁剪
   - 密码修改
   - 账户安全设置

2. 视频管理
   - 视频链接解析和验证
   - 格式选择和预览
   - 下载进度管理
   - 下载历史记录
   - 格式转换
   - AI 视频生成

3. 支付系统
   - 多渠道支付集成
     - 支付宝 (AliPay)
     - 微信支付 (WeChat Pay)
     - PayPal
     - Stripe (信用卡)
   - 积分套餐选择
   - 支付状态追踪
   - 订单管理
   - 支付历史记录

4. 任务系统
   - 任务创建和管理
   - 进度追踪
   - 任务状态更新
   - 任务历史记录
   - 任务通知

5. 反馈系统
   - 问题反馈
   - 功能建议
   - 联系方式
   - 反馈状态追踪

6. 积分系统
   - 积分充值
   - 积分消费
   - 积分历史记录
   - 积分余额显示

## 开发环境要求

- Node.js 20.x
- pnpm 8.x

## 环境配置

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境变量配置

创建 `.env` 文件：
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_WECHAT_APP_ID=your-wechat-app-id
VITE_ALIPAY_APP_ID=your-alipay-app-id
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## 开发命令

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

### 运行测试

```bash
pnpm test
```

## 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 风格指南
- 使用 Composition API 和 `<script setup>`
- 组件使用 PascalCase 命名
- 方法和属性使用 camelCase
- 事件使用 kebab-case
- 使用 ESLint 和 Prettier 进行代码格式化

## 组件开发规范

1. 组件结构
   ```vue
   <script setup lang="ts">
   // 导入
   // 类型定义
   // 组件逻辑
   // 生命周期
   </script>

   <template>
     <!-- 组件模板 -->
   </template>

   <style scoped>
   /* 组件样式 */
   </style>
   ```

2. Props 定义
   ```ts
   interface Props {
     title: string
     required?: boolean
   }

   const props = defineProps<Props>()
   ```

3. 事件定义
   ```ts
   const emit = defineEmits<{
     (e: 'update', value: string): void
     (e: 'submit'): void
   }>()
   ```

## 状态管理

使用 Pinia 进行状态管理，store 示例：

```ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(credentials: LoginCredentials) {
    // 登录逻辑
  }

  return { user, isLoggedIn, login }
})
```

## 路由配置

使用 Vue Router 进行路由管理，包含路由守卫：

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      meta: { requiresAuth: true }
    }
    // ...其他路由
  ]
})
```

## 性能优化

1. 组件优化
   - 使用 `v-show` 代替频繁切换的 `v-if`
   - 合理使用 `v-once` 和 `v-memo`
   - 使用动态组件和异步组件
   - 使用 `keep-alive` 缓存组件

2. 资源优化
   - 图片懒加载
   - 路由懒加载
   - 第三方库按需导入
   - 使用 CDN 加载大型资源

3. 构建优化
   - 代码分割
   - Tree-shaking
   - 压缩资源
   - 缓存优化

## 生产部署

1. 构建项目
   ```bash
   pnpm build
   ```

2. 部署 `dist` 目录到 Web 服务器

3. 配置服务器重写规则以支持 HTML5 History 模式

4. 配置 HTTPS 和 HTTP/2

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 配置文件说明

### Vite 配置 (vite.config.ts)
```ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### TypeScript 配置 (tsconfig.json)
- 启用严格模式
- 配置路径别名
- Vue 3 类型支持

### Tailwind 配置 (tailwind.config.js)
- 自定义主题
- 响应式断点
- 暗色模式支持

### PostCSS 配置 (postcss.config.js)
- Tailwind CSS 集成
- Autoprefixer 配置

## 贡献

1. Fork 项目
2. 创建特性分支
3. 提交代码
4. 发起 Pull Request

## 许可证

MIT License
