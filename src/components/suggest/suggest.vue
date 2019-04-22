<template>
  <scroll class="suggest"
          :data="result"
          :pullUp="pullUp"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" @click="selectItem(item)" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullUp: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
//      刷新滚动插件scroll
      refresh() {
        this.$refs.suggest.refresh()
      },
//      获取图标的样式
      getIconClass(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
//      获取内容
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
//      获取搜索歌曲列表数据
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
//            赋值
            this.result = this._genResult(res.data)
//            调用是否有更多数据加载的函数
            this._checkMore(res.data)
          }
        })
      },
//      当滚动条滚动到底部时，加载更多数据
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
//            对新返回的数据进行拼接到原来数组
            this.result = this.result.concat(this._genResult(res.data))
//            调用是否有更多数据加载的函数
            this._checkMore(res.data)
          }
        })
      },
//      当子组件滚动条滚动时，触发事件继续将其派发出去，通知其他组件作出相应变化
      listScroll() {
        this.$emit('listScroll')
      },
//      选择歌手或者歌曲详情页
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
//        当选择搜索结果时，派发出select事件，用于保存历史
        this.$emit('select')
      },
//      检查是否有更多数据加载的函数
      _checkMore(data) {
        const song = data.song
        if (!song.list.length && (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
//      整理返回数据，将其改造成我们所需数据
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
//      整理数据
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
//      当query值发生改变，我们的suggest-list也要更新
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 0.3rem
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 0.2rem
        .icon
          flex: 0 0 0.3rem
          width: 0.3rem
          [class^="icon-"]
            font-size: 0.14rem
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()

    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
