<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" v-if="currentIndex===0" :data="playHistory" ref="songList">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex===1" :data="searchHistory"
                  ref="searchList" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list :searches="searchHistory" @delete="deleteOne"
                           @select="addQuery"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest"
                 @listScroll="blurInput">
        </suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import SearchList from 'base/search-list/search-list'
  import TopTip from 'base/top-tip/top-tip'
  import Suggest from 'components/suggest/suggest'
  import {searchMixin} from 'common/js/mixin'
  import {mapGetters, mapActions} from 'vuex'
  import Song from 'common/js/song'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
    methods: {
//      控制组件显示
      show() {
        this.showFlag = true
//        显示时需要将scroll刷新，否则无法滑动
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
//      控制组件隐藏
      hide() {
        this.showFlag = false
      },
//      监听select并用于调用保存其历史
      selectSuggest() {
        this.saveSearch()
        this.showTip()
      },
//      最近播放和搜索历史的切换
      switchItem(index) {
        this.currentIndex = index
      },
//      当点击最近播放列表的歌曲时，将其加到播放列表
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.showTip()
        }
      },
//      显示歌曲加入播放队列的提示框
      showTip() {
        this.$refs.topTip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 0.44rem
      text-align: center
      .title
        line-height: 0.44rem
        font-size: $font-size-large
        color: $color-theme
      .close
        position: absolute
        top: 0
        right: 0.08rem
        .icon-close
          display: block
          padding: 0.12rem
          font-size: 0.2rem
          color: $color-theme
    .search-box-wrapper
      margin: 0.2rem
    .shortcut
      .list-wrapper
        position: absolute
        top: 1.65rem
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 0.2rem 0.3rem
    .search-result
      position: fixed
      top: 1.24rem
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 0.18rem 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 0.04rem
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
