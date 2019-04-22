import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/recommend'
    },
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      name: 'rank',
      component: resolve => require(['components/rank/rank'], resolve),
      children: [
        {
          path: ':id',
          name: 'topList',
          component: resolve => require(['components/top-list/top-list'], resolve)
        }
      ]
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: resolve => require(['components/recommend/recommend'], resolve),
      children: [
        {
          path: ':id',
          name: 'disc',
          component: resolve => require(['components/disc/disc'], resolve)
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['components/search/search'], resolve),
      children: [
        {
          path: ':id',
          name: 'singerDetail',
          component: resolve => require(['components/singer-detail/singer-detail'], resolve)
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: resolve => require(['components/singer/singer'], resolve),
      children: [
        {
          path: ':id',
          name: 'singerDetail',
          component: resolve => require(['components/singer-detail/singer-detail'], resolve)
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: resolve => require(['components/user-center/user-center'], resolve),
      children: [
        {
          path: 'like-history',
          name: 'likeHistory',
          component: resolve => require(['components/like-history/like-history'], resolve)
        },
        {
          path: 'comment',
          name: 'comment',
          component: resolve => require(['components/comment/comment'], resolve)
        },
        {
          path: 'community',
          name: 'community',
          component: resolve => require(['components/community/community'], resolve)
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['components/login/login'], resolve)
    },
    {
      path: '/register',
      name: 'register',
      component: resolve => require(['components/register/register'], resolve)
    }
  ]
})
