<template>
  <div id="app" 
    v-loading.fullscreen.lock ='isLoading'
    element-loading-text="拼命加载中"  >
      <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'App',
  computed:{
    ...mapState('globalOptions',['isLoading']),
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

body {
  margin: 0;
}

</style>
