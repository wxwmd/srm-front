<template>
  <div class="jz-home">
    <div class="jz-banner">
      <img src="../../assets/supplier/image/banner.jpg" alt="">
    </div>
    <div class="jz-home-main">
      <home-nav></home-nav>
      <div class="jz-home-con">
        <div class="jz-home-list" v-for="(items,index) in list" :key="index">
          <h4>
            <div class="jz-home-title">
              <span>||</span>
              <strong>{{ items.title }}</strong>
            </div>
            <router-link :to="{path:'/news/list',query: items.query}">更多>></router-link>
          </h4>
          <ul>
            <li v-for="(item,i) in items.data" :key="i">
              <router-link :to="{path:'/news/list/' + item.id,query:{data:item}}">
                <span>{{ item.title }}</span>
                <span>{{ formatTime(item.createTime) }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/supplier/Home/HomeNav";
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "Home",
  components: {HomeNav},
  data() {
    return {
      list: [{
        title: '行业动态',
        query: {title: '行业动态', type: 3},
        data: []
      }, {
        title: '企业新闻',
        query: {title: '企业新闻', type: 1},
        data: []
      }, {
        title: '企业公告',
        query: {title: '企业公告', type: 2},
        data: []
      }]
    }
  },
  created() {
    if (this.$store.state.user.userId === '' || this.$store.state.user.userId === undefined){
      this.$router.push({path:'/login'});
    }
    this.getNews()
  },
  methods: {
    getNews() {
      this.$api.supplier.news.getHomeNew().then(res => {
        if (res.code === 200){
          this.list[0].data = res.data.industryDynamics
          this.list[1].data = res.data.enterpriseNews
          this.list[2].data = res.data.enterpriseAnnouncement
        } else {
          this.$message.error(res.code + ':' + res.msg)
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
.jz-home {
  width: 100%;
  min-width: 1200px;
  height: auto;
  margin: auto;
}

.jz-banner {
  width: 100%;
  min-width: 1200px;
  height: 400px;
}

.jz-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.jz-home-main {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  height: auto;
  margin: 30px auto;
  padding-bottom: 100px;
}

.jz-home-con {
  width: 78%;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 0 0 5px #ddd;
  border-radius: 10px;
}

h4 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: normal;
}

.jz-home-title > span {
  color: #4499ff;
  font-weight: bold;
  margin-right: 5px;
}

.jz-home-title > strong {
  color: #333;
  font-weight: normal;
  /*color: #4499ff;*/
}

h4 > a {
  font-size: 14px;
  color: #999;
}

h4 > a:hover {
  color: #4499ff;
}

.jz-home-list {
  width: 48%;
  margin-bottom: 20px;
}

.jz-home-list:first-child {
  width: 100%;
}

.jz-home-list li a {
  display: flex;
  width: 100%;
  line-height: 40px;
  justify-content: space-between;
}

.jz-home-list li a span:first-child {
  display: block;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jz-home-list li a:hover {
  color: #4499ff;
}
</style>

