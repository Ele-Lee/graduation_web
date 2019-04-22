<template>
  <div id="app">
    <!-- <m-header></m-header> -->
    <tab></tab>
    <transition name="slide">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default{
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"
  #app
    color: $color-theme
    // .slide-enter-active, .slide-leave-active
    //   transition: all 0.5s
    // .slide-enter
    //   transform: translate3d(100%, 0, 0)
    // .slide-leave-to
    //   transform: translate3d(-100%, 0, 0)
</style>
