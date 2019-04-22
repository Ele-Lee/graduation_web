<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent"
                :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li class="item" v-for="(item, index) in sequenceList" :key="item.id"
                @click="selectItem(item, index)" ref="listItem">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-no"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空"
               @confirm="confirmClear">
      </confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import AddSong from 'components/add-song/add-song'
  import {mapActions} from 'vuex'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        refreshDelay: 100
      }
    },
    computed: {
//      该文字随着播放模式改变而改变
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放'
          : this.mode === playMode.loop ? '单曲循环' : '随机播放'
      }
    },
    methods: {
//      显示
      show() {
        this.showFlag = true
//        同时需要将scroll重新计算高度
        setTimeout(() => {
          this.$refs.listContent.refresh()
//          初始化也要滚动到当前播放歌曲的位置
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
//      隐藏
      hide() {
        this.showFlag = false
      },
//      设置播放列表中正在播放的歌曲的样式
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
//      选择要播放的歌曲，更改正在播放的歌曲
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
//      将播放列表滚动到当前播放歌曲的位置
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return song.id === current.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
//      将该歌曲在播放列表中删除
      deleteOne(item) {
        this.deleteSong(item)
//        当没有歌曲的时候就隐藏掉
        if (!this.playList.length) {
          this.hide()
        }
      },
//      点击清空列表按钮时，弹出确认框
      showConfirm() {
        this.$refs.confirm.show()
      },
//      调用清空播放列表函数
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
//      点击添加歌曲到播放列表的回调函数
      addSong() {
        this.$refs.addSong.show()
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    },
    watch: {
//      观察歌曲的变化，实时进行滚动
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-text-dd
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 0.2rem 0.3rem 0.1rem 0.2rem
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 0.1rem
            font-size: 0.3rem
            color: $color-theme
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 2.4rem
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 0.4rem
          padding: 0 0.3rem 0 0.2rem
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s linear
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 0.2rem
            width: 0.2rem
            font-size: $font-size-small
            color: $color-theme
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 0.15rem
            font-size: $font-size-small
            color: $color-theme
            .icon-like
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 1.4rem
        margin: 0.2rem auto 0.3rem auto
        .add
          display: flex
          align-items: center
          padding: 0.08rem 0.16rem
          border: 0.01rem solid $color-theme
          border-radius: 10.0rem
          color: $color-theme
          .icon-add
            margin-right: 0.05rem
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 0.5rem
        background: $color-background-l
        font-size: $font-size-medium-x
        color: $color-text-d
</style>
