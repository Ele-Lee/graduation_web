<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
//        是否进行进度拖动
        this.touch.initiated = true
//        初始触摸位置
        this.touch.startX = e.touches[0].pageX
//        进度条的初始位置
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
//        触摸拉动的偏移量
        const deltaX = e.touches[0].pageX - this.touch.startX
//        计算进度条的应在位置，不能超过进度条的长度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
        console.log(offsetWidth)
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
//      派发事件通过百分比告诉父组件音乐播放的进度
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
//      点击事件告诉父组件进度条的点击位置，直接获取点击事件的偏移量
      progressClick(e) {
//        其他的获取方法
//        const rect = this.$refs.progressBar.getBoundingClientRect()
//        const offsetWidth = e.pageX - rect.left - progressBtnWidth / 2
//        this._offset(offsetWidth)
        this._offset(e.offsetX - progressBtnWidth / 2)
        this._triggerPercent()
      },
//      让进度条和按钮移动的函数
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 0.3rem
    .bar-inner
      position: relative
      top: 0.13rem
      height: 0.04rem
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        border-radius: 0.04rem
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -0.08rem
        top: -0.13rem
        width: 0.3rem
        height: 0.3rem
        .progress-btn
          position: relative
          top: 0.07rem
          left: 0.07rem
          box-sizing: border-box
          width: 0.16rem
          height: 0.16rem
          border: 0.03rem solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
