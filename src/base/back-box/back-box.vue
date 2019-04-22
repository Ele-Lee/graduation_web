<template>
  <div class="back-box">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="main-title">{{title}}</h1>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    methods: {
//    回到上一个页面路由
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .back-box
    width: 100%
    height: 0.4rem
    .back
      position: absolute
      top: 0
      left: 0.06rem
      z-index: 50
      .icon-back
        display: block
        padding: 0.1rem
        font-size: $font-size-large-x
        color: $color-theme
    .main-title
      position: absolute
      top: 0
      left: 10%
      width: 80%
      z-index: 50
      no-wrap()
      text-align: center
      line-height: 0.4rem
      font-size: $font-size-large
      color: $color-text-d
</style>

