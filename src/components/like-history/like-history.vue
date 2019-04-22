<template>
  <transition name="slide">
    <div class="like-history">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="likeHistory" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <p class="text">随机播放全部</p>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" v-if="likeHistory===0"
                :data="favoriteList" ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-if="likeHistory===1" :data="playHistory"
                ref="playList" :refreshDelay="refreshDelay">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import NoResult from 'base/no-result/no-result'
  import Song from 'common/js/song'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        switches: [
          {name: '我喜欢的'},
          {name: '最近播放'}
        ],
        refreshDelay: 100
      }
    },
    computed: {
//      我喜欢的和最近播放的选取
//      计算是否显示没有数据的时候
      noResult() {
        if (this.likeHistory === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
//      没数据时显示的内容
      noResultDesc() {
        if (this.likeHistory === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory',
        'likeHistory'
      ])
    },
    methods: {
      //    解决播放列表有歌曲时mini占据的60px会遮挡scroll滚动内容的问题
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom

        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
//      最近播放和搜索历史的切换
      switchItem(index) {
        this.setLikeHistory(index)
      },
//      返回到上一级路由
      back() {
        this.$router.back()
      },
//      随机播放
      random() {
        let list = this.likeHistory === 0 ? this.favoriteList : this.playHistory

        if (list.length === 0) {
          return
        }
        list = list.map((song) => {
          return new Song(song)
        })
        this.randomPlay({
          list
        })
      },
//      当点击歌曲列表的回调函数
      selectSong(song) {
        this.insertSong(new Song(song))
      },
      ...mapMutations({
        setLikeHistory: 'SET_LIKE_HISTORY'
      }),
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .like-history
    position: fixed
    width: 100%
    top: 0.44rem
    bottom: 0
    z-index: 179
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    /*opacity: 0*/
    .back
      position: absolute
      top: 0.1rem
      left: 0.06rem
      z-index: 50
      .icon-back
        display: block
        padding: 0.1rem
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 0.15rem 0 0.3rem 0
    .play-btn
      box-sizing: border-box
      width: 10.35rem
      padding: 0.07rem 0
      margin: 0 auto
      text-align: center
      border: 0.01rem solid $color-theme
      color: $color-theme
      border-radius: 1.0rem
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 0.06rem
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 1.2rem
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 0.2rem 0.3rem
    .no-result-wrapper
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
</style>

