<template>
  <transition name="slide">
    <div class="login-wrapper">
      <div class="back-box-wrapper">
        <back-box :title="title"></back-box>
      </div>
      <div class="header">
        <img src="../../common/image/head.jpg" alt="">
      </div>
      <div class="login-box" id="app" >
          <el-row>
            <el-col :span="20" :offset="2">
              <el-input id="name"  v-model="name" placeholder="请输入帐号">
                <template slot="prepend">帐号</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="2">
              <el-input id="password" v-model="password" type="password" placeholder="请输入密码">
                <template slot="prepend">密码</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="4">
              <el-button id="login" @click="check" style="width:100%" type="primary" size="small">登录</el-button>
            </el-col>
            <el-col :span="6" :offset="4">
              <el-button id="register" @click="register" style="width:100%" type="info" size="small">注册</el-button>
            </el-col>
          </el-row>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BackBox from 'base/back-box/back-box'

  export default {
    data() {
      return {
        title: '登录',
        name: '',
        password: ''
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
//      检查登录信息
      check() {
        let name = this.name
        let password = this.password
        if (name === '' || password === '') {
          this.$message({
            message: '账号或密码为空！',
            type: 'error'
          })
          return
        }
        alert('登录成功')
      },
      register() {
        this.$router.push({
          path: '/register'
        })
      }
    },
    components: {
      BackBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .login-wrapper
    position: fixed
    width: 100%
    top: 44px
    bottom: 0
    z-index: 181
    background: $color-background
    background-size: 100% auto
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
      /*opacity: 0*/
    .header
      position: absolute
      top: 100px
      left: 40%
      width: 75px
      height: 75px
      img
        width: 100%
        height: 100%
        border-radius: 50%
    .login-box
      position: absolute
      top: 220px
      display: block
      text-align: center
      margin: 0 auto
      width: 100%
      height: 300px
      .el-row
        margin-bottom: 30px
        &:last-child
          margin-bottom: 0
</style>

