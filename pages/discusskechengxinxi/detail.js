const {
update,
add,
page,
list,
detail,
save
} = require("../../api/index.js")
const utils = require("../../utils/index.js")
Page({
data: {
token:  '',
baseURL:'',
id: getApp().globalData.detailId,
userId:getApp().globalData.userInfo.id,
detailList: {},
payAuth:"",
picture:"",
priceVisible:false,
goodname:"",

isInCart:false,
cartForm:{
userid:getApp().globalData.userInfo.id
},
commmentList: [],

},
async    onLoad(option) {

this.setData({
id:getApp().globalData.detailId.id,
token:   wx.getStorageSync('token'),
baseURL:   wx.getStorageSync('baseURL') + '/'
})
this.handleUpdateData()
},
//立即预订
orderTap(){
if (this.data.activeSeat.length <= 0) {
wx.showToast({
title: '请选择需要预订的位置',
icon: 'none'
})
return
}
const userInfo=getApp().globalData.userInfo
const activeSeat = this.data.activeSeat.join(',') + ',' + this.data.detailList.selected
let data = {
orderid: this.createOrderId(),
tablename: 'discusskechengxinxi',
userid:userInfo.id,
goodid: this.data.detailList.id,
buynumber:  this.data.activeSeat.length,
total: 0,
discounttotal: 0,
address: this.data.activeSeat,
status: '已支付',
discountprice: this.data.detailList.vipprice,
}
if(this.data.detailList.price){
data['status'] = '未支付'
data['price'] = this.data.detailList.price
data['total'] = parseFloat(data['price'] * activeSeat.length).toFixed(2)
wx.showModal({
title: '提示',
content: '是否预订选中座位',
complete: async (res) => {
if (res.confirm) {
    wx.setStorageSync('orderGoods',[data])
    wx.setStorageSync('options',{type:1,seat:1})
    wx.navigateTo({
        url: "/pages/shop-orders/orders-confirm"
    })
}
}
})
}

}
,

authTap() {
    if (!this.data.token) {
        wx.showToast({
            title: '请先登陆',
            icon: 'none'
        })
        return
    }
},
async handleUpdateData() {
// 更新当前页面的数据
var that = this
const id = getApp().globalData.detailId
if (id) {
const {
data
} = await detail("discusskechengxinxi",id)
this.setData({
payAuth:utils.isAuthFront('discusskechengxinxi','支付')
})

const detailList = data
this.setData({
detailList,
picture: detailList.avatarurl.split(','),
})

if (!this.data.token) {
return
}


this.getInCartList();
}
const commentData = {
page: 1,
limit: 10,
refid: getApp().globalData.detailId
}
const commentRes = await list("discussdiscusskechengxinxi", commentData)
this.setData({
commmentList: commentRes.data?.list
})

},

onUnload: function () {
getApp().globalData.detailList = {}
console.log('页面被卸载，执行销毁操作');
},
async addCommentap() {

if (!this.data.token) {
return
}

getApp().globalData.detailId=this.data.detailList.id
wx.setStorageSync('tableName',"discusskechengxinxi" )
wx.navigateTo({
url: `/pages/discussdiscusskechengxinxi/update-and-add`,
})
console.log("uusuer", getApp().globalData.userInfo);
},
async listUpdate(name) {
const predetailList = this.data.predetailList
const detailList = this.data.detailList
predetailList.shangpintupian = this.data.picture[0]
if (name == "thumbsupnum") {
// 点赞
predetailList.thumbsupnum = predetailList.thumbsupnum + 1
detailList.thumbsupnum = detailList.thumbsupnum + 1
}
if (name == "cancelthumb") {
// 取消点赞
predetailList.thumbsupnum = predetailList.thumbsupnum - 1
detailList.thumbsupnum = detailList.thumbsupnum - 1
}
if (name == "crazilynum") {
predetailList.crazilynum = predetailList.crazilynum + 1
detailList.crazilynum = detailList.crazilynum + 1
}
if (name == "cancelCrazily") {
predetailList.crazilynum = predetailList?.crazilynum - 1
detailList.crazilynum = detailList.crazilynum - 1
}
if (name == 'cancelislike') {
predetailList.storeupnum = predetailList.storeupnum - 1
detailList.storeupnum = detailList.storeupnum - 1

}
if (name == "islike") {
predetailList.storeupnum = predetailList.storeupnum + 1
detailList.storeupnum = detailList.storeupnum + 1
}
this.setData({
detailList
})
const resUpdate = await update('discusskechengxinxi', predetailList)
if (resUpdate.code == 0) {
this.setData({
predetailList,
"detailList.crazilynum": predetailList.crazilynum
})

}


},



async getInCartList(){
const params = {
userid:getApp().globalData.userInfo.id,
tablename:'discusskechengxinxi',
goodid: this.data.detailList.id
}
const res=  await list('cart',params)
if(res.data.list.length){
this.setData({
isInCart:true
})
}else{
this.setData({
isInCart:false
})
}
},
async  addCart(){

if (!this.data.token) {
return
}
if(this.data.isInCart){
wx.showToast({
title: '该商品已在购物车，请前往购买',
icon: "none"
})
return
}
const baseURL=  wx.getStorageSync('baseURL')+"/"
this.setData({
'cartForm.buynumber': this.data.buyNumber,
'cartForm.goodid': this.data.detailList.id,
'cartForm.tablename': "discusskechengxinxi",
})
let cartForm=this.data.cartForm
this.setData({
'cartForm.price': this.data.detailList.price
})
const res=   await save('cart',this.data.cartForm)

if(res.code==0){
wx.showToast({
title: '添加成功',
icon: "none"
})

this.getInCartList()
var that = this
setTimeout(function () {

that.onLoad()
return
}, 1000)

}

},

onPayTap()  {

if (!this.data.token) {
return
}
const baseURL=  wx.getStorageSync('baseURL')
let data=this.data.detailList
data['buynumber']=1
wx.setStorageSync('payObject',data);
wx.setStorageSync('paytable','discusskechengxinxi');
wx.setStorageSync('options',{type:1})

wx.navigateTo({
url: "/pages/pay-confirm/pay-confirm"
})
},


onSHTap() {
this.selectComponent('#bottomFrame').showFrame();
},
canlreply() {
this.selectComponent('#bottomFrame').hideFrame();
},
async reply() {
const detailList = this.data.detailList
const res = await update("discusskechengxinxi", detailList)
if (res.code == 0) {
setTimeout(function () {
wx.showToast({
title: '回复成功',
icon: "none"
})
}, 1000)

this.handleUpdateData()
}
this.selectComponent('#bottomFrame').hideFrame();
},


async onShow() {
},

// 下载
    download(e) {
let url = e.currentTarget.dataset.url
url = wx.getStorageSync('baseURL') + '/' + url;
wx.downloadFile({
    url: url,
    success: (res) => {
        if (res.statusCode === 200) {
            wx.showToast({
                title: '下载成功',
                icon: "none"
            })
            window.open(url);
        }
    }
});
},
// 跨表

                                                                

})