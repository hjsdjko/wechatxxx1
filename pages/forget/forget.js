const {
    security,
    update
} = require("../../api/login.js")
const menuData = require('../../utils/menu.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        secretShow: false,
        pquestion: "",
        panswer: "",
        Inputpanswer: "",
        reviseShow: false,
        password: "",
        comfirmPassword: "",
        usernamShow: true,
        securityData: {},
        loginType: 0, // 1管理员，2商家，3用户
        loginRole: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const menu = menuData.default.list()
        const selectType = ["请选择登陆类型"]
        menu.map((obj) => {
            if (obj["roleName"] && obj["hasFrontLogin"] == "是") {
                selectType.push(obj["roleName"])
                this.setData({
                    selectType
                })
            }
        });
        if (this.data.selectType.length <= 2) {
            this.setData({
                loginType: 1
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    bindPickerChange: function (e) {

        this.setData({
            loginType: e.detail.value
        })
        let loginRole
        const name = this.data.selectType[this.data.loginType]
        const menu = menuData.default.list()
        menu.map(obj => {
            if (name == obj.roleName) {
                loginRole = obj.tableName
            }
        })
        this.setData({
            loginRole
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
    onUnload() {

    },
    async next() {
        if (this.data.username == "") {
            wx.showToast({
                title: '请输入账号',
                icon: "none"
            })
            return;
        }

        const res = await security(this.data.loginRole, this.data.username)
        if (res.code == 0) {
            this.setData({
                pquestion: res.data?.pquestion,
                panswer: res.data?.panswer,
                secretShow: true,
                usernamShow: false,
                securityData: res?.data
            })
        }
    },
    comfirm() {
        if (this.data.Inputpanswer == "") {
            wx.showToast({
                title: '请输入密保答案',
                icon: "none"
            })
            return;
        }
        if (this.data.Inputpanswer.replace(/\s/g, '') == this.data.panswer) {
            wx.showToast({
                title: '验证成功',
                icon: "none"
            })
            this.setData({
                reviseShow: true,
                secretShow: false,
            })
        } else {
            wx.showToast({
                title: '密保答案不正确',
                icon: "none"
            })
        }
    },
    async updatePassword() {
        if (this.data.password == "") {
            wx.showToast({
                title: '请输入密码',
                icon: "none"
            })
            return;
        }
        if (this.data.comfirmPassword == "") {
            wx.showToast({
                title: '请输入确认密码',
                icon: "none"
            })
            return;
        }
        if (this.data.password !== this.data.comfirmPassword) {
            wx.showToast({
                title: '密码与确认密码不一致!!',
                icon: "none"
            })
            return;
        }
        const data = this.data.securityData
        data.mima = this.data.password
        const res = await update(this.data.loginRole, data)
        if (res.code == 0) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
        }
    },

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