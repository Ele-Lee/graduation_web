<template>
  <div class="loading">
    <img src="./loading.gif" alt="" width="24" height="24">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在输入...'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    img
      display inline-block
    .desc
      line-height: 0.2rem
      font-size: $font-size-small
      // color: $color-text-l
      opacity 0.6
</style>
