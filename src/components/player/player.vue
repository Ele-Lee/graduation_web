<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" ref="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine"
                   v-for="(line, index) in currentLyric.lines" :key="index"
                   :class="{'current': currentLineNum === index}">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
            <!-- <i   icon-volume-medium"></i> -->
            <volume-box class="icon" @volumeChange="changeVolume"></volume-box>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)"
                 @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlaying" >
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio :src="currentSong.url" ref="audio"
           @play="ready" @error="error"
           @timeupdate="updateTime" @ended="end">
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import animations from 'create-keyframe-animation'
  import VolumeBox from 'base/volume-box/volume-box'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'
  import {prefixStyle} from 'common/js/dom'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'
  import Lyric from 'lyric-parser'
  import {mapGetters, mapMutations, mapActions} from 'vuex'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    created() {
//      用来存储的滑动的状态,转换cd与lyric
      this.touch = {}
    },
    mounted() {
      this.$refs['audio'].volume = 0.5
      // setTimeout(() => {
      //   this.$refs.audio.play()
      // }, 1000)
    },
    computed: {
//      改变播放暂停图标
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
//      如上,缩小后的播放暂停
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
//      设置cd图片旋转
      cdClass() {
        return this.playing ? 'play' : 'pause'
      },
//      当歌曲状态加载失败时，禁用前进后退功能
      disableClass() {
        return this.songReady ? '' : 'disable'
      },
//      计算歌曲播放的进度比例
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex'
      ])
    },
    methods: {
      changeVolume(volume) {
        const _volume = volume < 0 ? 0 : volume
        this.$refs['audio'].volume = _volume
      },
//      normal与mini之间的切换
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
//      上一首下一首的切换
      next() {
        if (!this.songReady) {
          return
        }
//        特殊的情况，歌曲只有一首的时候，需要将其循环播放
        if (this.playList.length === 1) {
          this.loop()
//          可以直接return掉，不用修改songReady的值
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      prev() {
        if (!this.songReady) {
          return
        }
        //        特殊的情况，歌曲只有一首的时候，需要将其循环播放
        if (this.playList.length === 1) {
          this.loop()
//          可以直接return掉，不用修改songReady的值
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
//      歌曲播放完毕后的回调函数
      end() {
//        判断当前模式是否为循环播放模式
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
//      循环播放的函数
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
//        循环播放时，播放完一遍需要将歌词滚动回开始处
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
//      检查歌曲的加载情况
      ready() {
        this.songReady = true
//        当歌曲加载完成并可以播放时，我们也将起放进播放历史中
        this.savePlayHistory(this.currentSong)
      },
//      当无法加载歌曲报错时，还是需要需要更改加载状态，否则前进后退更能无法使用
      error() {
        this.songReady = true
      },
//      歌曲时间进度条
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
//      子组件滑动更新歌曲进度
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
//        判断歌曲状态是否为播放，否则改为播放状态
        if (!this.playing) {
          this.togglePlaying()
        }
//        改变歌曲进度的同时，也需要将歌词同步
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
//      获取歌词
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
//          判断当前歌曲与歌词是否匹配
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = '暂无歌词'
          this.currentLineNum = 0
        })
      },
//      获取歌词后的回调函数
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
//      中间cd和lyric之间触摸滑动转换的函数
//      监听点击事件调用playlist的显示
      showPlaylist() {
        this.$refs.playlist.show()
      },
//      记录第一次滑动的坐标x与y
      middleTouchStart(e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
//        获取滑动的偏移量
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
//        当上下滑动比左右滑动距离大时，不做处理，因为可能在滑动歌词
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
//        当currentShow为cd时，偏移量最为0，否则为屏幕宽度
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
//        计算向左偏移量
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
//        取偏移量占屏幕的比例，方便下面进行是否转换
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
//        歌词偏移动画
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
//        动画时间
        this.$refs.lyricList.$el.style[transitionDuration] = 0
//        设置cd的透明度
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
//        当currentShow为cd时，歌词向左偏移超过10%，进行转换,刚好将其偏移一个屏幕宽度，反之亦然
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
//      中间cd的动画钩子
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
//      改变歌曲播放状态，同时也需要将歌词滚动停掉
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
//        改变播放转态，歌词滚动随之改变
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      //      格式化时间
      format(interval) {
        interval = interval | 0
        const minute = this._pad(interval / 60 | 0)
        const second = this._pad(interval % 60 | 0)
        return `${minute}:${second}`
      },
//      补位（补零）
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
//      观察播放歌曲的变化，实时进行改变
      currentSong(newSong, oldSong) {
//      播放列表没有歌曲时直接return掉
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
//        获取新的歌词时，需要将旧的清空掉
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
//        这种方法微信可能无法执行,可以改用setTimeout的方式
//        this.$nextTick(() => {
//          this.$refs.audio.play()
//          this.getLyric()
//        })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
//      改变播放歌曲播放的状态
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist,
      VolumeBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      z-index: 201
      background: #222
      .background
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(0.2rem)
      .top
        position: relative
        margin-bottom: 0.25rem
        .back
          position: absolute
          top: 0
          left: 0.06rem
          z-index: 50
          .icon-back
            display: block
            padding: 0.09rem
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 0.4rem
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 0.2rem
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 0.8rem
        bottom: 1.7rem
        white-space: nowrap
        font-size: 0
        overflow: hidden
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 12.5%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 95%
              height: 95%
              box-sizing: border-box
              border: 0.1rem solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              animation: rotate 20s linear infinite
              &.play
                animation-play-state: running
                -webkit-animation-play-state: running
              &.pause
                animation-play-state: paused
                -webkit-animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 0.3rem auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 0.2rem
              line-height: 0.2rem
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 0.32rem
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 0.4rem
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 0.04rem
            width: 0.08rem
            height: 0.08rem
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 0.2rem
              border-radius: 0.05rem
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 0.1rem 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 0.3rem
            line-height: 0.3rem
            width: 0.3rem
            &.time-l
              margin-left: -0.06rem
              padding-right: 0.06rem
              text-align: left
            &.time-r
              margin-right: -0.06rem
              padding-left: 0.06rem
              text-align: right
          .progress-bar-wrapper
            flex: 1
          .icon
            font-size: 0.2rem;
            padding-left: 0.1rem;
            margin-right: -0.1rem;
        .operators
          display: flex
          // justify-content space-around
          align-items: center
          // line-height 3.5
          .icon
            // display inline-block
            // vertical-align middle
            font-size 0.16rem
            // width: 0.4rem
            // height: 0.4rem
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              // font-size: 30px
              font-size: 0.3rem
          .i-left
            text-align: right
          .i-center
            padding: 0 0.2rem
            text-align: center
            i
              // padding-left:
              font-size: 0.4rem
          .i-right
            text-align: left
          .icon-like
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -10.0rem, 0)
        .bottom
          transform: translate3d(0, 10.0rem, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 0.5rem
      background: $color-theme
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        // flex: 0 0 0.4rem
        width: 0.4rem
        padding: 0 0.1rem 0 0.2rem
        img
          display block
          border-radius: 50%
          animation: rotate 10s linear infinite
          &.play
            animation-play-state: running
            -webkit-animation-play-state: running
          &.pause
            animation-play-state: paused
            -webkit-animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 0.2rem
        overflow: hidden
        .name
          margin-bottom: 0.02rem
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text
      .control
        flex: 0 0 0.3rem
        width: 0.3rem
        // height: 0.3rem
        // width: 30px
        // height: 30px
        padding: 0 0.1rem
        .icon-play-mini, .icon-pause-mini
          font-size: 0.32rem
          color: $color-text
        .icon-playlist
          font-size: 0.29rem
          color: $color-text
        .icon-mini
          // font-size: 0.32rem
          font-size: 32px
          position: absolute
          // left: 50%
          left 0
          top: 0
          z-index -1
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
