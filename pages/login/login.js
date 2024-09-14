const {userLogin,wxlogin}=require('../../api/login.js')
const captchaUtil = require('../../utils/captcha.js');
const menuData=require('../../utils/menu.js')
const {
    session
} = require("../../api/index.js")

Page({
    data: {
        code:'',
      selectType:[],
      showLoginRole:false,
        username: '',
        password: '',
      loginType: 1, // 1管理员，2商家，3用户
    },

onReady(){
},
onLoad(){
    const menu=menuData.default.list()
    const selectType=["请选择登陆类型"]
    wx.login({
        provider: 'weixin',
        success: function (res) {
            let code = res.code;
            if (code) {
                this.setData({
                    code
                });
            }
        }.bind(this)
    });
    menu.map((obj) => {
        if (obj["roleName"]&&obj["hasFrontLogin"]=="是") {
          selectType.push(obj["roleName"])
          this.setData({
              selectType
          })
        }
      });

      if(this.data.selectType.length<=2){
          this.setData({
            loginType:1
          })
      }

},


                                                                bindPickerChange: function(e) {
        this.setData({
            loginType: e.detail.value
        })

      },

    registerUser(e){
        const tablename = e.currentTarget.dataset.tablename;
        wx.navigateTo({
                     url: `../${tablename}/register`
        })
    },
  // 选择用户登录类型
  bindLoginTypeChange(e) {
    const loginType = e.detail.value;
    this.setData({
      loginType,
    });
  },
uploadAvatar() {
    wx.chooseImage({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 选择压缩的图片
      sourceType: ['album', 'camera'], // 从相册或相机选择图片
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        // 将选择的文件赋值给avatarUrl，并更新到页面上
        this.setData({
          avatarUrl: tempFilePaths[0]
        });
      }
    })},
  async  login() {
     if (this.data.username === '') {
        wx.showToast({
          title: '请输入账号',
          icon:'none'
        });
        return;
      }
      if (this.data.password === '') {
        wx.showToast({
          title: '请输入密码',
          icon:'none'
        });
        return;
      }
      if (this.data.captcha === '') {
        wx.showToast({
          title: '请输入验证码',
          icon:'none'
        });
        return;
      }
      const {captcha,userCaptchaInput}=this.data
  if(captcha!=userCaptchaInput){
    wx.showToast({
        title: '验证码错误',
        icon:'none'
      })
      this.generateCaptcha();//重新生成验证码
return ;
  }

        if(this.data.loginType!=0 ){
            const role = this.data.selectType[this.data.loginType]
            const menu = menuData.default.list()
            var loginRole
            menu.map(obj => {
                if (role == obj.roleName) {
                    loginRole = obj.tableName
                }
            })
            const res = await userLogin(loginRole, this.data.username, this.data.password)
                if (res.code === 0) {

                    const role = this.data.selectType[this.data.loginType]
                    // 保存登录角色
                    wx.setStorageSync('role', role)
                                                                                                    // 登录成功
                    const token = res.token;
                    wx.setStorageSync('token', token);
                    wx.setStorageSync('nowTable', loginRole);
                    // 跳转到首页或其他需要登录后才能访问的页面
                    const res2 = await session(loginRole);
                    getApp().globalData.userInfo = res2.data
                    wx.setStorageSync("nickname",this.data.username)
                    wx.setStorageSync("avatarurl", res2.data?.touxiang)
                    if (res2.data?.vip) {
                        wx.setStorageSync("vip", res2.data.vip);
                    }
    wx.switchTab({
                      url: '/pages/index/index',
                    });
                  } else {
                    // 登录失败
                    wx.showToast({
                      title: res.msg,
                      icon:'none'
                    });
        this.generateCaptcha()
            }
          }else{
              wx.showToast({
                title: '请选择登陆类型',
                icon:'none'
              })
          }



    },
  });
  