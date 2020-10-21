<template>
  <div id="app">
      <router-view/>
    <tab-bar v-if="$route.meta.showTabBar"/>
  </div>
</template>

<script>
import TabBar from './components/TabBar/TabBar'
import 'mint-ui/lib/style.css'
export default {
  name: 'App',
  components: { TabBar }
}
</script>

<style lang="stylus" ref="stylesheet/stylus">
  html, body, #app
    width 100%
    height 100%
    button
      cursor pointer
</style>
