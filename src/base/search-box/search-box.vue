<template>
  <div class="search-box">
    <i class="icon-Search"></i>
    <input class="box" v-model="query" :placeholder="placeholder" ref="query">
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌手、歌曲'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
//      清空搜索栏
      clear() {
        this.query = ''
      },
//      专门修改搜索框的值的方法
      setQuery(query) {
        this.query = query
      },
//      失去焦点的方法
      blur() {
        this.$refs.query.blur()
      }
    },
//    为什么不用watch，后面再说(节流)
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 0.06rem
    height: 0.34rem;
    background: $color-highlight-background
    border-radius: 0.06rem
    .icon-Search
      font-size: 0.24rem
      color: $color-background-t
    .box
      flex: 1
      margin: 0 0.05rem
      line-height: 0.18rem
      background: $color-highlight-background
      color: $color-text-d
      font-size: $font-size-small
      &::placeholder
        color: $color-text-dddd
    .icon-dismiss
      font-size: 0.16rem
      color: $color-background-t
</style>
