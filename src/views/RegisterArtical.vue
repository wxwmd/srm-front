<template>
  <div class="main">
    <fieldset>
      <legend style="text-align: center">
        <b>请阅读以下内容</b>
      </legend>
      <div class="read_box">
        <div class="content">
          <p style="font-size: 16px; font-weight: bold; text-align: center">供应商准入原则</p>
          <p>1、质量管理体系至少通过ISO9001:2000</p>
          <p>2、拟供物料在行业排前六名</p>
          <p>3、具备两年以上生产经验及汽车行业配套经验</p>
          <p style="font-size: 16px; font-weight: bold; text-align: center">供应商准入流程</p>
          <img style="margin: 20px auto;text-align: center" :src="imageUrl">
        </div>
      </div>
    </fieldset>
    <div class="check">
      <input type="checkbox" v-model="isAgree">我已阅读并同意该条款
    </div>
    <div style="text-align: center;margin-top: 20px;">
      <button :disabled="!isAgree" @click="toggle_registerForm">确定</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "registerArtical",
  data() {
    return {
      isAgree: false,
      imageUrl: this.$store.state.system.imageUrl
    }
  },
  created() {
    this.$store.dispatch('cleanUser');
  },
  methods: {
    toggle_registerForm() {
      this.$router.push({path: '/Register', query: {title: '注册', show: false}})
    }
  }
}
</script>

<style scoped>
  .main {
    width: 800px;
    margin-top: 40px;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
  }
  .read_box {
    width: 800px;
    height: 600px;
    overflow: auto;
    padding: 8px 15px;
    font-size: 14px;
    font-family: "宋体";
    letter-spacing: 1px;
    border: 1px solid #666666;
  }
  fieldset {
    width: 800px;
    margin: 0 auto;
  }
  .content {
    padding: 8px;
    font-size: 14px;
    font-family: Arial;
    overflow: hidden;
  }
  .check {
    text-align: center;
    margin-top: 20px;
  }
  button {
    width: 100px;
    height: 40px;
  }
</style>
