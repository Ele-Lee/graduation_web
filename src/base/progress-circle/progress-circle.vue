<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1"
         xmlns="https://www.w3.org/2000/svg">
      <circle class="progress-background" r="51" cx="51" cy="50"
              fill="transparent">
      </circle>
      <circle class="progress-bar" r="51" cy="50" cx="51"
              fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset">
      </circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset() {
        return this.dashArray * (1 - this.percent)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 0.08rem
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        // stroke: $color-theme
        stroke: green
</style>
