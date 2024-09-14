const dateUtils = require('../../utils/defautils')
const menuData=require('../../utils/menu.js')
const {
SendverificationCode,
option,
follow,wxbind,wxunbind
} = require('../../api/login.js')
const {
levelOption,
sheng,
update,
    session
} = require('../../api/index.js')
const utils = require("../../utils/index.js")
Page({
data: {
    code:'',
    openid:'',
    tableName:"",
yonghuzhanghao:'',
yonghumima:'',
yonghuxingming:'',
touxiang:'../../static/upload.png',
tempPathtouxiang:'../../static/upload.png',
        xingbieList:"男,女".split(','),
        xingbieIndex:null,

shoujihaoma:'',
jiaolianzhanghao:'',
jiaolianmima:'',
jiaolianxingming:'',
zhaopian:'../../static/upload.png',
tempPathzhaopian:'../../static/upload.png',
        xingbieList:"男,女".split(','),
        xingbieIndex:null,

lianxidianhua:'',
shenfenzhenghao:'',

registerContainerClass: "",
    role:""

},

async onLoad() {

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
    let tableName = wx.getStorageSync("nowTable");
    const menu = menuData.default.list()
    const name = wx.getStorageSync("role")
    let role
    menu.map(obj => {
        if (name == obj.roleName) {
            role = obj.tableName
        }
    })
    this.setData({
        role,
        tableName
    })
  const  userInfo  = getApp().globalData.userInfo
    const   baseURL= wx.getStorageSync('baseURL')+"/"
        this.setData({
                yonghuzhanghao: userInfo.yonghuzhanghao==null?"":userInfo.yonghuzhanghao,
        })
        this.setData({
                yonghumima: userInfo.yonghumima==null?"":userInfo.yonghumima,
        })
        this.setData({
                yonghuxingming: userInfo.yonghuxingming==null?"":userInfo.yonghuxingming,
        })
    userInfo['touxiang']=userInfo?.touxiang?.replace('upload','file')
   this.setData({
           touxiang:baseURL+userInfo.touxiang,
       tempPathtouxiang:baseURL+userInfo.touxiang,
   })
    this.data.xingbieList?.map((v, index) => {
        if (v ==  userInfo.xingbie) {
            this.setData({
                    xingbieIndex: index
            })
        }
    })

this.setData({
        shoujihaoma: userInfo.shoujihaoma,
})
        this.setData({
                jiaolianzhanghao: userInfo.jiaolianzhanghao==null?"":userInfo.jiaolianzhanghao,
        })
        this.setData({
                jiaolianmima: userInfo.jiaolianmima==null?"":userInfo.jiaolianmima,
        })
        this.setData({
                jiaolianxingming: userInfo.jiaolianxingming==null?"":userInfo.jiaolianxingming,
        })
    userInfo['zhaopian']=userInfo?.zhaopian?.replace('upload','file')
   this.setData({
           zhaopian:baseURL+userInfo.zhaopian,
       tempPathzhaopian:baseURL+userInfo.zhaopian,
   })
    this.data.xingbieList?.map((v, index) => {
        if (v ==  userInfo.xingbie) {
            this.setData({
                    xingbieIndex: index
            })
        }
    })

        this.setData({
                lianxidianhua: userInfo.lianxidianhua==null?"":userInfo.lianxidianhua,
        })
        this.setData({
                shenfenzhenghao: userInfo.shenfenzhenghao==null?"":userInfo.shenfenzhenghao,
        })

},
async onShow() {
},
touxiangTap() {
wx.chooseImage({
count: 1,
sizeType: ['compressed'],
sourceType: ['album', 'camera'],
success: async (res) => {
    const tempFilePaths = res.tempFilePaths;
    // 本地临时图片的路径
    this.setData({
        tempPathtouxiang: tempFilePaths[0]
    })
    // 上传网络图片
    const  baseURL=  wx.getStorageSync("baseURL")
    wx.uploadFile({
        url: `${baseURL}/file/upload`,
        filePath: res.tempFilePaths[0],
        name: 'file',
        header: {
            'Token': wx.getStorageSync('token')
        },
        success: (uploadFileRes) => {
            let result = JSON.parse(uploadFileRes.data);
            // result.file是上传成功为网络图片的名称
            if (result.code == 0) {
                this.setData({
                        touxiang: 'file/' + result.file
                })
            } else {
                wx.showToast({
                    title: result.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }
    })



}
})
},
xingbieChange(e) {
const selectedIndex = e.detail.value;
this.setData({
        xingbieIndex: selectedIndex,
});
},
async sendCodeHandler() {
if (!this.data.canSendCode) {
return;
}
if (this.data.shoujihaoma == "") {
wx.showToast({
    title: '请输入手机号码',
    icon: 'none'
})
return;
} else {
if (validatePhoneNumber(this.data.shoujihaoma) == false) {
    wx.showToast({
        title: '请输入有效手机号码',
        icon: 'none'
    })
    return;
} else {
                    const res = await SendverificationCode("${tableName}", 'sendsms','shoujihaoma',  this.data.shoujihaoma)
        this.setData({
        smscode: res.data
    })
}
}
this.setData({
canSendCode: false,
});
let time = this.data.countdown;
let timer = setInterval(() => {
time--;
this.setData({
    countdown: time, // 更新倒计时的时间
});
if (time <= 0) {
    clearInterval(timer); // 倒计时结束，清除定时器
    this.setData({
        buttonText: '发送验证码',
        canSendCode: true,
        countdown: 60
    });
}
}, 1000);

},
zhaopianTap() {
wx.chooseImage({
count: 1,
sizeType: ['compressed'],
sourceType: ['album', 'camera'],
success: async (res) => {
    const tempFilePaths = res.tempFilePaths;
    // 本地临时图片的路径
    this.setData({
        tempPathzhaopian: tempFilePaths[0]
    })
    // 上传网络图片
    const  baseURL=  wx.getStorageSync("baseURL")
    wx.uploadFile({
        url: `${baseURL}/file/upload`,
        filePath: res.tempFilePaths[0],
        name: 'file',
        header: {
            'Token': wx.getStorageSync('token')
        },
        success: (uploadFileRes) => {
            let result = JSON.parse(uploadFileRes.data);
            // result.file是上传成功为网络图片的名称
            if (result.code == 0) {
                this.setData({
                        zhaopian: 'file/' + result.file
                })
            } else {
                wx.showToast({
                    title: result.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }
    })



}
})
},
xingbieChange(e) {
const selectedIndex = e.detail.value;
this.setData({
        xingbieIndex: selectedIndex,
});
},
    quitTap(){
        wx.clearStorageSync();
        wx.reLaunch({
            url: "/pages/login/login"
        });
    },
async  saveTap(){


const baseURL = wx.getStorageSync('baseURL') + "/"
const regex = new RegExp(baseURL, "g");
const resultObj={
yonghuzhanghao:this.data.yonghuzhanghao,
yonghumima:this.data.yonghumima,
yonghuxingming:this.data.yonghuxingming,
        touxiang:this.data.touxiang.replace(regex, ""),
        xingbie:this.data.xingbieIndex ? this.data.xingbieList[this.data.xingbieIndex] : "",
shoujihaoma:this.data.shoujihaoma,
jiaolianzhanghao:this.data.jiaolianzhanghao,
jiaolianmima:this.data.jiaolianmima,
jiaolianxingming:this.data.jiaolianxingming,
        zhaopian:this.data.zhaopian.replace(regex, ""),
        xingbie:this.data.xingbieIndex ? this.data.xingbieList[this.data.xingbieIndex] : "",
lianxidianhua:this.data.lianxidianhua,
shenfenzhenghao:this.data.shenfenzhenghao,
   id:getApp().globalData.userInfo.id

}
        const res = await update(this.data.role, resultObj)
if (res.code == 0) {
    const userInfoRes = await session(this.data.role)
    if (userInfoRes.code == 0) {
        getApp().globalData.userInfo = userInfoRes.data
        wx.reLaunch({
            url: '/pages/center/center',
        })
    }
} else {
wx.showToast({
title: res.msg,
icon: "none"
})
}

},
 async   getSession(){
        let res = await session(this.data.role)
        getApp().globalData.userInfo=res.data
        this.setData({
            openid:res.data.openid
        })
    }
});