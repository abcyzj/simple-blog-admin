import Vue from 'vue';
import Router, {RouterOptions, RouteConfig} from 'vue-router';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';

Vue.use(Router);

export const dashboardChildrenRroutes: RouteConfig[] = [
  {
    path: 'welcome',
    name: 'welcome',
    component: () => import('@/components/Welcome.vue'),
    meta: {
      title: '欢迎',
      hidden: true,
    },
  },
  {
    path: 'category',
    name: 'category',
    component: () => import('@/components/Category.vue'),
    meta: {
      title: '文章类别',
    },
  },
  {
    path: 'articleTable',
    name: 'articleTable',
    component: () => import('@/components/ArticleTable.vue'),
    meta: {
      title: '查看文章',
    },
  },
  {
    path: 'articleEditor',
    name: 'articleEditor',
    component: () => import('@/components/ArticleEditor.vue'),
    meta: {
      title: '编辑文章',
      hidden: true,
    },
  },
  {
    path: 'modifyPassword',
    name: 'modifyPassword',
    component: () => import('@/components/ModifyPassword.vue'),
    meta: {
      title: '修改密码',
      hidden: true,
    },
  },
];

const routerOption: RouterOptions = {
  routes: [
    {
      path: '/',
      component: Dashboard,
      name: 'dashboard',
      redirect: '/welcome',
      meta: {
        title: '控制台',
        hidden: true,
      },
      children: dashboardChildrenRroutes,
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: '登录',
        hidden: true,
      },
    },
    {
      path: '*',
      component: () => import('@/views/404.vue'),
      meta: {
        title: '404 Page',
        hidden: true,
      },
    },
  ],
};

const router = new Router(routerOption);

export default router;
