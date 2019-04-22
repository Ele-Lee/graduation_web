<template>
  <div class="m-header">
    <!--<div class="icon"></div>-->
    <i class="icon-brand"></i>
    <!--<h1 class="text">CC Music</h1>-->
    <img src="../../common/image/title2.png" alt="" class="title">
    <router-link class="search-btn" to="/user" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 0.44rem
    /*text-align: center*/
    /*margin-left: 0.1rem*/
    color: $color-theme
    font-size: 0
    background: $color-theme
    .icon-brand
      display: inline-block
      padding: 0.09rem 0.05rem 0.09rem 0.1rem
      font-weight 600
      /*font-size: $font-size-large-x*/
      font-size: 0.26rem
      color: $color-background
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 0.06rem
      width: 0.3rem
      height: 0.32rem
      margin-right: 0.04rem
      bg-image('logo')
      background-size: 0.3rem 0.32rem
    .title
      display inline-block
      width: 1.0rem
      height: 0.18rem
      line-height: 0.18rem
      padding: 0.04rem
      margin-top: 0.09rem
      vertical-align: top
    .search-btn
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 0.07rem
        font-size: 0.3rem
        color: $color-text
</style>
