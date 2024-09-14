const {
    list,
    deleteData
} = require("../../api/index")
const utils = require("../../utils/index.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const userid = getApp().globalData.userInfo.id
        const data = {
            userid
        }
        const res = await list("address", data)
        this.setData({
            addressList: res?.data?.list
        })
    },
    editTap(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/address/detail?id=${id}`
        })
    },
    delTap(e) {
        const id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确认删除？',
            complete: async (res) => {
                if (res.confirm) {
                    const res = await deleteData('address', [id])
                    if (res.code == 0) {
                        this.onLoad()
                    }
                }
            }
        })
    },
    addTap() {
        wx.navigateTo({
            url: '/pages/address/detail',
        })
    },
    selectAddress(e) {
        const item = e.currentTarget.dataset.item
        wx.setStorageSync('address', [item])
        wx.navigateBack({
            delta: 1, // 返回的页面数，1 表示返回上一级页面
            complete: () => {
                // 触发事件通知，传递需要更新的数据
                const pages = getCurrentPages();
                if (pages.length >= 1) {
                    const prePage = pages[pages.length - 1];
                    prePage.onLoad(); //
                }
            }
        });

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    onUnload() {},

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