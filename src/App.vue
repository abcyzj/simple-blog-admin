<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #fafafa;
}
html {
  height: 100%;
}
#app {
  margin: 0;
  height: 100%;
}
a {
  outline: none;
  text-decoration: none;
}
</style>
