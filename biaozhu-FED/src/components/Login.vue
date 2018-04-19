<template>
  <div class="login-page">
    <h1>小句复合体标注系统</h1>
    <div class="user-center">
      <div>
        <img src="../assets/user-icon.png">
        <input type="text"
               @keyup.enter="login"
               id="emailIpt"
               placeholder="请输入用户名"
               v-model="loginInfo.name">
      </div>
      <div class="password-box">
        <img src="../assets/pwd.png">
        <input type="password"
               placeholder="请输入密码"
               id="pwdIpt"
               @keyup.enter="login"
               v-model.trim="loginInfo.password">
      </div>
      <!--<div class="checkbox-container">-->
        <!--<input type="checkbox"-->
               <!--id="rememberPwd"-->
               <!--v-model.trim="isRemember"-->
               <!--v-show="false">-->
        <!--<span class="check-box"-->
                <!--@click="isRemember = !isRemember">-->
          <!--<span v-show="isRemember"-->
                <!--class="get-icon"></span>-->
        <!--</span>-->
        <!--<label for="rememberPwd">记住密码</label>-->
      <!--</div>-->
      <span v-show="isWrongInfo"
           class="error-tips">
        {{ wrongInfo }}
      </span>
      <div>
        <button @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { loginAxios, getCookie, setCookie, delCookie } from '../service/index'
import { Base64 } from 'js-base64'
export default {
  data () {
    return {
      loginInfo: {
        name: '',
        password: ''
      },
      isRemember: false,
      isWrongInfo: false,
      wrongInfo: ''
    }
  },
  methods: {
    login () {
      // todo 验证填写
      if (this.loginInfo.name && this.loginInfo.password) {
        this.isNull = false
        loginAxios(this.loginInfo, this.afterLogin)
      } else {
        this.isWrongInfo = true
        this.wrongInfo = '密码或用户名为空，请输入'
      }
    },
    checkLoginInfo () {
      const userName = getCookie('userName')
      if (userName) {
        this.$router.replace('essayList')
      } else {
        const name = getCookie('userName')
        const password = getCookie('password')
        if (name) {
          this.loginInfo.name = name
        }
        if (password) {
          this.loginInfo.password = Base64.decode(password)
          this.isRemember = true
        }
      }
    },
    afterLogin (res) {
      if (res) {
        if (res.success) {
          const user = res.data
          setCookie('userName', user.name)
          setCookie('userId', user.userId)
          setCookie('root', user.root ? user.root : '')
          if (this.isRemember) {
            const esPassword = Base64.encode(this.loginInfo.password)
            setCookie('password', esPassword, 10)
          } else {
            delCookie('password')
          }
          this.$router.push('essayList')
        } else {
          this.isWrongInfo = true
          this.wrongInfo = res.message
        }
      } else {
        this.isWrongInfo = true
        this.wrongInfo = '未知错误!'
      }
    }
  },
  created () {
    this.checkLoginInfo()
  }
}
</script>

<style lang="scss">
body, html , #app{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.login-page {
  width: 100%;
  height: 100%;
  background: url(../assets/bg.png);
  h1 {
    color: #FFFFFF;
    width: 10em;
    margin: 0 auto;
    letter-spacing: 0.1em;
    position: relative;
    top: 10%;
  }
  .user-center {
    position: relative;
    top: 15%;
    width: 410px;
    height: 400px;
    margin: 0 auto;
    text-align: center;
    background: rgba(99, 98, 83, 0.25);
    input {
      width: 350px;
      background: #FFFFFF;
      border: none;
      opacity: 0.83;
      box-sizing: border-box;
      border-radius: 2px;
      padding: 20px 40px;
      color: #5f5f5f;
    }
    > div {
      width: 350px;
      margin: 0 auto;
      position: relative;
      top: 15%;
      margin-bottom: 30px;
      img {
        z-index: 999;
        position: absolute;
        top: 18px;
        left: 16px;
        width: 18px;
        height: 18px;
      }
    }
    > .password-box {
      margin-bottom: 60px;
    }
    > .error-tips {
      display: inline-block;
      font-size: 14px;
      color: #FF4040;
      letter-spacing: 1.1px;
      position: relative;
      top: 50px;
      margin-bottom: 20px;
    }
    .checkbox-container {
      text-align: left;
      margin: 10px auto 20px auto;
      .check-box {
        border: 1px solid #FFFFFF;
        border-radius: 2px;
        width: 13px;
        height: 13px;
        display: inline-block;
        cursor: pointer;
        vertical-align: middle;
        margin-right: 10px;
        .get-icon {
          display: inline-block;
          position: relative;
          left: 4px;
          top: -6px;
          width: 4px;
          height: 8px;
          border: solid #FFFFFF;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
      label {
        cursor: pointer;
        font-size: 14px;
        color: #FFFFFF;
      }
    }
    button {
      width: 100%;
      height: 56px;
      background: #00D2C0;
      border-radius: 2px;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: #FFFFFF;
    }
    button:hover {
      background: #03c5b5;
    }
  }
}
</style>
