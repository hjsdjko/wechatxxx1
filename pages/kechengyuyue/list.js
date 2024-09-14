const {
deleteData,
page,
list,
newsData,
option,
} = require("../../api/index.js")
const utils = require("../../utils/index.js")
Page({
/**
* 页面的初始数据
*/
data: {
currPage:1,
totalPage:1,
pageSize:6,
popopShow:false,

        showToTopButton: true,
onPageScrollTop: 0, // 存储滚动距离的变量

goodsListData: [],
activeIndex: 0,
allData: [],
deleteShow: false,
className:"",
name:"",
addAuth:"",
delAuth: "",
editAuth:"" ,
                                silderList:[],
                                                                                                                    userid:"",
baseURL: wx.getStorageSync('baseURL') + "/"
},

/**
* 生命周期函数--监听页面加载
*/
async onLoad(options) {
this.setData({
addAuth: utils.isAuth("kechengyuyue", "新增") || utils.isAuthFront("kechengyuyue", "新增"),
delAuth: utils.isAuth("kechengyuyue", "删除") || utils.isAuthFront("kechengyuyue", "删除"),
editAuth: utils.isAuth("kechengyuyue", "修改") || utils.isAuthFront("kechengyuyue", "修改"),
})
if(options?.userid) {
this.setData({
    userid:options.userid
})
}
const currentPageUrl = this.getCurrentPageUrl();
if(getApp().globalData.name!=null){
this.setData({
    name: getApp().globalData.name
})
getApp().globalData.name=null
this.searhandler()
}else{
this.getData()
}




if (currentPageUrl == "/pages/kechengyuyue/list") {
    wx.setStorageSync("tableName",`kechengyuyue`)
    this.setData({
        className:"goodInfomation"
    })
    wx.setStorage
}else {
    this.setData({
        className:"other"
    })

}
},
onShow() {


},
/**
* 生命周期函数--监听页面初次渲染完成
*/
onReady() {

},
onPageShow() {
// 页面显示时执行的操作
},




async   search(){
this.setData({
currPage:1
})
let searchForm = {
    sfsh: '是',
page: this.data.currPage,
    limit: this.data.pageSize
}
            if(this.data.kechengmingcheng){
            searchForm['kechengmingcheng'] = '%' + this.data.kechengmingcheng + '%'
        }
                if(this.data.jiaolianxingming){
            searchForm['jiaolianxingming'] = '%' + this.data.jiaolianxingming + '%'
        }
    

let res = {};
if(this.data.userid) {
res = await page(`kechengyuyue`, searchForm);
} else {
res = await list(`kechengyuyue`, searchForm);
}


let goodsListData
// 如果是第一页数据置空
if ( this.data.currPage == 1) goodsListData = [];

goodsListData=res.data.list.map(item=>{
                item.kechengfengmian = item.kechengfengmian.split(",")[0];
                                                                return item
})

this.setData({
goodsListData,
popopShow:false
})

},

// 搜索








/**
* 生命周期函数--监听页面显示
*/
getCurrentPageUrl() {
const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const currentPageUrl = `/${currentPage.route}`;
return currentPageUrl;
},
handleTabClick(e) {
                                const index = e.currentTarget.dataset.index;
        const kechengfenlei = e.currentTarget.dataset.kechengfenlei;
        if (kechengfenlei == "全部") {
            const all = this.data.allData.filter(item => item.kechengfenlei != "全部")
            this.setData({
                goodsListData: all
            })
        } else {
            const currentGoodsListData = this.data.allData.filter(item => {
                return item.kechengfenlei == kechengfenlei;
            });
            this.setData({
                goodsListData: currentGoodsListData
            })
        }
                                                                                                                    
this.setData({
activeIndex: index,
});
},
    async searhandler(){
        let token = wx.getStorageSync('token')
        if (!token) {
            return
        }
                                            let targetName="kechengmingcheng"
                                                                                                                                                                                                                                                                                                                                                                            const allData=this.data.allData

        let goodsListData

        if(this.data.name==''){
            goodsListData=allData
        }else{
            goodsListData = allData.filter(item => item[targetName].includes(this.data.name));

        }
        this.setData({
            goodsListData
        })



    },
screenBoxShow() {
this.setData({
    popopShow: true
})
},
addTap() {
getApp().globalData.detailId=null
wx.navigateTo({
url: `/pages/kechengyuyue/update-and-add`
})
},
searchListHandler(e) {
this.setData({
goodsListData: e.detail.data
})
},
onPageScroll(e) {
if (e.scrollTop >= 225) {
this.setData({
    showToTopButton: true
});
}

},
backToTop() {
wx.pageScrollTo({
scrollTop: 0, // 返回顶部的位置
duration: 1000, // 滚动动画的时长，单位为 ms
});
// 返回顶部时隐藏按钮

},

deleteBtn(e) {
wx.showModal({
title: '提示',
content: '确认删除？',
complete: async (res) => {
    if (res.cancel) {}
    if (res.confirm) {
        const id = e.currentTarget.dataset.id;
        const res = await deleteData("kechengyuyue",[id])
        console.log(res);
        if (res.code == 0) {
            this.getData()
        }
    }
}
})
},
editBtn(e) {
const id = e.currentTarget.dataset.id;
getApp().globalData.detailId=id
wx.navigateTo({
url: `/pages/kechengyuyue/update-and-add`
})
},
async detailBtn(e) {
const item = e.currentTarget.dataset.item;
getApp().globalData.detailId = item?.id
getApp().globalData.detailList =item
wx.navigateTo({
url: `/pages/kechengyuyue/detail`
})

},
async getData() {

const userId=       getApp().globalData.userInfo.id



const obj={
page: this.data.currPage,
limit: this.data.pageSize,
}


let goodsListData
let totalPage




if (this.data.userid) {
const {
    data
}= await page("kechengyuyue",obj)
totalPage=data?.totalPage
goodsListData = data?.list.map(item => {
item.kechengfengmian? item.kechengfengmian = item.kechengfengmian.split(",")[0].replace('upload','flie'):""
    return item;
});
}
else{

const {
    data
}= await list("kechengyuyue",obj)
totalPage=data?.totalPage
goodsListData = data?.list?.filter(item =>
    item?.sfsh?item.sfsh === "是":item)
    .map(item => {
item.kechengfengmian? item.kechengfengmian = item.kechengfengmian.split(",")[0].replace('upload','flie'):""
        return item;
    });
}


    if(this.data.goodsListData>0){
const preGoodsListData = this.data.goodsListData
goodsListData=preGoodsListData.concat(goodsListData)
}
this.setData({
totalPage,
goodsListData,
allData: goodsListData
})
            // 商品名称
        if (getApp().globalData.name != null) {
            this.setData({
                goodsListData: getApp().globalData.goodsList,
            })
            getApp().globalData.name = null
            console.log('页面重新加载');
        }
        
                                const arr = [{
                kechengfenlei: "全部"
        }]


        const kechengfenleiobj={
            page:1,
            limit:100
        }
        let    kechengfenleiRes
        //侧边栏
        if(userId){
                kechengfenleiRes     = await list('kechengfenlei',kechengfenleiobj)
        }else{
                kechengfenleiRes     = await list('kechengfenlei',kechengfenleiobj)

        }
                arr.push(...kechengfenleiRes.data.list)
        this.setData({
            silderList:arr
        })
                                                                                                                    },
/**
* 生命周期函数--监听页面隐藏
*/
onHide() {

},

/**
* 生命周期函数--监听页面卸载
*/
onUnload() {

},

/**
* 页面相关事件处理函数--监听用户下拉动作
*/
onPullDownRefresh() {

},

/**
* 页面上拉触底事件的处理函数
*/
onReachBottom() {
/*上拉加载的回调: mescroll=currPage携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
let currPage = this.data.currPage
let totalPage = this.data.totalPage
// 判断到是最后一页，则停止刷新
if (currPage <= totalPage) {
// 获取下一页数据
this.setData({
    currPage: currPage + 1
})
console.log('获取下一页数据');
this.upCallback()
}
},
async upCallback() {
const obj = {
page: this.data.currPage,
limit: this.data.pageSize,
}
const {
data
} = await list("kechengyuyue", obj)

const preGoodsListData = this.data.goodsListData
const goodsListData = preGoodsListData.concat(data.list)
    this.setData({
        goodsListData,
        allData: goodsListData
    })
},
/**
* 用户点击右上角分享
*/
onShareAppMessage() {

}
})