<template>
  <div class="singer" @touchstart="initScroll" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playListMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      initScroll() {
        this.$refs.list.$refs.listview.scroll.refresh()
      },
//    解决播放列表有歌曲时mini占据的60px会遮挡scroll滚动内容的问题
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '50px' : ''
        // this.$refs.singer.style.bottom = bottom
        if (!bottom || this.tag) {
          const node = document.getElementById('nodeT')
          this.$refs.singer.removeChild(node)
          return
        } else {
        // if (!bottom || this.tag) return
          this.tag = '1'
          const node = document.createElement('div')
          node.id = 'nodeT'
          node.style.cssText = 'height:50px;width:100%;flex:1 0 auto'
          this.$refs.singer.appendChild(node)
          this.$refs.list.refresh()
        }
      },
//      点击歌手，进入其详情页面
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
//      获取歌手列表
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list)
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
//      将获得歌手数据加工成我们需要的内容
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
//        为了得到有序列表，我们需要处理map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    // position: fixed
    // top: 43px
    // bottom: 0
    height: calc(100vh - 0.44rem)
    width: 100%
    display flex
    display -webkit-flex
    flex-direction: column;
    -webkit-flex-direction: column;
    .listview
      flex:1 1 auto;
      -webkit-flex:1 1 auto;
</style>
