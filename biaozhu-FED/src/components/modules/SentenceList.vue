<template>
  <div class="sentence-list">
    <table class="sentence-list-table">
      <tr>
        <th style="width:70%">语句</th>
        <th style="width:8%;text-align: center">状态</th>
        <th style="width:8%"
            class="align-right">操作</th>
      </tr>
      <tr v-for="(item, index) in dataList" :key="item.id">
        <td>
          <div>{{ JSON.parse(item.data).text }}</div>
          <div v-if="preNo === index"
               class="preview"
               v-html="previewData"></div>
        </td>
        <td style="text-align: center">
          <button class="a-btn"
                  v-if="item.isFinished"
                  @click="preview(item.id, index)">预览</button>
          <button class="a-btn disabled-btn"
                  disabled
                  v-else>未完成</button>
        </td>
        <td class="align-right">
          <button class="a-btn"
                  v-if="!item.isFinished"
                  @click="goLabel(item.id)">标注</button>
          <button class="a-btn change-btn"
                  @click="goLabel(item.id, 'change')"
                  v-else>修改</button>
        </td>
      </tr>
    </table>
    <Pagination v-if="pageObj.totalPage && pageObj.totalPage > 1"
                :callback="pageCallback"
                :pagination="pageObj">
    </Pagination>
  </div>
</template>

<script>

import * as service from '../../service/index'
import Pagination from '../utils/Pagination'

export default {
  data () {
    return {
      dataList: null,
      id: this.$route.query.id,
      pageObj: {
        totalPage: 0,
        currentPage: 1
      },
      userId: service.getCookie('userId') || '',
      preNo: null,
      previewData: 'df'
    }
  },
  components: {
    Pagination
  },
  created () {
    service.postAxios('/cgi-bin/sentenceList.py', {
      id: this.id,
      userId: this.userId,
      pageSize: 10,
      pageNo: 1
    }, this.fillData)
  },
  methods: {
    preview (id, index) {
      service.postAxios('/cgi-bin/getFinishData.py', {
        originId: id,
        userId: this.userId
      }, (data) => {
        this.previewData = data.is.replace(/\r/g, '&nbsp;').replace(/\n/g, '<br />')
        this.preNo = index
      })
    },
    fillData (data) {
      if (data) {
        this.dataList = data.sentenceList
        this.pageObj.currentPage = data.currentPage
        this.pageObj.totalPage = data.totalPage
        this.preNo = null
        this.previewData = ''
      }
    },
    goLabel (id, change) {
      if (change === 'change') { // 修改
        window.location.href = `http://localhost:8099?id=${id}&parentId=${this.id}&userId=${this.userId}&change=true`
      } else {
        window.location.href = `http://localhost:8099?id=${id}&parentId=${this.id}&userId=${this.userId}`
      }
    },
    pageCallback (pageNo) {
      if (+pageNo > this.pageObj.totalPage || +pageNo < 1) {
        return
      }
      this.currentPage = pageNo || 1
      if (!this.id) {
        return
      }
      service.postAxios('/cgi-bin/sentenceList.py', {
        id: this.id,
        userId: this.userId,
        pageSize: 10,
        pageNo: pageNo
      }, this.fillData)
    }
  }
}
</script>

<style lang="scss" scoped>
  .sentence-list {
    margin: 40px auto;
    width: 80%;
    text-align: left;
    .sentence-list-table {
      width: 100%;
      border-collapse: collapse;
      background: #FFFFFF;
      border: 1px solid #00d2c0;
      margin-bottom: 30px;
      tr {
        height: 48px;
        border-bottom: solid 1px #00d2c0;
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
          div {
            margin: 10px 0;
          }
          .preview {
            background: #00D2C0;
            color: #FFFFFF;
            border: 1px solid #00d2c0;
            margin: 15px 0;
            border-radius: 5px;
            padding: 5px 10px;
          }
        }
        .align-right {
          text-align: right;
          padding-right: 20px;
        }
      }
    }
  }
</style>
