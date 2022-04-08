<template>
  <div class="jz-news-detail">
    <div class="jz-crumbs">
      <router-link to="/home">首页</router-link>
      <span> > </span>
      <router-link :to="{path:'/news',query: {title:listTitle,type:type}}">{{listTitle}}</router-link>
      <span> > </span>
      <span>{{title}}</span>
    </div>
    <div class="jz-news-content">
      <h1>{{title}}</h1>
      <div class="jz-news-title">
        <span>作者：{{author}}</span>
        <span>时间：{{formatTime(time)}}</span>
      </div>
      <div class="jz-news-con" v-html="content">{{content}}</div>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: "Detail",
  data() {
    return {
      listTitle: '',
      title: '',
      type: '',
      author: '',
      time: '',
      content: ''
    }
  },
  created() {
    this.getNews()
  },
  methods:{
    getNews(){
      this.$api.supplier.news.getDetail(this.$route.params.id).then(res => {
        if (res.code === 200){
          if (res.data.type === 1) {
            this.listTitle = '企业新闻'
          } else if (res.data.type === 2) {
            this.listTitle = '企业公告'
          } else if (res.data.type === 3) {
            this.listTitle = '行业动态'
          }
          this.title = res.data.title
          this.type = res.data.type
          this.author = res.data.createUser
          this.time = res.data.createTime
          this.content = res.data.content
        }
      })
    },
    formatTime(value) {
      return formatDateTime(value)
    }
  }
}
</script>

<style scoped>
  .jz-news-detail{
    overflow: hidden;
  }
  .jz-news-content{
    width: 1200px;
    height: auto;
    margin: 0 auto 130px;
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    border-radius: 10px;
    padding: 20px 30px;
  }
  h1{
    width: 80%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 20px;
  }
  .jz-news-title{
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .jz-news-title span{
    margin-left: 20px;
    color: #999;
  }
  .jz-news-con{
    margin: 20px auto;
  }
  .jz-news-con /deep/ p{
    text-indent: 2em;
    line-height: 25px;
    margin-bottom: 10px;
  }
  .jz-news-con /deep/ .ql-align-center{
    text-align: center;
  }
  .jz-news-con /deep/ img{
    width: 50%;
    text-align: center;
    margin: 10px auto;
  }
</style>
