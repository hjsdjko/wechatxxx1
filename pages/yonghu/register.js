
const dateUtils = require('../../utils/defautils')
const utils = require("../../utils/index.js")
const {
SendverificationCode,
register,
option,
    smscode,
follow
} = require('../../api/login.js')
const {
    levelOption,
    sheng,
} = require('../../api/index.js')
Page({
data: {
     yonghuzhanghao:'',
     yonghumima:'',
     yonghuxingming:'',
   touxiang:'../../static/upload.png',
   tempPathtouxiang:'../../static/upload.png',
xingbieList:"男,女".split(','),
xingbieIndex:null,
     shoujihaoma:'',

    registerContainerClass: "",

},

async onLoad() {









},
onUnload() {
},
async onShow() {





    this.setData({
            xingbieList:  "男,女".split(',')
    })




},







yonghuzhanghaoInput(e) {
this.setData({
    yonghuzhanghao: e.detail.value
})
},

yonghumimaInput(e) {
this.setData({
    yonghumima: e.detail.value
})
},

yonghuxingmingInput(e) {
this.setData({
    yonghuxingming: e.detail.value
})
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

shoujihaomaInput(e) {
this.setData({
    shoujihaoma: e.detail.value
})
},

async  register(){
if (this.data.yonghuzhanghao == "") {
wx.showToast({
title: '请输入用户账号',
icon: "none"
})
return;
}
if (this.data.yonghumima == "") {
wx.showToast({
title: '请输入用户密码',
icon: "none"
})
return;
}
if (this.data.yonghumima2=="") {
wx.showToast({
title: '请输入确认用户密码',
icon: "none"
})
return;
}
if (this.data.yonghumima !== this.data.yonghumima2) {
wx.showToast({
title: '用户密码与确认用户密码不一致!!',
icon: "none"
})
return;
}








  const resultObj={
        yonghuzhanghao:this.data.yonghuzhanghao,
        yonghumima:this.data.yonghumima,
        yonghuxingming:this.data.yonghuxingming,
        touxiang:this.data.touxiang,
        xingbie: this.data.xingbieList?.length ? this.data.xingbieList[this.data.xingbieIndex] : "",
        shoujihaoma:this.data.shoujihaoma,
  }
    const name="yonghuzhanghao"
    const password="yonghumima"
    const res = await register("yonghu", name, this.data[name],password , this.data[password], resultObj)
if (res.code == 0) {
wx.navigateTo({
url: '../login/login',
})
} else {
wx.showToast({
title: res.msg,
icon: "none"
})
}

}



});