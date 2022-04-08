<template>
  <div class="jz-body">
    <page-header></page-header>
    <div class="jz-content">
      <page-nav></page-nav>
      <router-view/>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/management/PageHeader'
import PageNav from '@/components/management/PageNav'
export default {
  name: 'Router',
  components: {PageHeader, PageNav}
}
</script>

<style scoped>
  @import "../../assets/management/css/common.css";
</style>
