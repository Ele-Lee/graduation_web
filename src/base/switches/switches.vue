<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, index) in switches" :key="index"
        :class="{'active': currentIndex === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 64%
    height auto
    margin: 0 auto
    border: 0.01rem solid $color-theme
    border-radius: 0.05rem
    .switch-item
      flex: 1
      padding: 0.06rem 0
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-theme
        color: $color-text
</style>
