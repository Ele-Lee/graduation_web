<template>
  <div class="volume-box" :class="volumeIcon" @click="tiggleVolume">
    <div class="volume-bar__box" v-show="showVolume">
      <div class="volume-bar" ref="progressBar">
        <div class="volume-bar__main">
          <div class="volume-bar__cover" ref="progress"></div>
          <div class="volume-bar__btn-box" ref="progressBtn" @touchstart.prevent="progressTouchStart"
              @touchmove.prevent="progressTouchMove"
              @touchend.prevent="progressTouchEnd">
            <div class="volume-bar__btn"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import {prefixStyle} from 'common/js/dom'

  const progressBtnHeight = 9
  // const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        volumePercent: 0.5,
        showVolume: false
      }
    },
    watch: {
      // percent(newPercent) {
      //   if (newPercent >= 0 && !this.touch.initiated) {
      //     const barHeight = this.$refs.progressBar.clientHeight - progressBtnHeight
      //     const offsetHeight = newPercent * barHeight
      //     this._offset(offsetHeight)
      //   }
      // }
    },
    created() {
      this.touch = {}
    },
    computed: {
      volumeIcon() {
        if (this.volumePercent === 0) {
          return 'icon-volume-mute2'
        } else if (this.volumePercent < 0.3) {
          return 'icon-volume-low'
        } else if (this.volumePercent === 0.3 || this.volumePercent < 0.7) {
          return 'icon-volume-medium'
        } else {
          return 'icon-volume-high'
        }
      }
    },
    methods: {
      tiggleVolume() {
        this.showVolume = !this.showVolume
      },
      progressTouchStart(e) {
//        是否进行进度拖动
        this.touch.initiated = true
//        初始触摸位置
        this.touch.startY = e.touches[0].pageY
//        进度条的初始位置
        this.touch.bottom = this.$refs.progress.clientHeight
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
//        触摸拉动的偏移量
        const deltaY = e.touches[0].pageY - this.touch.startY
        // console.log(deltaY)
//        计算进度条的应在位置，不能超过进度条的长度
        const barHeight = this.$refs.progressBar.clientHeight - progressBtnHeight
        // deltaY - barHeight ?
        const offsetHeight = Math.min(barHeight, Math.max(-9, this.touch.bottom + deltaY))
        // console.log(offsetHeight)
        // const offsetHeight = Math.min(barHeight, deltaY)
        this._offset(offsetHeight)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      //      派发事件通过百分比告诉父组件音乐播放的进度
      _triggerPercent() {
        const barHeight = this.$refs.progressBar.clientHeight - progressBtnHeight
        const _percent = this.$refs.progress.clientHeight / barHeight
        this.volumePercent = (1 - _percent).toFixed(2)
        if (this.volumePercent < 0) {
          this.volumePercent = 0
        }
        this.$emit('volumeChange', this.volumePercent)
      },
//      让进度条和按钮移动的函数
      _offset(offsetHeight) {
        this.$refs.progress.style.height = `${offsetHeight + 9}px`
        // console.log(offsetHeight)
        // this.$refs.progressBtn.style[transform] = `translate3d(0, ${offsetHeight}px, 0)`
        // console.log(this.$refs.progressBtn.style)
        this.$refs.progressBtn.style.top = `${offsetHeight}px`
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .volume-box
    position relative
    .volume-bar__box
      // position absolute
    .volume-bar
      position absolute
      top -420%
      left: 0.08rem;
      height: 0.8rem
      width: 0.18rem
      display flex
      flex-direction column-reverse
      z-index 200
      .volume-bar__main
        margin: auto;
        position: relative;
        height: 0.8rem;
        width: 0.05rem;
        border-radius 0.08rem
        // background $color-background-t
        background $color-theme
        box-shadow 0 -0.02rem 0.08rem $color-text-ll
      .volume-bar__cover
        position: absolute;
        top: 0;
        width: 100%;
        height 50%
        border-radius: 0.08rem
        // background $color-theme
        background $color-background-t
      .volume-bar__btn-box
        position: absolute;
        left: -0.07rem;
        // left: -0.075rem;
        top: 0.31rem;
        width: 0.18rem;
        height: 0.18rem;
        display: flex;
        .volume-bar__btn
          box-shadow: 0 0px 0.1rem 0.03rem #ee7600;
          margin: auto;
          width 0.1rem
          height 0.1rem
          border-radius 50%
          background #fff
          display: inline-block
</style>
