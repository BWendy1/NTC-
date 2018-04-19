<template>
  <div class="essay-list">
    <table class="essay-list-table">
      <tr>
        <th style="width:75%">语料库</th>
        <th style="width:10%;text-align: center"
            class="align-right">标注者</th>
        <th style="width:15%"
            class="align-right">操作</th>
      </tr>
      <tr v-for="item in essayList" :key="item.id">
        <td>{{ item.data }}</td>
        <td class="align-right" style="text-align: center">{{ !item.currentUserId ? '暂无' : userName}}</td>
        <td class="align-right">
          <button class="a-btn"
                  @click="goSentenceList(item)"
          >
            {{ !item.currentUserId ? '锁定' : '进入' }}
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import * as service from '../../service/index'
export default {
  data () {
    return {
      dataList: null,
      userName: service.getCookie('userName') || '未知',
      userId: service.getCookie('userId') || ''
    }
  },
  created () {
    service.postAxios('/cgi-bin/test.py', null, this.fillData)
  },
  computed: {
    essayList () {
      if (this.dataList) {
        return this.dataList.filter(item => {
          return !item.currentUserId || item.currentUserId === this.userId
        })
      }
    }
  },
  methods: {
    fillData (data) {
      if (data && data.length) {
        this.dataList = data
      }
    },
    goSentenceList (item) {
      if (!item.currentUserId) { // 如果是没有被锁定的任务 提醒用户
        alert('您好，选择进入意味着你将锁定该语料，其他人将没有权限进入')
      }
      service.postAxios('/cgi-bin/isLimited.py', {
        userId: this.userId,
        essayId: item.id
      }, (data) => {
        if (data) {
          this.$router.push({
            path: '/sentenceList',
            query: {
              id: item.id
            }
          })
        } else {
          alert('语料已被别人锁定，请重新选择')
          window.location.reload()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.essay-list {
  margin: 40px auto;
  width: 80%;
  text-align: left;
  .essay-list-table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
    margin-bottom: 30px;
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
        text-align: left;
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
}
</style>
