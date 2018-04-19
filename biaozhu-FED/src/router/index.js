import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import EssayList from '@/components/modules/EssayList'
import SentenceList from '@/components/modules/SentenceList'
import UserList from '@/components/modules/UserList'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: 'essayList',
      children: [
        {
          path: 'essayList',
          name: 'essayList',
          component: EssayList
        }, {
          path: 'sentenceList',
          name: 'sentenceList',
          component: SentenceList
        }, {
          path: 'userList',
          name: 'userList',
          component: UserList
        }
      ]
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
