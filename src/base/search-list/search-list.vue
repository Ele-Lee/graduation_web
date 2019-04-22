<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searches" @click="selectItem(item)" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-no"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
//      派发事件，用于点击搜索历史的数据，将其填进搜索框
      selectItem(item) {
        this.$emit('select', item)
      },
//      触发删除一条历史记录
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 0.4rem
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        font-size: $font-size-medium-x
        color: $color-text-d
      .icon
        extend-click()
        .icon-no
          font-size: $font-size-small
          color: $color-text-d
</style>
