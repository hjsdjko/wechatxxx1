const utils = require('../../utils/index.js')
const menu = require('../../utils/menu.js')
const {
    session,encrypt,update
} = require("../../api/index")
Page({


    /**
     * 页面的初始数据
     */
    data: {
        passWorded:"",
        newPassword:'',
        confirmPassword:'',

        token: '',
        backMenuList: "",
        userInfo:{},
        secondIndex: false,
        baseURL: wx.getStorageSync('baseURL') + '/',
        orderList:  [{
            name: '全部',
            icon: 'icon-dingdan1'
        },
        {
        name: '未支付',
            icon: 'icon-dingdan2'
        },
        {
        name: '已支付',
            icon: 'icon-dingdan3'
        },
        {
        name: '已完成',
            icon: 'icon-dingdan4'
        },
        {
        name: '已取消',
            icon: 'icon-dingdan5'
        },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad(options) {

        this.getData()

    },
    onShow() {
        this.onLoad()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
    },
    toDetail() {
        wx.navigateTo({
            url: '/pages/user-info/user-info',
        })
    },
    orderTap(e) {
        const name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: `/pages/shop-orders/orders-list?name=${name}`,
        })
    },
 async   getData() {
     this.setData({
         token: wx.getStorageSync('token'),
     })
     if (!this.data.token) {
         return
     }
        let table = wx.getStorageSync("nowTable");
        const res = await session(table)
        const menus = menu.default.list()
        for (let x in menus) {
            if (menus[x].tableName == table) {
                this.setData({
                    backMenuList:menus[x].backMenu
                })
                break
            }
        }
     res.data["touxiang"] = res?.data?.touxiang?.replace('upload', 'file')
        this.setData({
            userInfo:res.data
        })
        getApp().globalData.userInfo=res.data
    },
    userRecharge() {
        wx.removeStorageSync('payObject');
        wx.navigateTo({
            url: "/pages/pay-confirm/pay-confirm"
        })
    },
    menuTap(e) {
        const item = e.currentTarget.dataset.item;
        const index = e.currentTarget.dataset.index;
        const tableName = item.child[0].tableName
        if (item.menu == "论坛管理") {
            if (this.data.secondIndex == index) {
                this.setData({
                    secondIndex: -1
                })
                return false
            } else {
                this.setData({
                    secondIndex: index
                })
                
            }
        } else if (item.menu.includes("我的收藏")) {
                wx.navigateTo({
                    url: `/pages/${tableName}/${tableName}-list`,
                })
        }

        else {
            utils.menuTap(tableName)
        }
    },
    tologin(){
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    optionsTap(e) {
        // 论坛管理
        const item = e.currentTarget.dataset.item;
        const tableName = item.tableName
        if (item.menu.includes("论坛交流")) {
            wx.navigateTo({
                url: `/pages/${tableName}/${tableName}-my`,
            })
        } else if (item.menu.includes("我的发布")) {
            wx.navigateTo({
                url: `/pages/${tableName}/${tableName}-add-or-update`,
            })

        }

    },
    cancelShow(){
        this.selectComponent('#bottomFrame').hideFrame();
    },
    uppdatePassword() {
        this.selectComponent('#bottomFrame').showFrame();
    },
   async  resetpasswordBtn(){

if (!this.data.passWorded){
    wx.showToast({
        title: '原密码不能为空',
        icon: 'none'
    })
return
}
if (!this.data.newPassword){
    wx.showToast({
        title: '新密码不能为空',
        icon: 'none'
    })
    return
}
if (!this.data.confirmPassword){
    wx.showToast({
        title: '确认密码不能为空',
        icon: 'none'
    })
    return
}
let password = ''
 let table=   wx.getStorageSync("nowTable")

if (table=='yonghu') {
password = getApp().globalData.userInfo.yonghumima;
}
let newpassword = this.data.passWorded
let res = await encrypt('md5',this.data.passWorded)
newpassword = res.data
if(password != newpassword){
    wx.showToast({
        title: '原密码不正确',
        icon: 'none'
    })
    return
}
if (this.data.newPassword != this.data.confirmPassword){
    wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
    })
    return
}
if (table == 'yonghu') {
}
if (table=='yonghu') {
getApp().globalData.userInfo.yonghumima = this.data.newPassword
}
       let userInfo=getApp().globalData.userInfo;
       await update(table,userInfo)
       wx.showToast({
           title: `修改密码成功,下次登录系统生效`,
           icon: 'none'
       })
       this.selectComponent('#bottomFrame').hideFrame();
     },
    onPageTap() {
        wx.navigateTo({
            url: "/pages/pay-confirm/pay-confirm"
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})