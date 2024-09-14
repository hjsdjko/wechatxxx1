
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







async  register(){
if (this.data.jiaolianzhanghao == "") {
wx.showToast({
title: '请输入教练账号',
icon: "none"
})
return;
}
if (this.data.jiaolianmima == "") {
wx.showToast({
title: '请输入教练密码',
icon: "none"
})
return;
}
if (this.data.jiaolianmima2=="") {
wx.showToast({
title: '请输入确认教练密码',
icon: "none"
})
return;
}
if (this.data.jiaolianmima !== this.data.jiaolianmima2) {
wx.showToast({
title: '教练密码与确认教练密码不一致!!',
icon: "none"
})
return;
}









  const resultObj={
        jiaolianzhanghao:this.data.jiaolianzhanghao,
        jiaolianmima:this.data.jiaolianmima,
        jiaolianxingming:this.data.jiaolianxingming,
        zhaopian:this.data.zhaopian,
        xingbie: this.data.xingbieList?.length ? this.data.xingbieList[this.data.xingbieIndex] : "",
        lianxidianhua:this.data.lianxidianhua,
        shenfenzhenghao:this.data.shenfenzhenghao,
  }
    const name="jiaolianzhanghao"
    const password="jiaolianmima"
    const res = await register("jiaolian", name, this.data[name],password , this.data[password], resultObj)
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