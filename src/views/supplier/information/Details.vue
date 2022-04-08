<template>
  <div class="jz-supplier-container">
    <div class="jz-info-details">
      <div class="jz-info-heand">
        <strong>{{ title }}</strong>
        <div class="jz-info-title">
          <span>发件人：{{ sender }}</span>
        </div>
        <div class="jz-info-title">
          <span>收件人：{{ recipient }}</span>
        </div>
        <div class="jz-info-title">
          <span>时间：{{ formatTime(time) }}</span>
        </div>
      </div>
      <div class="jz-info-content">
        <div class="jz-info-title">
          <span>正文：</span>
        </div>
        <div class="jz-info-con" v-html="content">{{ content }}</div>
      </div>
      <div class="jz-info-footer">
        <strong>附件：</strong>
        <ul>
          <li v-for="(accessory,index) in accessoryCollection" :key="index">
            <a @click="fileDownLoad(accessory)" style="cursor: pointer;color: #337ab7;">{{ accessory.fileName }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
import common from "@/assets/supplier/js/common";

export default {
  name: "Detail",
  data() {
    return {
      title: '',
      type: '',
      sender: '',
      recipient: '',
      content: '',
      time: '',
      accessoryCollection: [],
    }
  },
  created() {
    this.getinfo()
  },
  methods: {
    getinfo() {
      this.$api.supplier.information.getDetail(this.$route.params.id).then(res => {
        if (res.code === 200) {
          this.title = res.data.title
          this.type = res.data.type
          this.sender = res.data.sender
          this.recipient = res.data.recipient
          this.time = res.data.createTime
          this.content = res.data.content
          this.accessoryCollection = JSON.parse(res.data.accessoryCollection)
        }
      })
    },
    formatTime(value) {
      return formatDateTime(value)
    },
    fileDownLoad(accessory) {
      let params = {// 参数
        fileUrl: accessory.url,
        fileName: accessory.fileName,
      };
      this.$api.supplier.information.singleDownLoad("blob", params).then(res => {
        common.blobDownLoad(res);
      })
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
