<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a href="#">
                <img class="needsclick" @load="loadImage"  :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul class="recommend-list-wrapper">
            <li v-for="(item,index) in discList" :key="index" class="item" @click="selectItem(item)">
              <div class="icon">
                <img width="110" height="110" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!this.discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
    <!-- <div style="height:60px;width:100%;flex:1 0 auto"></div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default{
    mixins: [playListMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
//    解决播放列表有歌曲时mini占据的60px会遮挡scroll滚动内容的问题
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        // this.$refs.recommend.style.bottom = bottom
        if (!bottom || this.tag) {
          const node = document.getElementById('nodeT')
          this.$refs.recommend.removeChild(node)
          return
        } else {
          this.tag = '1'
          const node = document.createElement('div')
          node.id = 'nodeT'
          node.style.cssText = 'height:50px;width:100%;flex:1 0 auto'
          this.$refs.recommend.appendChild(node)
          this.$refs.scroll.refresh()
        }
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
//      点击选择热门歌单推荐
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin"

  .recommend
    // position: fixed
    height: calc(100vh - 0.44rem)
    width: 100%
    // top: 44
    // bottom: 0
    display flex
    display -webkit-flex
    flex-direction: column;
    -webkit-flex-direction: column;
    .recommend-content
      flex:1 1 auto;
      -webkit-flex:1 1 auto;
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 0.5rem
          line-height: 0.5rem
          text-align: center
          font-size: $font-size-medium-x
          color: $color-theme
        .recommend-list-wrapper
          display: flex
          flex-flow: row wrap
          .item
            width: 33.33%
            box-sizing: border-box
            align-items: center
            text-align: center
            margin-bottom: 0.2rem
            .icon
              display: inline-block
              text-align: center
            .text
              flex-direction: column
              justify-content: center
              line-height: 0.2rem
              padding: 0 0.05rem
              height: 0.6rem
              overflow: hidden
              text-overflow: ellipsis
              font-size: $font-size-medium
              .name
                margin-bottom: 0.03rem
                color: $color-text-d
                no-wrap()
              .desc
                text-align left
                font-size 0.12rem
                color: $color-text-ddd
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
    .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
