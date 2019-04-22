<template>
  <transition name="slide">
    <div class="search">
      <!-- <div class="back-box-wrapper">
        <back-box :title="title"></back-box>
      </div> -->
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
        <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li class="item"  v-for="(item,index) in hotKey" @click="addQuery(item.k)" :key="index">
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
              </h1>
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
            </div>
          </div>
        </scroll>
      </div>
      <div class="search-result" v-show="query" ref="searchResult">
        <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
      </div>
      <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"
              @confirm="deleteAll"></confirm>
      <router-view></router-view>
      <div class="signature">by liyilei</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Suggest from 'components/suggest/suggest'
  import Confirm from 'base/confirm/confirm'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapActions} from 'vuex'
  import {playListMixin, searchMixin} from 'common/js/mixin'
  import BackBox from 'base/back-box/back-box'

  export default {
    mixins: [playListMixin, searchMixin],
    data() {
      return {
        hotKey: [],
        title: '搜索'
      }
    },
    created() {
//      调用获取热搜索词数据的方法
      this._getHotKey()
    },
    computed: {
//      两个数据任意发生改变都会重新刷新scroll，使其可以滚动
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    methods: {
//    解决播放列表有歌曲时mini占据的60px会遮挡scroll滚动内容的问题
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
//      获取热搜索词数据的方法，调用数据接口
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
//    显示是否删除全部历史记录询问框
      showConfirm() {
        this.$refs.confirm.show()
      },
//      清除本地存储的搜索历史数据
      deleteAll() {
        this.clearSearchHistory()
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newQuery) {
//        如果query值没有发生改变，我们要手动刷新scroll
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll,
      BackBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    // position: fixed
    // width: 100%
    // top: 0.44rem
    // bottom: 0
    font-size $font-size-large
    // z-index: 179
    background: $color-background
    height: calc(100vh - 0.44rem)
    display flex
    display -webkit-flex
    flex-direction: column;
    -webkit-flex-direction: column;
    // background: $color-highlight-background
    .signature
      text-align right
      padding 0.2rem
      padding-right 0.3rem
      color $color-theme
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .search-box-wrapper
      margin: 0.16rem 0.2rem
      flex:0 0 auto;
      -webkit-flex:0 0 auto;
    .shortcut-wrapper
      // flex:1 1 auto;
      // -webkit-flex:1 1 auto;
      // display flex
      // position: absolute
      // top: 0.7rem
      // bottom: 0
      // width: 100%
      height: 4.6rem;
      .shortcut
        flex 1
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 0.2rem 0rem
          .title
            margin-bottom: 0.2rem
            font-size: $font-size-medium
            color: $color-theme
          ul
            display: flex;
            flex-wrap: wrap;
            .item
              display: inline-block
              padding: 0.05rem 0.1rem
              margin: 0 0.1rem 0.1rem 0
              border-radius: 0.06rem
              background: $color-text-lll
              font-size: $font-size-small
              color: $color-text-dddd
        .search-history
          position: relative
          margin: 0 0.2rem
          .title
            display: flex
            align-items: center
            height: 0.4rem
            font-size: $font-size-medium
            color: $color-theme
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-dddd
    .search-result
      position: absolute
      // top: 0.7rem
      top: 1.1rem;
      bottom: 0
      width: 100%
</style>
