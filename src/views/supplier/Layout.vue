<template>
  <div class="jz-home">
    <page-header></page-header>
    <div class="jz-supplier">
      <router-view/>
    </div>
<!--    <page-footer></page-footer>-->
  </div>
</template>

<script>
import PageHeader from "@/components/supplier/Home/PageHeader";
// import PageFooter from "@/components/supplier/Home/PageFooter";

export default {
  name: "Layout",
  components: {PageHeader}
}
</script>

<style scoped>
  @import "../../assets/supplier/css/supplier.css";
</style>
