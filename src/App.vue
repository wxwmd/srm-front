<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  html, body, #app {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: "Arial";
  }
  * {
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box;
    outline: none;
    /*-webkit-user-select: none;*/
    /*-moz-user-select: none;*/
    /*-ms-user-select: none;*/
    /*user-select: none;*/
  }
  a {
    text-decoration: none;
    color: var(--fontColor);
  }
  li {
    list-style: none;
  }
</style>
