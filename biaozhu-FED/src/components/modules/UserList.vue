<template>
  <div class="user-list">
    <table class="user-list-table">
      <tr>
        <th style="width:33%">ID</th>
        <th style="width:16%">用户名</th>
        <th style="width:16%;">密码</th>
        <th style="width:15%;">权限</th>
        <th style="width:10%">操作</th>
        <th style="width:10%">操作</th>
      </tr>
      <tr v-for="item in userList" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.password }}</td>
        <td>{{ item.root ? 'root' : '----' }}</td>
        <td>
          <button :class="{ 'a-btn': true, 'disabled-btn': item.root }"
                  @click="deleteUser(item.id)"
                  :disabled="item.root === 1">
            删除
          </button>
        </td>
        <td>
          <button :class="{ 'a-btn': true, 'disabled-btn': item.root }"
                  @click="changeUser(item)"
                  :disabled="item.root === 1">
            修改
          </button>
        </td>
      </tr>
    </table>
    <div class="add-user" v-if="root">
      <div v-if="changeOrAdd">
        <span>
          <span class="form-ipt">
            用户名： <input type="text" v-model="newUser.name">
          </span>
          <span class="form-ipt">
            密码： <input type="password" v-model="newUser.password">
          </span>
          <span class="form-ipt">
            权限：
            <span>
              <select name="select" v-model="newUser.root">
                <option value="0">normal</option>
                <option value="1">root</option>
              </select>
            </span>
          </span>
        </span>
        <span v-if="changeOrAdd === 'add'">
          <button @click="addUser(true)">增加</button>
        </span>
        <span v-else>
          <button @click="addUser(false)">修改</button>
        </span>
        <button @click="changeUser(null)" style="background: grey">取消</button>
      </div>
      <button v-else @click="changeOrAdd = 'add'">
        增加用户
      </button>
    </div>
  </div>
</template>

<script>
import * as service from '../../service/index'
export default {
  data () {
    return {
      root: service.getCookie('root'),
      userList: [],
      newUser: {
        id: '',
        name: '',
        password: '',
        root: 0
      },
      changeOrAdd: ''
    }
  },
  created () {
    service.postAxios('/cgi-bin/userList.py', null, (data) => {
      if (data.userList && data.userList.length) {
        this.userList = data.userList
      }
    })
  },
  methods: {
    changeUser (user) {
      if (user) {
        this.changeOrAdd = 'change'
        this.newUser.name = user.name
        this.newUser.password = user.password
        this.newUser.root = user.root
        this.newUser.id = user.id
      } else {
        this.changeOrAdd = ''
        this.newUser.name = ''
        this.newUser.password = ''
        this.newUser.root = 0
        this.newUser.id = ''
      }
    },
    addUser (add) {
      if (this.newUser.name.length > 12 || this.newUser.name.length < 3) {
        alert('用户名长度应在3到12之间')
        return
      }
      const re = new RegExp('^[a-zA-Z]+$')
      if (!re.test(this.newUser.name)) {
        alert('用户名应该是英文')
        return
      }
      if (this.newUser.password.length > 20 || this.newUser.password.length < 6) {
        alert('密码长度在应6到20之间')
        return
      }
      if (add) {
        service.postAxios('/cgi-bin/addUser.py', {
          name: this.newUser.name,
          password: this.newUser.password,
          root: this.newUser.root
        }, (data) => {
          if (data && !data.message) {
            alert('添加成功')
            window.location.reload()
          } else if (data.message) {
            alert(data.message)
          }
        }, (error) => {
          alert(error)
        })
      } else {
        service.postAxios('/cgi-bin/changeUser.py', {
          id: this.newUser.id,
          name: this.newUser.name,
          password: this.newUser.password,
          root: this.newUser.root
        }, (data) => {
          if (data && !data.message) {
            alert('修改成功')
            window.location.reload()
          } else if (data.message) {
            alert(data.message)
          }
        }, (error) => {
          alert(error)
        })
      }
    },
    deleteUser (id) {
      if (!this.root) {
        alert('没有删除权限')
        return
      }
      service.postAxios('/cgi-bin/deleteUser.py', {
        id: id
      }, (data) => {
        if (data) {
          window.location.reload()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {
  .user-list-table {
    width: 80%;
    border-collapse: collapse;
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
    margin: 0 auto 30px auto;
    tr {
      height: 40px;
      th {
        padding-left: 20px;
        color: #FFFFFF;
        font-weight: 400;
        background: #00D2C0;
      }
      td {
        padding-left: 20px;
        text-align: center;
        color: #212121;
      }
      .align-right {
        text-align: right;
        padding-right: 20px;
      }
    }
    tr:nth-child(odd) {
      background: #F5F5F5;
    }
  }
  .add-user {
    width: 80%;
    margin: 10px auto;
    .form-ipt {
      margin-right: 36px;
    }
    button {
      padding: 5px 10px;
      background: #00d2c0;
      border: 1px solid #00d2c0;
      border-radius: 3px;
      color: #FFFFFF;
      cursor: pointer;
    }
  }
}
</style>
