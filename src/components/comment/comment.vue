<template>
  <transition name="slide">
    <div class="comment">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">我的留言</h1>
      </div>
      <div class="content" ref="comment">
        <scroll class="comment-content" :data="commentList" ref="commentContent">
          <div class="container">
            <div class="top">
              <div class="img">
                <img src="../../common/image/bg2.jpg" alt="">
              </div>
              <div class="mine">
                <p class="name">匆匆</p>
                <img src="../../common/image/default.png" alt="">
              </div>
            </div>
            <div class="bottom">
              <ul class="comment-list">
                <li class="item" v-for="(item,index) in commentList" :key="index">
                  <div class="time">
                    <span class="day">{{item.time | filterDay}}</span>
                    <span class="month">{{item.time | filterMonth}}月</span>
                  </div>
                  <div class="content-wrapper">
                    <div class="img" v-show="item.img.length">
                      <img :src="item.img" alt="">
                    </div>
                    <div class="main" :class="{'mask': !item.img.length}">
                      {{item.content}}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        commentList: [
          {
            cid: '0',
            uid: '0',
            name: '匆匆',
            content: '分享一块像椰丝方糕的云！~',
            time: '2018-01-11 12:53:00',
            img: ''
          },
          {
            cid: '1',
            uid: '1',
            name: '匆匆',
            content: '微信游戏跳一跳，跳出了很多感悟！',
            time: '2018-01-09 12:53:00',
            img: require('../../common/image/default.png')
          },
          {
            cid: '2',
            uid: '2',
            name: '匆匆',
            content: '突然想去坐坐绿皮火车！~',
            time: '2018-01-07 12:53:00',
            img: ''
          },
          {
            cid: '3',
            uid: '3',
            name: '匆匆',
            content: '我们这次表演的歌曲是《爱》！~',
            time: '2018-01-05 12:53:00',
            img: require('../../common/image/default.png')
          },
          {
            cid: '3',
            uid: '3',
            name: '匆匆',
            content: '我们这次表演的歌曲是《爱》！~',
            time: '2018-01-05 12:53:00',
            img: ''
          },
          {
            cid: '3',
            uid: '3',
            name: '匆匆',
            content: '我们这次表演的歌曲是《爱》！~',
            time: '2018-01-05 12:53:00',
            img: require('../../common/image/default.png')
          }
        ]
      }
    },
    filters: {
//      过滤时间的日
      filterDay(str) {
        return str.split('-')[1]
      },
      filterMonth(str) {
        str = str.split('-')[2]
        return str.split(' ')[0]
      }
    },
    methods: {
//    解决有mini播放器的时候，需要将其bottom进行修改
      handlePlayList(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.comment.style.bottom = bottom
        this.$refs.commentContent.refresh()
      },
//    返回到上一级路由
      back() {
        this.$router.back()
      },
      filter(time) {
        var date = new Date(time)
        var year = date.getFullYear()
        var month = date.getMonth()
        var minute = date.getMinutes()
        var hour = date.getHours()
        var second = date.getSeconds()
        var day = date.getDate()
        console.log(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second)
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .comment
    position: fixed
    width: 100%
    top: 0.44rem
    bottom: 0
    z-index: 179
    overflow: hidden
    background: $color-highlight-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
      /*opacity: 0*/
    .header
      position: relative
      height: 0.44rem
      width: 100%
      text-align: center
      z-index: 180
      background-color $color-highlight-background
      .back
        position: absolute
        top: 0.01rem
        left: 0.06rem
        z-index: 50
        .icon-back
          display: block
          padding: 0.1rem
          font-size: $font-size-large-x
          color: $color-theme
      .title
        height: 0.44rem
        line-height: 0.44rem
        font-size: 0.18rem
        color: $color-text-d
    .content
      position: absolute
      top: 0.44rem
      bottom: 0
      width: 100%
      .comment-content
        width: 100%
        height: 100%
        overflow: hidden
        .container
          background: $color-highlight-background
          .top
            position: relative
            width: 100%
            height: 30.0rem
            .img
              width: 100%
              height: 2.8rem
              img
                width: 100%
                height: 100%
            .mine
              display: flex
              position: absolute
              bottom: 0
              right: 0.15rem
              width: 1.3rem
              height: 0.8rem
              .name
                height: 0.8rem
                line-height: 0.8rem
                color: $color-text
                padding-right: 0.18rem
              img
                width: 0.8rem
                height: 0.8rem
          .bottom
            width: 100%
            color: $color-text-d
            .comment-list
              padding: 0.2rem 0.1rem
              .item
                display: flex
                margin-bottom: 0.2rem
                padding: 0.05rem 0
                img
                  width: 100%
                  height: 100%
                .time
                  flex: 0 0 0.6rem
                  width: 0.6rem
                  .day
                    font-size: 0.2rem
                    font-weight: bold
                  .month
                    font-size: 0.12rem
                .content-wrapper
                  flex: 1
                  padding-left: 0.1rem
                  display: flex
                  overflow: hidden
                  .img
                    flex: 0 0 0.8rem
                    width: 0.8rem
                    height: 0.8rem
                  .main
                    flex: 1
                    padding: 0.05rem
                    display: -webkit-box
                    -webkit-box-orient: vertical
                    -webkit-line-clamp: 3
                    overflow: hidden
                    text-overflow: ellipsis
                  .mask
                    background: $color-background
</style>

