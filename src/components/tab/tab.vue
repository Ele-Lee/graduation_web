<template>
  <div class="tab">
    <!-- <router-link class="tab-item" to="/user"> -->
    <!-- <div class="tab-link" @click.stop="showUser"> -->
    <div class="tab-link" @click.stop="showUser">
      <span class="menu"></span>
    </div>
    <!-- </div> -->
    <!-- </router-link> -->
    <router-link class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
    <!-- <div class="user-center__background" ref='__background' :style="taggleShowUser ? 'opacity: 0.8;z-index: 200' : 'opacity: 0;z-index: -200'"
       @click="hideUser"></div> -->
    <transition name="slide-show">
      <div class="user-center__background" v-show="taggleShowUser">
        <user-center ref="menu" v-show="taggleShowUser" @hideUser="hideUser"></user-center>
      </div>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
  import userCenter from 'components/user-center/user-center'
  export default {
    data() {
      return {
        taggleShowUser: false
      }
    },
    methods: {
      showUser() {
        this.taggleShowUser = true
        setTimeout(() => {
          this.$refs.menu.srcollRefresh()
        }, 1000)
      },
      hideUser() {
        // console.log('123123')
        this.taggleShowUser = false
      }
    },
    components: {
      userCenter
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .tab
    position relative
    display: flex
    height: 0.42rem
    line-height: 0.42rem
    font-size: $font-size-small
    background: $color-highlight-background
    // box-shadow: 0 0.02rem 0.03rem rgba(238, 118, 0, 0.4)
    background-image: linear-gradient(to bottom,rgba(249,249,249,.8),rgba(235,235,235,.8))
    z-index 20
    &::after
      position absolute
      width 100%
      height 0.02rem
      right 0
      top 0.4rem
      // top 0.42rem
      // top 0.38rem
      // transform translateY(0.-2rem)
      box-shadow: 0 0.02rem 0.03rem rgba(238, 118, 0, 0.6)
      // z-index 10
      content: ''

    .menu
      position relative
      display inline-block
      // top 50%
      // left 50%
      // transform translate3d(-50%,-50%,0)
      margin 0.15rem 0.1rem
      // margin-left  0.08rem
      // box-sizing border-box
      // padding 0 0.08rem
      box-sizing border-box
      width 0.2rem
      height 0.14rem
      border 0.02rem solid $color-theme
      border-right none
      border-left none
      &::after
        position absolute
        top 50%
        left 0
        width 100%
        height 0.02rem
        background $color-theme
        transform translateY(-50%)
        content ''

    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 0.05rem
        color: $color-text-d
        font-size: 0.14rem
      &.router-link-active
        .tab-link
          color: $color-theme
          // border-bottom: 0.02rem solid $color-theme
          transition : all 1s

    .slide-show-enter-active, .slide-show-leave-active
      transition: all 0.6s
    .slide-show-enter, .slide-show-leave-to
      opacity 0

    .user-center__background
        // margin-left 75%
        position fixed
        width: 100%
        height: 100%
        transition: all 0.8s
        background rgba(0, 0, 0, 0.6)
        z-index 200
</style>
