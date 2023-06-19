(function (window) {
  window.SITE_CONFIG = {
    // 布局相关配置
    starter: {
      // version
      version: 'v1.0.0',
      // 网页标题和导航副标题
      title: '仪表盘',
      // 登录页面项目描述
      description: '<h5>仪表盘</h5><ul><li>仪表盘</li><li>仪表盘</li></ul>',

      // 登录设置
      login: {
        account: {
          // 是否启用
          enable: true,
          // 验证码发送间隔时间，单位秒（s）
          interval: 10,
          // 是否显示图形验证码
          captcha: false
        },
        phone: {
          enable: false,
          // 验证码发送间隔时间，单位秒（s）
          interval: 60
        },
        email: {
          enable: false,
          // 验证码发送间隔时间，单位秒（s）
          interval: 60
        },
        welcome: {
          enable: false,
          title: "欢迎",
          template: "欢迎登录仪表盘"
        },
        // 登录后是否自动跳转到指定地址
        autoRedirect: true
      },
      // 注册设置
      register: {
        // 是否显示注册按钮
        enable: false,
        account: {
          // 是否启用
          enable: true,
          // 验证码发送间隔时间，单位秒（s）
          interval: 10,
          // 是否显示图形验证码
          captcha: true
        },
        phone: {
          enable: true,
          // 验证码发送间隔时间，单位秒（s）
          interval: 60
        },
        email: {
          enable: true,
          // 验证码发送间隔时间，单位秒（s）
          interval: 60
        }
      },
      menu: {
        help: {
          url: 'https://www.yuque.com/chuinixiongkou/gc-starter/ci0en1'
        }
      },
      // 忘记密码设置
      forgotPwd: {
        enable: false,
        phone: {
          enable: true,
          // 验证码发送间隔时间，单位秒（s）
          interval: 60
        },
        email: {
          enable: true,
          // 验证码发送间隔时间，单位秒（s）
          interval: 60
        }
      },
      // Banner设置
      banner: {
        enable: true
      },

      // 租户开关
      tenant: {
        enable: true
      },

      // CAS 单点登录配置
      cas: {
        // cas开关，前后端开关需要保持一致
        enable: false,
        //cas登录地址 后端cas登录接口地址，重定向使用  后端ip:端口/应用名/cas/login
        loginUrl: 'http://127.0.0.1:8888/cas/login?service=http://127.0.0.1:8081/gc-starter-server/cas/login',
        //cas退出地址,重定向使用  cas-server外网ip:端口/logout?service=cas-server外网ip:端口/login?service=后端外网ip:端口/应用名/cas/login
        logoutUrl: 'http://127.0.0.1:8888/cas/logout?service=http://127.0.0.1:8888/cas/login?service=http://127.0.0.1:8081/gc-starter-server/cas/login'
      },

      // logo设置
      logo: {
        // 可选 svg、img
        "type": 'svg',
        svg: {
          // 深色svg名称
          darkName: 'logo_gc_dark',
          // 浅色svg名称
          lightName: 'logo_gc_light'
        },
        img: {
          // 深色img名称
          darkName: 'logo_gc_dark.png',
          // 浅色img名称
          lightName: 'logo_gc_light.png'
        }
      },
      // 布局相关
      layout: {
        // 默认主题色
        themeColor: '#007afe',
        // 右上角提示模块开关
        noticeSetting: {
          enable: true
        },
        // 右上角设置按钮开关
        layoutSetting: {
          enable: true
        },
        // 是否需要可关闭选项卡
        tab: {
          enable: true
        },
        // 底部开关以及html设置
        footer: {
          enable: true,
          copyright: '创搭平台 V1.0.0 <a href="http://www.kdgcsoft.com/" target="_blank" class="no-decoration">技术中台PBU</a> 2021  |  版权所有 © <a href="http://www.gccloud.com/" target="_blank">科大国创软件股份有限公司</a>',
        },
        // 布局类型【经典布局：classicLayout 】，【上下布局：upDownLayout】
        type: 'classicLayout',
        // 框架风格【默认主题：default】，【浅色主题：light】
        style: 'default',
        // 是否开启灰色主题 'auto':自动开启, true:强制开启, false:关闭, 针对IE浏览器，可以增加灰色参数配置 例如 grayColor:'#6D6D6F' 默认为#6D6D6F
        grayEnable: false,
        // 经典布局相关配置
        classicLayout: {
          // 是否需要头部导航
          headerNavEnable: true,
          // 菜单选中样式border方向 可选 'left','right','none'
          activeBorderPosition: 'left',
          // 开启左侧菜单顶部搜索框
          menuSearchEnable: false,
          // 侧边栏是否展开
          sidebarOpen: true,
          // 经典布局左侧导航菜单标题
          menuTopTitle: '网站导航',
        },
        // 上下布局相关配置
        upDownLayout: {
          // 菜单选中样式border方向 可选 'left','right','none'
          activeBorderPosition: 'left',
        }
      },
      // 登录成功后，用户名下拉选项
      loginUserSelect: [{
        name: '个人信息',
        command: 'userInfo'
      }, {
        name: '退出系统',
        command: 'logout'
      }],
      page: {
        prevText: '上一页',
        nextText: '下一页'
      },
      validator: {
        // 角色管理
        role: {
          code: {
            rule: '^[A-Za-z0-9_-]+$',
            message: '编码必须是数字、字母、下划线组合'
          },
        },
        // 岗位管理
        post: {
          code: {
            rule: '^[A-Za-z0-9_]+$',
            message: '编码必须是数字、字母、下划线组合'
          },
        },
        // 模块管理
        module: {
          moduleCode: {
            rule: '^[A-Za-z0-9_]+$',
            message: '编码必须是数字、字母、下划线组合'
          },
        },
        // 区域管理
        area: {
          code: {
            rule: '^[A-Za-z0-9_]+$',
            message: '编码必须是数字、字母、下划线组合'
          },
          bizCode: {
            rule: '^[0-9a-zA-Z_]{1,}$',
            message: '业务编码只能为数字、字母和下划线'
          }
        },
        // 用户管理
        user: {
          username: {
            rule: '^[A-Za-z0-9]+$',
            message: '登录账号必须是英文或数字'
          },
          /**
           * 密码校验正则
           */
          password: {
            rule: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,}',
            message: '密码必须包含大、小写字母、数字、特殊字符且长度不能小于8'
          },
          /**
           * 邮箱校验正则
           */
          email: {
            rule: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
            message: '请输入正确的邮箱'
          },
          /**
           * 手机校验正则
           */
          phone: {
            rule: '^[1][3,4,5,7,8,9][0-9]{9}$',
            message: '请输入正确的手机号'
          },
          /**
           * 工号校验
           */
          jobNumber: {
            // 允许重复
            repeatEnable: false
          },
          /**
           * qq校验
           */
          qq: {
            // 允许重复
            repeatEnable: false
          },
          /**
           * 微信校验
           */
          wx: {
            // 允许重复
            repeatEnable: false
          },
          /**
           * 身份证校验
           */
          idCard: {
            rule: '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)',
            message: '请输入正确的身份证号',
            // 允许重复
            repeatEnable: false
          }
        },
        org: {
          code: {
            rule: '^[A-Za-z0-9_]+$',
            message: '编码必须是数字、字母、下划线组合'
          },
          /**
           * 邮箱校验正则
           */
          email: {
            rule: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
            message: '请输入正确的邮箱'
          },
          /**
           * 手机校验正则
           */
          contact: {
            rule: '^[1][3,4,5,7,8,9][0-9]{9}$',
            message: '请输入正确的手机号'
          }
        },
        company: {
          code: {
            rule: '^[0-9a-zA-Z_]{1,}$',
            message: '公司编码只能为数字、字母和下划线'
          }
        },
        category: {
          code: {
            rule: '^[A-Za-z0-9_]+$',
            message: '编码必须是数字、字母、下划线组合'
          }
        },
        /**
         * 密码校验正则
         */
        password: {
          rule: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,}',
          message: '密码必须包含大、小写字母、数字、特殊字符且长度不能小于8'
        },
        /**
         * 邮箱校验正则
         */
        email: {
          rule: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
          message: '请输入正确的邮箱'
        },
        /**
         * 手机校验正则
         */
        phone: {
          rule: '^[1][3,4,5,7,8,9][0-9]{9}$',
          message: '请输入正确的手机号'
        }
      },
      cache: {
        moduleCode: {
          key: 'gc-moduleCode',
          storeMethod: 'localStorage' //Cookie、sessionStorage、localStorage
        },
        menu: {
          key: 'gc-menu',
          storeMethod: 'sessionStorage' //Cookie、sessionStorage、localStorage
        },
        permission: {
          key: 'gc-permission',
          storeMethod: 'sessionStorage'  //Cookie、sessionStorage、localStorage
        },
        theme: {
          key: 'gc-themeColor',
          storeMethod: 'localStorage'  //Cookie、sessionStorage、localStorage
        },
        token: {
          key: 'token',
          storeMethod: 'Cookie'  //Cookie、sessionStorage、localStorage
        },
        layout: {
          headerNavEnableKey: 'gc-headerNav',
          storeMethod: 'localStorage'  //Cookie、sessionStorage、localStorage
        }
      }
    },
    // 是否在移动端展示开发者调试工具，开发环境此项不生效，会展示。生产环境生效
    showConsoleTool: false
  };
  String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, 'gm'), s2)
  }
})(window)


/**
 * 对象属性合并，与 Object.assign 语法不同
 * @param target
 * @param source
 * @returns {{}}
 */
function configDeepMerge(target, source) {
  var merged = {};
  for (var each in source) {
    if (target.hasOwnProperty(each) && source.hasOwnProperty(each)) {
      if (typeof (target[each]) == "object" && typeof (source[each]) == "object") {
        merged[each] = configDeepMerge(target[each], source[each]);
      } else {
        merged[each] = source[each];
      }
    } else if (source.hasOwnProperty(each)) {
      merged[each] = source[each];
    }
  }
  for (var each in target) {
    if (!(each in source) && target.hasOwnProperty(each)) {
      merged[each] = target[each];
    }
  }
  return merged;
}
