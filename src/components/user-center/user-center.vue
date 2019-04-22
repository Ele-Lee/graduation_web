<template>
  <transition name="pop-right">
    <div class="user-center">
      <div class="user-center__main">
        <header class="main__header">
          <div class="back">
            <div class="icon-back" @click="emitHideEvent"></div>
          </div>
          <ul class="switches-wrapper" @click="switchItem($event)" ref="switchesWrapper">
            <!-- <switches @switch="switchItem" -->
            <!-- :switches="switches" :currentIndex="currentIndex"></switches> -->
            <li :class="currentIndex === 0 ? 'switches--active' : ''"><span>{{ switches[0].name }}</span></li>
            <li :class="currentIndex === 1 ? 'switches--active' : ''"><span>{{ switches[1].name }}</span></li>
          </ul>
        </header>
        <div class="play-btn" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
        <div class="list-wrapper" ref="listWrapper">
          <!-- <transition-group name="list-box"> -->
            <scroll ref="favoriteList" class="list-scroll list-scroll-1" v-if="favoriteList"
                :data="favoriteList">
              <div class="list-inner">
                <song-list :songs="favoriteList" @select="selectSong"></song-list>
              </div>
            </scroll>
            <scroll ref="playList" class="list-scroll list-scroll-2" :data="playHistory" v-if="playHistory">
              <div class="list-inner">
                <song-list :songs="playHistory" @select="selectSong"></song-list>
              </div>
            </scroll>
          <!-- </transition-group> -->
        </div>
        <div class="borderB"></div>
      </div>
      <div class="right-hide-box" @click.stop="emitHideEvent"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import NoResult from 'base/no-result/no-result'
  import Song from 'common/js/song'
  import {mapGetters, mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        currentIndex: 0,
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ]
      }
    },
    mounted() {
      // alert(this.currentIndex)
      // console.log(this.$refs.playList)
      setTimeout(() => {
        this.srcollRefresh()
      }, 1000)
    },
    computed: {
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      noResultDesc() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      srcollRefresh() {
        this.$refs.favoriteList.refresh()
        this.$refs.playList.refresh()
      },
      emitHideEvent() {
        this.$emit('hideUser')
      },
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '0.6rem' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem(event) {
        // let e = this.$refs['switchesWrapper']
        this.srcollRefresh()
        let clickIndex = event.target.innerHTML
        this.currentIndex = clickIndex === '我喜欢的' ? 0 : 1
        // this.currentIndex = index
        // console.log(this.currentIndex)
        this.$refs.listWrapper.style.top = (20 + this.currentIndex * -100).toString() + '%'
        // this.$refs['favoriteList'].left = this.currentIndex (100 * this.currentIndex)
        // this.$refs['playList'].left = (100 * this.currentIndex)
      },
      selectSong(song) {
        this.insertSong(new Song(song))
      },
      back() {
        this.$router.back()
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
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

  .pop-right-enter-active, .pop-right-leave-active
      transition: all 0.6s
  .pop-right-enter, .pop-right-leave-to
      transform: translate3d(-100%, 0, 0)

  .user-center
    position: fixed
    width: 100%
    top: 0
    bottom: 0
    // background rgba(0,0,0,0.6)
    // &.slide-enter-active, &.slide-leave-active
    //   transition: all 0.3s
    // &.slide-enter
    //   transform: translate3d(50%, 0, 0)
    // &.slide-leave-to
    //   transform: translate3d(100%, 0, 0)
    z-index -1

    .right-hide-box
      width 25%
      height: 100%
      float right

    .user-center__main
      position relative
      float left
      width: 75%
      height: 100%
      background: $color-background
      opacity: 1
      z-index: 999
      .borderB
        position: absolute;
        bottom: 0.2rem;
        left: 15%;
        width: 70%;
        height: 0.05rem;
        background: #ee7600;
        border-radius: 0.1rem;
        opacity: 0.8;
      .main__header
        position relative
        margin: 0.2rem 0 0 0
        display: flex
        // justify-content: center
        align-items center
        z-index 999
        .back
          flex: 0
          .icon-back
            display: block
            padding: 0.1rem
            padding-right 0
            margin-left 0.1rem
            font-size: $font-size-large-x
            color: $color-theme
        .switches-wrapper
          display flex
          flex: 2
          line-height 0.2rem
          text-align center
          li
            flex 1
            font-size 0.16rem
            color: #fff;
            text-shadow: -0 -0 0.2em $color-theme;
            // text-shadow: 0.01rem 0.02rem 0.03rem rgba(67,8,7,0.8);
          .switches--active
            color: $color-theme;

      .play-btn
        position: absolute;
        left: 25%;
        box-sizing: border-box
        width: 1.35rem
        padding-top: 0.07rem
        margin: 0 auto
        text-align: center
        // border: 0.01rem solid  $color-text-l
        // color: $color-text-l
        border-radius: 1.0rem
        font-size: 0
        z-index 999
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
        top: 1.01rem
        bottom: 0
        width: 100%
        height 200%
        left 0
        transition all 0.5s
        // overflow hidden
        .list-scroll
          overflow: hidden
          position absolute
          // height 40%
          height 4.5rem
          width 100%
          left 0
          &-1
            top 0
          &-2
            top 50%
          .list-inner
            padding: 0 0.3rem 0.1rem
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
