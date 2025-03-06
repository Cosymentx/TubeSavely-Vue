import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Terms from '../views/Terms.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import Platforms from '../views/Platforms.vue'
import CreditsHistory from '../views/CreditsHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true }
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms
    },
    {
      path: '/platforms',
      name: 'platforms',
      component: Platforms
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    {
      path: '/credits-history',
      name: 'credits-history',
      component: CreditsHistory,
      meta: { requiresAuth: true }
    },
    {
      path: '/download-history',
      name: 'download-history',
      component: () => import('../views/VideoHistory.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('../views/PaymentResult.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth/oauth/:provider/callback',
      redirect: to => {
        const { provider } = to.params
        const { code, state, error } = to.query
        return {
          path: '/login',
          query: { code, state, error, oauth_provider: provider }
        }
      }
    }
  ]
})

// 修复路由守卫逻辑
router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore()
  // const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 如果需要认证但用户未登录，重定向到登录页
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && userStore.isLoggedIn) {
    // 如果是访客页面但用户已登录，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router