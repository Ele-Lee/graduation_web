<template>
  <transition name="slide">
    <div class="register-wrapper">
      <div class="back-box-wrapper">
        <back-box :title="title"></back-box>
      </div>
      <div class="form">
        <el-form :model="ruleForm" status-icon :rules="rules" size="large" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="user">
            <el-input  v-model="ruleForm.user" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio border label="男"></el-radio>
              <el-radio border label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="ruleForm.age"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input type="phone" v-model.number="ruleForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BackBox from 'base/back-box/back-box'

  export default {
    data() {
      let validateUser = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        } else {
          callback()
        }
      }
      let checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'))
        } else {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (value > 120 || value < 0) {
              callback(new Error('必须真实年龄'))
            } else {
              callback()
            }
          }
        }
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      let validatePhone = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入手机号'))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (String(value).length !== 11) {
              callback(new Error('必须真实手机号'))
            } else {
              callback()
            }
          }
        }, 500)
      }
      return {
        title: '注册',
        ruleForm: {
          user: '',
          pass: '',
          checkPass: '',
          age: '',
          sex: '男',
          phone: ''
        },
        rules: {
          user: [
            { validator: validateUser, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert(this.ruleForm.sex)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      BackBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .register-wrapper
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
    .form
      position: absolute
      top: 100px
      width: 90%
      margin: 0 auto
      .el-form
        .el-form-item
          &:first-child
            width: 300px
          &:nth-child(3)
            width: 180px
          &:last-child
            margin-left: 10px
</style>

