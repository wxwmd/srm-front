<template>
  <div class="jz-supplier-container">
    <div class="jz-info-details">
      <div class="jz-info-heand">
        <strong>{{ title }}</strong>
        <div class="jz-info-title">
          <span>作者：{{author}}</span>
        </div>
        <div class="jz-info-title">
          <span>时间：{{formatTime(time)}}</span>
        </div>
      </div>
      <div class="jz-info-content">
        <div class="jz-info-title">
          <span>正文：</span>
        </div>
        <div class="jz-info-con" v-html="content">{{ content }}</div>
      </div>
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
  methods: {
    getNews() {
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
.jz-info-details {
  width: 90%;
  height: auto;
  margin: 30px;
  border: 1px solid #999;
}
.jz-info-heand {
  /*box-shadow: 0 0 10px #ddd;*/
  /*border-radius: 10px;*/
  height: auto;
  background: #fff;
  padding: 17px 1px;
  margin-bottom: 5px;
  border-bottom: 1px solid #999;
}
strong {
  margin: 20px 20px;
  line-height: 30px;
}
.jz-info-content {
  background: #fff;
  height: 50%;
  padding-top: 10px;
}
.jz-info-title {
  width: 100%;
  display: flex;
  padding: 6px 0;
}
.jz-info-title span {
  margin-left: 20px;
  color: #999;
}
.jz-info-con {
  margin: 20px 20px;
}
.jz-info-con /deep/ p {
  text-indent: 2em;
  line-height: 25px;
  margin-bottom: 10px;
}
.jz-info-con /deep/ .ql-align-center {
  text-align: center;
}
.jz-info-con /deep/ img {
  width: 50%;
  text-align: center;
  margin: 10px auto;
}
.jz-info-footer {
  /*box-shadow: 0 0 10px #ddd;*/
  /*border-radius: 10px;*/
  height: 19%;
  padding: 12px 17px;
  overflow: auto;
  border-top: 1px solid #999;
}
ul {
  padding: 12px 17px;
}
</style>
