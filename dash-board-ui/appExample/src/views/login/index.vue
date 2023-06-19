<!--
 * @description: 登录页面
 * @Author: wujian
 * @Date: 2022-10-11 14:17:48
 * @LastEditors: wujian
 * @LastEditTime: 2023-06-05 17:03:43
-->
<template>
  <div>
    <div class="header">
      <span class="welcome-text">{{ welcomeText }}</span>
      <icon-svg class="login_header" name="login_header" />
    </div>
    <div class="login-wrap">
      <van-form @submit="login">
        <div class="logo-wrap">
          <icon-svg class="login_logo" name="login_logo" />
          <!-- <van-image :src="logo" /> -->
        </div>
        <van-field
          class="username"
          v-model="loginForm.username"
          name="账号"
          placeholder="请输入账号"
          :border="false"
          clearable
          :rules="[{ required: true }]"
        >
          <template #left-icon>
            <div class="left-icon">
              <icon-svg name="username" class="svg" />
            </div>
          </template>
        </van-field>
        <van-field
          class="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="密码"
          :border="false"
          clearable
          :rules="[{ required: true }]"
        >
          <template #left-icon>
            <div class="left-icon">
              <icon-svg name="password" class="svg" />
            </div>
          </template>
          <template #right-icon>
            <span class="solts" @click="passwordType = passwordType === 'password' ? 'text' : 'password'">
              <van-icon name="eye" v-if="passwordType === 'password'" />
              <van-icon name="closed-eye" v-else />
            </span>
          </template>
        </van-field>
        <van-field
          v-if="imgCaptcha.enabled"
          v-model="loginForm.captcha"
          name="验证码"
          label="验证码"
          placeholder="请输入验证码"
          left-icon="user-o"
          clearable
          :rules="[{ required: true }]"
        >
          <template #button>
            <van-image @click="getCaptcha()" :src="captchaPath" />
          </template>
        </van-field>
        <div class="login-btn">
          <van-button
            :border="false"
            loading-text="登录中..."
            :loading="loading"
            block
            type="primary"
            native-type="submit"
          >
            登录
          </van-button>
        </div>
      </van-form>
      <div class="bottom-warp">
        <div class="text">忘记密码</div>
        <div class="text">遇到问题</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Form, Field, Image as VanImage, Dialog, Icon } from 'vant'

import { getUUID, msgEncode } from '@/utils/index'
import { accountLogin } from '@/service/LoginService'
import * as tokenCacheService from '@/http/cache/tokenCacheService'
Vue.use(Icon)
Vue.use(Form)
Vue.use(Field)
Vue.use(VanImage)
export default {
  name: 'Login',
  data() {
    return {
      welcomeText: window['SITE_CONFIG'].starter.login.welcome.template,
      logo: window['SITE_CONFIG'].starter.logo.login,
      title: window.SITE_CONFIG.starter.title,
      starter: window.SITE_CONFIG.starter,
      passwordType: 'password', // 密码输入框类型
      loading: false,
      // 系统默认图形验证码
      imgCaptcha: {
        enabled: window.SITE_CONFIG.starter.login.account.captcha,
        interval: window.SITE_CONFIG.starter.login.account.interval,
        // 图像验证码上次获取时间，避免频繁获取验证码
        lastDate: undefined
      },
      // 登录表单
      loginForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      loginMethod: 'account', // 登录方式
      captchaPath: '' // 图形验证码图片地址,
      // actions: [{ name: '确定', color: '#ee0a24' }]
    }
  },
  mounted() {
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha(auto) {
      if (
        !auto &&
        this.imgCaptcha.lastDate &&
        (new Date().getTime() - this.imgCaptcha.lastDate.getTime()) / 1000 < this.imgCaptcha.interval
      ) {
        this.$message.warning('请勿频繁获取验证码')
        return
      }
      this.imgCaptcha.lastDate = new Date()
      const uuid = getUUID()
      this.loginForm.uuid = uuid
      this.captchaPath = this.$wrapUrl(`/sys/captcha?uuid=${uuid}`)
    },
    // 用户登录操作
    login() {
      this.loading = true
      // 获取UUid
      accountLogin({
        username: this.loginForm.username,
        password: msgEncode(this.loginForm.password, this.loginForm.password),
        uuid: this.loginForm.uuid,
        captcha: this.loginForm.captcha
      })
        .then(res => {
          this.loginResponseHandler(res)
        })
        .catch(() => {
          this.exceptionHandler()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 账号密码登录操作
    loginResponseHandler(res) {
      if (res.code !== 200) {
        this.$toast.fail(`${res.msg}`)
        if (this.loginMethod === 'account') {
          this.getCaptcha(true)
        }
        return
      }
      let data = res.data
      tokenCacheService.set(data.token)
      let welcome = this.starter.login.welcome
      if (welcome?.enable ?? true) {
        this.$toast.success(`${welcome?.template ?? '您好，欢迎访问千行开发框架'}`)
      }
      if (data.tip?.pwdWillExpireTip) {
        // 密码将要过期提醒
        Dialog.confirm({ title: '提示', message: data.tip.pwdWillExpireTip })
          .then(() => {
            this.$toast.fail('密码过期，请修改密码')
          })
          .catch(() => {
            this.loading = false
            // 跳转到首页
            if (window.SITE_CONFIG.starter.login.autoRedirect && this.$route.query.redirect) {
              this.$router.push(`${this.$route.query.redirect}`)
            } else {
              this.$router.push({ path: '/' })
            }
          })
      } else {
        this.$toast.success(`${welcome?.template ?? '您好，欢迎访问千行开发框架'}`)
        // 跳转到首页
        if (window.SITE_CONFIG.starter.login.autoRedirect && this.$route.query.redirect) {
          this.$router.push(`${this.$route.query.redirect}`)
        } else {
          this.$router.push({ path: '/pageManage' })
        }
      }
    },
    // 登录失败后事件
    exceptionHandler() {
      if (this.loginMethod === 'account') {
        this.getCaptcha(true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 头部背景图和欢迎语
.header {
  position: relative;
  width: 100%;
  height: 154px;
  text-align: center;
  .welcome-text {
    display: block;
    padding-top: 74px;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    color: #ffffff;
  }
  .login_header {
    scale: 1.1;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }
}
.login-wrap {
  height: 550px;
  padding: 16px;
  margin: 25px 16px 0 16px;
  background-color: #ffffff;
  .logo-wrap {
    text-align: center;
    margin-bottom: 24px;
    .login_logo {
      width: 64px;
      height: 64px;
    }
    // :deep(.van-image) {
    //   width: 64px;
    //   height: 64px;
    //   margin-top: 8px;
    // }
  }
  .username {
    height: 48px;
    margin-bottom: 24px;
    border-radius: 24px;
    background-color: #f6f7fb;
    padding: 13px 20px;
    :deep(.van-field__left-icon) {
      margin-right: 12px;
    }
    :deep(.van-field__body) {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      input::-webkit-input-placeholder {
        color: #666666;
      }
    }
  }
  .password {
    height: 48px;
    border-radius: 24px;
    background-color: #f6f7fb;
    padding: 13px 20px;
    :deep(.van-field__left-icon) {
      margin-right: 12px;
    }
    :deep(.van-field__body) {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      input::-webkit-input-placeholder {
        color: #666666;
      }
    }
  }
  .left-icon {
    height: 20px;
    line-height: 20px;
    border-right: 1px solid #e2e2e4;
    .svg {
      margin-right: 12px;
    }
  }
  .login-btn {
    width: 100%;
    display: flex;
    margin-top: 72px;
    justify-content: center;
    :deep(.van-button) {
      width: 247px;
      height: 45px;
      border-radius: 24px;
      border: unset;
      background: linear-gradient(90deg, #0380fe 0%, #03b5ff 100%);
    }
  }
}
.bottom-warp {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  .text {
    height: 20px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #0381fe;
    &:first-child {
      padding-right: 24px;
      border-right: 1px solid #e2e2e4;
    }
    &:last-child {
      margin-left: 24px;
    }
  }
}
</style>
