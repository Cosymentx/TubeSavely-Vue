import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../views/Home.vue'

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
      component: () => import('../views/About.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { guest: true }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/Terms.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/Privacy.vue')
    },
    {
      path: '/data-deletion',
      name: 'data-deletion',
      component: () => import('../views/DataDeletion.vue')
    },
    {
      path: '/platforms',
      name: 'platforms',
      component: () => import('../views/Platforms.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/credits-history',
      name: 'credits-history',
      component: () => import('../views/CreditsHistory.vue'),
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
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ],
  scrollBehavior(_, __, savedPosition) {
    return savedPosition || { top: 0 }
  }
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
