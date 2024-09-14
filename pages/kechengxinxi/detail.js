const {
deleteData,
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

islike: false,
commmentList: [],
kechengyuyueShow:'',

},
async    onLoad(option) {
this.setData({
    kechengyuyueShow: utils.isAuthFront('kechengxinxi','课程预约'),
})

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
tablename: 'kechengxinxi',
userid:userInfo.id,
goodid: this.data.detailList.id,
    goodname:  this.data.detailList.kechengmingcheng,
buynumber:  this.data.activeSeat.length,
total: 0,
discounttotal: 0,
address: this.data.activeSeat,
status: '已支付',
discountprice: this.data.detailList.vipprice,
picture:  this.data.picture[0],
goodtype: this.data.detailList.kechengfenlei,
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
} = await detail("kechengxinxi",id)
this.setData({
payAuth:utils.isAuthFront('kechengxinxi','支付')
})

const predetailList = Object.assign({}, data)
this.setData({
predetailList
})
const detailList = data
this.setData({
detailList,
picture: detailList.kechengfengmian.split(','),
})

if (!this.data.token) {
return
}


await this.searchList("isStoreup")
}
const commentData = {
page: 1,
limit: 10,
refid: getApp().globalData.detailId
}
const commentRes = await list("discusskechengxinxi", commentData)
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
wx.setStorageSync('tableName',"kechengxinxi" )
wx.navigateTo({
url: `/pages/discusskechengxinxi/update-and-add`,
})
console.log("uusuer", getApp().globalData.userInfo);
},
async listAdd(anyType) {
const userid = getApp().globalData.userInfo.id
const data = {
            name: this.data.detailList.kechengmingcheng,
        picture:  this.data.detailList.kechengfengmian,
    inteltype:this.data.detailList.kechengfenlei,
    tablename: `kechengxinxi`,
// type 收藏是1 关注是41
refid:getApp().globalData.detailId,
userid,
type: anyType
}
await add("storeup", data)
},
async searchList(name) {
const userid = getApp().globalData.userInfo.id
const searchData = {
page: 1,
limit: 1,
refid:getApp().globalData.detailId,
tablename: "kechengxinxi",
userid,
// 1收藏 %2%点赞
type: 1
}
if (name == "isStoreup" ) {
const storeupRes = await list("storeup", searchData)
if (storeupRes?.data?.list?.length > 0) {
    // 收藏
    this.setData({
        islike: true
    })
    const id = [storeupRes?.data?.list[0]?.id]
    return id
}
else {
    this.setData({
        islike: false
    })
}
}
},
likeTap() {

if (!this.data.token) {
return
}
wx.showModal({
title: '提示',
content: '是否收藏',
complete: async (res) => {
if (res.confirm) {
    // 添加收藏
    await this.listAdd(1)
    await this.listUpdate('islike')
    await this.searchList("isStoreup")
}
}
})

},
cancelLikeTap() {

if (!this.data.token) {
return
}
wx.showModal({
title: '提示',
content: '是否取消收藏',
complete: async (res) => {
if (res.cancel) {}
if (res.confirm) {
    const id = await this.searchList("isStoreup")
    // 删除收藏
    await deleteData('storeup', id)
    await this.listUpdate('cancelislike')
    this.searchList("isStoreup")
}
}
})

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
const resUpdate = await update('kechengxinxi', predetailList)
if (resUpdate.code == 0) {
this.setData({
predetailList,
"detailList.crazilynum": predetailList.crazilynum
})

}


},




onPayTap()  {

if (!this.data.token) {
return
}
const baseURL=  wx.getStorageSync('baseURL')
let data=this.data.detailList
data["kechengfengmian"] = data.kechengfengmian
data['buynumber']=1
wx.setStorageSync('payObject',data);
wx.setStorageSync('paytable','kechengxinxi');
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
const res = await update("kechengxinxi", detailList)
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
onAcrossTap(e){

// (tableName,crossOptAudit,statusColumnName,tips,statusColumnValue)
const info = e.currentTarget.dataset.info;
const crossOptAudit=info.split(",")[1].replace(/'/g, '')

const token = wx.getStorageSync("token")
if (!this.data.token) {
wx.showToast({
    title: '请登录后再操作',
    icon:"none"
})
return
}

let pagetableName = info.split(",")[0]
const statusColumnName = info.split(",")[2]
const tips = info.split(",")[3]
const statusColumnValue = info.split(",")[3]
wx.setStorageSync('crossTable','kechengxinxi');
wx.setStorageSync(`crossObj`, this.data.detailList);
wx.setStorageSync('statusColumnName', statusColumnName)
wx.setStorageSync('tips', tips)
wx.setStorageSync('statusColumnValue', statusColumnValue)
if (statusColumnName != '' && !statusColumnName.startsWith("[")) {
var obj = this.data.detailList
for (var o in obj) {
    if (statusColumnName.includes(o) && statusColumnValue.includes(obj[o])) {
        wx.showToast({
            title: tips,
            icon: "none"
        })
        return
    }
}
}
getApp().globalData.detailId = this.data.detailList.id
getApp().globalData.detailList = this.data.detailList
wx.navigateTo({
url: `/pages/${pagetableName}/update-and-add?cross=true`,
})

},

                                                                

})