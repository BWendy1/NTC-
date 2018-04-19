<template>
  <header>
    <div class="logo" @click="$router.push('essayList')"></div>
    <span class="logo-text" @click="$router.push('essayList')">小句复合体标注系统</span>
    <div class="user"
         @mouseleave="showMore = false"
         @mouseover="showMore = true">
      <span>{{ userName }}</span>
      <img src="../../assets/user.png">
      <ul v-show="showMore"
           :class="{ 'user-btns': true, 'manage': root }">
        <li v-if="root" @click="goUserManage">用户管理</li>
        <li @click="logout">退出账号</li>
      </ul>
    </div>
  </header>
</template>

<script>
import { delCookie } from '../../service/index'
export default {
  data () {
    return {
      showMore: false,
      userName: this.getCookie('userName') || '未登录',
      root: this.getCookie('root'),
      showChangePwd: false
    }
  },
  computed: {
  },
  methods: {
    goUserManage () {
      // 去用户管理页
      this.$router.push('/userList')
    },
    getCookie (cname) {
      let name = cname + '='
      let ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        var c = ca[i].trim()
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    logout () {
      delCookie('userName')
      delCookie('userId')
      delCookie('root')
      this.$router.push('login')
    },
    toHome () {
      this.$router.replace('login')
    }
  },
  created () {
    if (!this.userName || this.userName === '未登录') {
      this.$router.push('/login')
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 67px;
  background: #FFFFFF;
  box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  .logo {
    background: url(../../assets/icon.svg);
    width: 64px;
    height: 64px;
    margin-left: 9.1%;
    display: inline-block;
    cursor: pointer;
  }
  .logo-text {
    position: absolute;
    top: 16%;
    font-size: 32px;
    cursor: pointer;
  }
  .user {
    position: absolute;
    top: calc(50% - 12px);
    right: 10%;
    color: #A5A5A5;
    height: 40px;
    > span {
      padding-right: 10px;
    }
    > img {
      width: 13px;
      height: 13px;
      cursor: pointer;
    }
    > .manage {
      bottom: -80px!important;
    }
    > .user-btns {
      position: absolute;
      bottom: -35px;
      right: 0;
      padding: 0;
      margin: 0;
      background: #FFFFFF;
      z-index: 999;
      box-shadow: 0 1px 8px 3px rgba(0, 0, 0, 0.3);
      > li {
        width: 4em;
        font-size: 15px;
        text-align: center;
        line-height: 100%;
        padding: 15px 25px;
        cursor: pointer;
      }
      li:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      li:first-child {
        color: #333333;
      }
      li:last-child {
        color: #F75A5A;
      }
      hr {
        border: none;
        height: 0.6px;
        background-color: #E5EBEC;
      }
    }
    .user-btns::before {
      content: '';
      position: absolute;
      top: -7px;
      right: 9px;
      display: inline-block!important;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #eee;
      border-left: 7px solid transparent;
      border-bottom-color: rgba(0, 0, 0, 0.1);
    }
    .user-btns::after {
      position: absolute;
      top: -6.1px;
      right: 10.1px;
      display: inline-block!important;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #fff;
      border-left: 6px solid transparent;
      content: '';
    }
  }
}
</style>
