<template>
  <div class="jz-index">
    <header>
      <div class="jz-head">
        <div class="jz-head-logo">
          <img :src="system.logoUrl" alt="">
          <strong>{{system.webName}}</strong>
        </div>
        <div class="jz-head-right">
          <button @click="login">登录</button>
          <button @click="register">注册</button>
        </div>
      </div>
    </header>
    <div class="jz-banner">
      <img src="../assets/supplier/image/banner.jpg" alt="">
    </div>
    <div class="jz-index-tab">
      <div v-for="(items,i) in titleList" :key="i" :class="show === i ? 'jz-news-title jz-active' : 'jz-news-title'">
        <div class="jz-news-title-con" @click="getNews(items.type,i)">
          <i class="el-icon-document"></i>
          <span>{{items.title}}</span>
        </div>
        <div class="jz-news-title-bot"></div>
      </div>
    </div>
    <ul class="jz-tab-con">
      <li v-for="(item,index) in news" :key="index">
        <router-link :to="{path:'/news/list/' + item.id,query:{data:item}}">
          <i class="el-icon-caret-right"></i>
          <span>{{ item.title }}</span>
          <span>{{ formatTime(item.createTime) }}</span>
        </router-link>
      </li>
    </ul>
    <footer></footer>
  </div>
</template>

<script>
import {formatDateTime} from '../assets/management/js/Utils'

export default {
  name: "Index",
  data() {
    return {
      show: 0,
      titleList: [
        {
          title: '企业新闻',
          type: 1
        },{
          title: '行业动态',
          type: 3
        }
      ],
      news: [],
      system: {}
    }
  },
  created() {
    this.getNews(this.titleList[0].type, this.show)
    this.getSyetem()
  },
  methods: {
    getSyetem(){
      this.$api.management.system.resource.getAll().then(res => {
        if (res.code === 200){
          let data = ''
          data = res.data.records[0].config
          this.system = JSON.parse(data)
          this.$store.dispatch('setSystem', this.system);
        }
      })
    },
    login() {
      this.$router.push('/login')
    },
    register() {
      this.$router.push('/registerArtical')
    },
    getNews(type, index) {
      let data = {
        type: type,
        limit: 12,
        page: 1
      }
      this.$api.supplier.news.getAll(data).then(result => {
        if (result.code === 200) {
          this.news = result.data.records
          this.show = index
        } else {
          this.$message.error(result.code + ':' + result.msg)
        }
      })
    },
    formatTime(value) {
      return formatDateTime(value).substr(0, formatDateTime(value).indexOf(' '))
    }
  }
}
</script>

<style scoped>
  .jz-index {
    width: 100%;
    min-width: 1200px;
    height: auto;
  }
  header {
    width: 100%;
    min-width: 1200px;
    height: 80px;
    background: #272c30;
  }
  .jz-head {
    width: 1200px;
    height: 80px;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }
  .jz-head-logo {
    width: 300px;
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    color: #fff;
    display: flex;
    align-items: center;
  }
  .jz-head-logo img {
    height: 50px;
    margin-right: 20px;
  }
  .jz-head-right {
    width: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .jz-head-right button {
    width: 50px;
    height: 25px;
    background: #fff;
    border: none;
    border-radius: 4px;
    margin-left: 10px;
  }
  .jz-banner {
    width: 100%;
    height: 400px;
  }
  .jz-banner img {
    width: 100%;
    min-width: 1200px;
    height: 100%;
    object-fit: cover;
  }
  .jz-index-tab {
    width: 1200px;
    height: auto;
    display: flex;
    margin: -30px auto 50px;
  }
  .jz-news-title {
    width: 50%;
    height: 80px;
    background: #333333;
    color: #fff;
    display: flex;
    justify-content: center;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
  }
  .jz-news-title i {
    margin-right: 10px;
  }
  .jz-news-title:nth-child(2) {
    background: #efefef;
    color: #333;
  }
  .jz-news-title.jz-active {
    color: #0b84d5;
    position: relative;
  }
  .jz-news-title.jz-active .jz-news-title-bot {
    position: absolute;
    bottom: -40px;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -20px;
    border: 20px solid;
    border-color: #333 transparent transparent;
  }
  .jz-news-title:nth-child(2).jz-active .jz-news-title-bot {
    border-color: #efefef transparent transparent;
  }
  .jz-news-title-con {
    width: 100%;
  }
  .jz-tab-con {
    width: 1200px;
    height: auto;
    margin: 0 auto 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0;
  }
  .jz-tab-con li {
    display: block;
    width: 48%;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    background: #fff;
    border-bottom: 1px dashed #999;
  }
  .jz-tab-con li a{
    width: 100%;
    list-style-type: disc;
    display: flex;
    justify-content: space-between;
  }
  .jz-tab-con li a i {
    line-height: 50px;
  }
  .jz-tab-con li a span:nth-child(2) {
    display: block;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .jz-tab-con a:hover {
    color: #0b84d5;
    /*background: #0b84d5;*/
    /*color: #fff;*/
  }
  footer {
    width: 100%;
    height: 300px;
    background: #272c30;
  }
</style>
