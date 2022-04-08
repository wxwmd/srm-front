<template>
  <div class="jz-news">
    <div class="jz-crumbs">
      <router-link to="/home">首页</router-link>
      <span> > </span>
      <span>{{title}}</span>
    </div>
    <div class="jz-list">
      <h4>
        <div class="jz-home-title">
          <span>||</span>
          <strong>{{title}}</strong>
        </div>
      </h4>
      <ul class="jz-news-list">
        <li v-for="(item,i) in list" :key="i">
          <router-link :to="'/news/list/' + item.id">
            <span>{{item.title}}</span>
            <span>{{formatTime(item.createTime)}}</span>
          </router-link>
        </li>
      </ul>
      <!--  Pagination  -->
      <div class="jz-module-pagination">
        <el-pagination @size-change="pageSizeChange"
                       @current-change="pageCurrentChange"
                       :page-size="20"
                       background
                       layout="total, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import TableUtil from "../../../assets/supplier/js/TableUtil";
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: "List",
  data(){
    return{
      filter:{
        type:this.$route.query.type,
        limit: 20,
        page: 1
      },
      list:[],
      total:0,
      title:this.$route.query.title
    }
  },
  created() {
    this.getNews()
  },
  methods: {
    pageSizeChange (limit) {
      this.filter.limit = limit;
      this.getNews()
    },
    pageCurrentChange (page) {
      this.filter.page = page;
      this.getNews()
    },
    getNews(){
      this.$api.supplier.news.getAll(this.filter).then(res => {
        if (res.code === 200){
          this.list = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    formatTime(value){
      return formatDateTime(value).substr(0, formatDateTime(value).indexOf(' '))
    }
  }
}
</script>

<style scoped>
  .jz-news{
    overflow: hidden;
  }
  .jz-list{
    width: 1200px;
    height: auto;
    margin: 0 auto 130px;
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    border-radius: 10px;
    padding: 20px 30px;
  }
  h4{
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: normal;
  }
  .jz-home-title>span{
    color: #4499ff;
    font-weight: bold;
    margin-right: 5px;
  }
  .jz-home-title>strong{
    color: #333;
    font-weight: normal;
  }
  .jz-news-list li a{
    display: flex;
    width: 100%;
    line-height: 40px;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
  }
  .jz-news-list li a span:first-child{
    display: block;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .jz-news-list li a:hover{
    color: #4499ff;
  }
  /deep/ .el-pagination {
    display: flex;
    justify-content: center;
    margin: 60px auto 30px;
  }
</style>
