<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" :key="index" class="item">
        <div class="rank" v-show="rank">
          <span :class="getRankClass(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
          <span class="listen"><i class="icon-headphones"></i></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
//      rank用来表示是否显示排行图标
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}  ·  ${song.album}`
      },
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
//      获取排行榜的前三的样式
      getRankClass(index) {
        if (index < 3) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
//      获取排行榜的内容
      getRankText(index) {
        if (index > 2) {
          return index + 1
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 0.6rem
      font-size: $font-size-medium
      .rank
        flex: 0 0 0.25rem
        width: 0.25rem
        margin-right: 0.2rem
        text-align: center
        .icon
          display: inline-block
          width: 0.25rem
          height: 0.24rem
          background-size: 0.25rem 0.24rem
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        position: relative
        flex: 1
        line-height: 0.2rem
        overflow: hidden
        .name
          no-wrap()
          max-width 88%
          color: $color-text-d
        .desc
          no-wrap()
          margin-top: 0.04rem
          max-width 88%
          color: $color-text-ddd
        .listen
          position: absolute
          top: 0.13rem
          right: 0
          .icon-headphones
            font-size: 0.16rem
            /*color: gray*/
</style>
