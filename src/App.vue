<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
body{
  margin:0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  /*background: rgb(44,62,80);*/
}
#app{
  height: 100%;
  width: 100%;
}
</style>
