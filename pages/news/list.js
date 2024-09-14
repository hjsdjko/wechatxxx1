// pages/forumCenter/forumCenter.js
const {
    // forumList
    list
} = require("../../api/index")
Page({

    data: {
        list: [],
        currentList: [],
        name: "",
        baseURL: ""
    },
    async onLoad(options) {
        const baseURL = wx.getStorageSync('baseURL') + "/"
        this.setData({
            baseURL
        })
        this.getData()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async onShow() {},

    searhandler() {
        const result = this.data.list.filter((item, index) => {
            if (item.title.includes(this.data.name)) {
                return item
            }

        })
        this.setData({
            currentList: result
        })
    },


    async todetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/news/detail?id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */

    async getData() {
        const data = {
            page: 1,
            limit: 20,
            sort: "addtime",
            order: "desc"
        }
        const res = await list("news", data)
        // const obj = {
        //     parentid: 0,
        //     isdone: '开放',
        //     sort: 'addtime',
        //     order: 'desc',
        //     page: 1,
        //     limit: 10,
        //     title: '% %',
        // }
        // const {
        //     data
        // } = await forumList(obj)
        this.setData({
            list: res.data.list,
            currentList: res.data.list,
            name: ""
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        console.log("2");
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