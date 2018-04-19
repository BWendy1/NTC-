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
@import "assets/sass/common.scss";
html, body {
  width: 100%;
  margin: 0;
  padding: 0;
}
ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
input, button {
  outline: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
