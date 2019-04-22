<template>
  <div class="no-result">
    <!-- <div class="no-result-icon"></div> -->
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .no-result
    text-align: center
    .no-result-icon
      width: 0.86rem
      height: 0.9rem
      margin: 0 auto
      bg-image('no-result')
      background-size: 0.86rem 0.9rem
    .no-result-text
      margin-top: -0.3rem
      font-size: $font-size-medium
      color: $color-text-d
</style>
