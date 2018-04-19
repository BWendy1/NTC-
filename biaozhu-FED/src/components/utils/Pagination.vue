/**
* 分页组件
*/
<template>
  <div class="page-wrap">
    <ul class="pagination">
      <li @click="callback(pagination.currentPage - 1 + '')"><span>&lt;</span></li>
      <li v-for="item in range"
          :class="{ check: item === pagination.currentPage, 'page-no': true }"
          @click="callback(item + '')"
          :key="item">
        <span>{{item}}</span>
      </li>
      <li @click="callback(pagination.currentPage + 1 + '')"><span>></span></li>
    </ul>
    <span class="return-cont">
      跳至 <input type="text"
                  @keyup.enter="callback(num + '')"
                  class="form-control"
                  v-model="vnum"> 页
      <span> 共 {{ pagination.totalPage }} 页</span>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true
    },
    callback: {
      type: Function,
      required: true
    },
    offset: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      vnum: ''
    }
  },
  computed: {
    range () {
      let pages = []
      if (!this.pagination.totalPage) {
        return pages
      }
      let startPage = 1
      let endPage = this.pagination.totalPage
      const maxSize = Math.min(10, this.pagination.totalPage)
      startPage = Math.max(this.pagination.currentPage - Math.floor(maxSize / 2), 1)
      endPage = startPage + maxSize - 1

      if (endPage > this.pagination.totalPage) {
        endPage = this.pagination.totalPage
        startPage = endPage - maxSize + 1
      }
      for (let number = startPage; number <= endPage; number++) {
        pages.push(number)
      }
      return pages
    },
    num () {
      return parseInt(this.vnum, 10) || 1
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  padding: 0 20px 40px 0;
  background: #FFFFFF;
  box-sizing: border-box;
  > .pagination {
    display: inline-block;
    > li {
      display: inline-block;
      width: 25px;
      height: 25px;
      border: 1px solid #E5EBEC;
      border-radius: 50%;
      cursor: pointer;
      text-align: center;
      margin-right: 10px;
      > span {
        vertical-align: sub;
        color: #8D949C;
      }
    }
    > .page-no {
      border: none;
      > span {
        font-size: 16px;
      }
    }
    > .check {
      background: #00D2C0;
      > span {
        color: #FFFFFF;
      }
    }
  }
  > .return-cont {
    vertical-align: middle;
    color: #8D949C;
    > .form-control {
      border: 1px solid #E5EBEC;
      height: 25px;
      width: 60px;
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 12.5px;
      color: #8D949C;
      text-align: center;
    }
    > span {
      padding-left: 10px;
    }
  }
}
</style>
