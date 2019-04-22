<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="topList">
      <ul>
        <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
          <!-- <div class="icon"> -->
          <img width="55" height="55" v-lazy="item.picUrl">
          <!-- </div> -->
          <div class="songlist">
            <h1 class="song">{{item.topTitle}}</h1>
          </div>
          <span class="enter"><i class="icon-chevron-right"></i></span>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
//      解决有mini播放器的时候，需要将其bottom进行修改
      handlePlayList(playList) {
        const bottom = playList.length ? '60px' : ''
        // this.$refs.rank.style.bottom = bottom
        if (!bottom || this.tag) {
          const node = document.getElementById('nodeT')
          this.$refs.rank.removeChild(node)
          return
        } else {
          this.tag = '1'
          const node = document.createElement('div')
          node.id = 'nodeT'
          node.style.cssText = 'height:50px;width:100%;flex:1 0 auto'
          this.$refs.rank.appendChild(node)
          this.$refs.scroll.refresh()
        }
      },
//      获取排行榜数据
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    // position: fixed
    width: 100%
    height: calc(100vh - 0.44rem)
    // top: 0.44rem
    // bottom: 0
    display flex
    display -webkit-flex
    flex-direction: column;
    -webkit-flex-direction: column;
    background: $color-highlight-background
    .toplist
      flex:1 1 auto;
      -webkit-flex:1 1 auto;
      height: 100%
      overflow: hidden
      .item
        display: flex
        padding: 0.15rem
        height: 0.50rem
        align-items: center
        border-bottom: 0.01rem solid #e0e0e0
        .icon
          flex: 0 0 0.55rem
          width: 0.55rem
          height: 0.55rem
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 0.15rem
          height: 0.50rem
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-dddd
          font-size: $font-size-small
          .song
            no-wrap()
            font-size: 0.16rem
            line-height: 0.50rem
        .enter
          display: flex
          align-items: center
          justify-content: center
          .icon-chevron-right
            font-size: 0.28rem
            color: gray
            font-weight: 100
      .loading-container
        position: absolute
        top: 50%
        width: 100%
        transform: translateY(-50%)
</style>
