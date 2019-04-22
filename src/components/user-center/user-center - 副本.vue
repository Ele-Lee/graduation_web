<template>
  <!-- <div class="user-center">
    <div class="user">
      <div class="login-wrapper">
        <div class="head-img">
          <img src="../../common/image/head.jpg" alt="">
        </div>
        <div class="register">
          <p class="log" @click="login">登录 / 注册</p>
          <span class="desc">echo音乐，随我所爱</span>
        </div>
      </div>
      <div class="tab">
        <ul class="tab-wrapper">
          <li class="item" @click="toLike">
            <i class="icon icon-not-like"></i>
            <span class="desc">我喜欢的</span>
          </li>
          <li class="item" @click="toHistory">
            <i class="icon icon-clock"></i>
            <span class="desc">最近播放</span>
          </li>
          <li class="item" @click="toComment">
            <i class="icon icon-pencil"></i>
            <span class="desc">我的留言</span>
          </li>
          <li class="item" @click="toCommunity">
            <i class="icon icon-bubble2"></i>
            <span class="desc">我的社区</span>
          </li>
        </ul>
      </div>
      <div class="fill-wrapper"></div>
    </div>
    <router-view></router-view>
  </div> -->
      <div class="user-center">
      <div class="back" @click="back">
        <div class="icon-back"></div>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem"
        :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" v-if="currentIndex===0" class="list-scroll"
            :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'

  export default {
    methods: {
      login() {
        this.$router.push({
          path: '/login'
        })
      },
      toLike() {
        this.setLikeHistory(0)
        this.$router.push({
          path: '/user/like-history'
        })
      },
      toHistory() {
        this.setLikeHistory(1)
        this.$router.push({
          path: '/user/like-history'
        })
      },
      toComment() {
        this.$router.push({
          path: '/user/comment'
        })
      },
      toCommunity() {
        this.$router.push({
          path: '/user/community'
        })
      },
      ...mapMutations({
        setLikeHistory: 'SET_LIKE_HISTORY'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 44px
    bottom: 0
    width: 100%
    z-index: 150
    background: url("../../common/image/bg4.jpg")
    /*background-size: 100% auto*/
    background-size:cover;
    .user
      height: 380px
      width: 100%
      position: fixed
      bottom: 0
      .login-wrapper
        display: flex
        width: 100%
        height: 50px
        .head-img
          flex: 0 0 70px
          width: 50px
          height: 100%
          line-height: 50px
          margin-left: 20px
          img
            width: 50px
            height: 50px
            border-radius: 50%
            line-height: 50px
            vertical-align: middle
        .register
          flex: 1
          .log
            padding: 8px
            display: block
            width: 100px
            font-size: $font-size-large
            color: $color-text
          .desc
            display: block
            width: 130px
            font-size: $font-size-medium
            color: $color-text-ll
      .tab
        position: fixed
        bottom: 110px
        height: 200px
        width: 100%
        background: $color-text-dd
        .tab-wrapper
          width: 100%
          display: flex
          flex-flow: row wrap
          .item
            flex: 0 0 44%
            width: 44%
            height 80px
            line-height: 80px
            margin: 4%  0 0 4%
            border-radius: 3px
            box-sizing: border-box
            align-items: center
            text-align: center
            background: $color-text-l
            .icon
              font-size: $font-size-large-x
              color: $color-text
            .desc
              font-size: $font-size-medium-x
              color: $color-text
      .fill-wrapper
        position: fixed
        width: 100%
        height: 110px
        background: $color-text-dd
        bottom: 0
</style>
