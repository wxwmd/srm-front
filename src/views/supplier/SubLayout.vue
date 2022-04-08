<template>
  <div class="jz-home">
    <page-header></page-header>
    <div class="jz-supplier">
      <div class="jz-supplier-content">
        <sub-menu/>
        <router-view/>
      </div>
    </div>
    <!--        <page-footer></page-footer>-->
  </div>
</template>

<script>
import PageHeader from "@/components/supplier/Home/PageHeader";
// import PageFooter from "@/components/supplier/Home/PageFooter";
import SubMenu from '@/components/supplier/Home/SubMenu'

export default {
  name: "SubLayout",
  components: {PageHeader, SubMenu},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
  @import "../../assets/supplier/css/supplier.css";
</style>
