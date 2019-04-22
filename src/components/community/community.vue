<template>
  <transition name="slide">
    <div class="community">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">我的社区</h1>
      </div>
      <div class="content" ref="community">
        <p class="newest"><i class="icon-award"></i>最新动态</p>
        <scroll :data="communityList" class="community-content" ref="communityList">
          <ul class="communityList">
            <div class="type">
              <img src="../../common/image/music.jpg" alt="" style="width: 40px; height: 40px">
              <span class="desc">音乐</span>
              <span class="share">分享你我的快乐</span>
            </div>
            <li class="item" v-for="(item,index) in communityList" :key="index">
              <h1 class="title">{{item.title}}</h1>
              <p class="mine">
                <span class="name">{{item.name}}</span>
                <span class="saying">hahahah</span>
              </p>
              <div class="main">{{item.content}}</div>
              <div class="like">
                <span><i class="icon-thumbs-down"></i>踩</span>
                <span><i class="icon-thumbs-up"></i>赞</span>
              </div>
            </li>
          </ul>
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
        communityList: [
          {
            id: 0,
            title: '如何评价《我们不一样》这首歌的风格',
            name: '匆匆',
            content: '在一个遥远的影河系，一股黑暗势力崛起，' +
            '迪斯n米奇（Darth Mickey）即将称霸好莱坞，试图用可爱，独角兽，彩虹，欢笑等黑暗力量感染世界。' +
            '他即将成功了，这股黑暗力量让浩克脱掉了裤子，让卢克丢掉了光剑，彻底消灭了宇宙最强生物异形。',
            img: '',
            comment: [
              {
                uid: '5454',
                userName: 'cc',
                content: '楼主说的对！'
              }
            ]
          },
          {
            id: 1,
            title: '如何评价《我们不一样》这首歌的风格',
            name: '匆匆',
            content: '在一个遥远的影河系，一股黑暗势力崛起，' +
            '迪斯n米奇（Darth Mickey）即将称霸好莱坞，试图用可爱，独角兽，彩虹，欢笑等黑暗力量感染世界。' +
            '他即将成功了，这股黑暗力量让浩克脱掉了裤子，让卢克丢掉了光剑，彻底消灭了宇宙最强生物异形。',
            img: ''
          },
          {
            id: '0',
            title: '如何评价《我们不一样》这首歌的风格',
            name: '匆匆',
            content: '在一个遥远的影河系，一股黑暗势力崛起，' +
            '迪斯n米奇（Darth Mickey）即将称霸好莱坞，试图用可爱，独角兽，彩虹，欢笑等黑暗力量感染世界。' +
            '他即将成功了，这股黑暗力量让浩克脱掉了裤子，让卢克丢掉了光剑，彻底消灭了宇宙最强生物异形。',
            img: ''
          },
          {
            id: 2,
            title: '如何评价《我们不一样》这首歌的风格',
            name: '匆匆',
            content: '在一个遥远的影河系，一股黑暗势力崛起，' +
            '迪斯n米奇（Darth Mickey）即将称霸好莱坞，试图用可爱，独角兽，彩虹，欢笑等黑暗力量感染世界。' +
            '他即将成功了，这股黑暗力量让浩克脱掉了裤子，让卢克丢掉了光剑，彻底消灭了宇宙最强生物异形。',
            img: ''
          },
          {
            id: 3,
            title: '如何评价《我们不一样》这首歌的风格',
            name: '匆匆',
            content: '在一个遥远的影河系，一股黑暗势力崛起，' +
            '迪斯n米奇（Darth Mickey）即将称霸好莱坞，试图用可爱，独角兽，彩虹，欢笑等黑暗力量感染世界。' +
            '他即将成功了，这股黑暗力量让浩克脱掉了裤子，让卢克丢掉了光剑，彻底消灭了宇宙最强生物异形。',
            img: ''
          }
        ]
      }
    },
    methods: {
//    解决有mini播放器的时候，需要将其bottom进行修改
      handlePlayList(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.community.style.bottom = bottom
        this.$refs.communityList.refresh()
      },
//    返回到上一级路由
      back() {
        this.$router.back()
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

  .community
    position: fixed
    width: 100%
    top: 44px
    bottom: 0
    z-index: 179
    background: $color-highlight-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
      /*opacity: 0*/
    .header
      position: relative
      height: 44px
      width: 100%
      text-align: center
      .back
        position: absolute
        top: 1px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 10px
          font-size: $font-size-large-x
          color: $color-theme
      .title
        height: 44px
        line-height: 44px
        font-size: 18px
        color: #000
    .content
      position: absolute
      top: 44px
      bottom: 0
      padding: 10px
      color: $color-text-d
      .newest
        height 25px
        line-height 25px
        padding-bottom 5px
        font-size: 17px
        color: #666
        font-weight: bold
        border-bottom: 1px solid #ccc
        .icon-award
          margin-right: 10px
      .community-content
        width: 100%
        height: 100%
        overflow: hidden
        .communityList
          padding-top: 10px
          .type
            height: 50px
            font-size: 14px
            display: flex
            align-items: center
            .desc
              padding-left: 20px
              height: 100%
              line-height: 50px
            .share
              position: absolute
              right: 0
              color: #999
          .item
            padding: 20px 0
            border-bottom: 1px solid #ccc
            .title
              font-size: 16px
              font-weight: bold
              color: #259
            .mine
              padding: 8px 0
              .name
                color: #222
              .saying
                padding-left: 20px
                color: #999
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
            .main
              font-size: 15px
              line-height: 1.7
            .like
              text-align: right
              /*position: absolute*/
              /*right: 0*/
              span
                font-size: 14px
                color: #999
                padding-left: 10px
</style>

