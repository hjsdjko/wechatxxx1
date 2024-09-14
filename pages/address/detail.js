var amapFile = require("../../miniprogram/amap-wx")
const utils = require("../../utils/index.js")
const {
    add,
    detail,
    update
} = require('../../api/index.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: 0, //首次加载维度
        longitude: 0, //首次加载的经度

                        tips: {},
        weatherInfo: null,
        addressName: "",
        searchList: [],
        listShow: true,
        mapShow: true,
        markers: [],
        isdefault: false,
        phone: "",
        name: "",
        detailAddress: "",
        editId: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        if (options?.id) {
            const {
                data
            } = await detail("address", options.id)
            const isdefault = data.isdefault == '是' ? true : false
            this.setData({
                name: data.name,
                phone: data.phone,
                addressName: data.address,
                isdefault,
                editId: options.id
            })
            this.keyword(data.address);
        } else {
        }
    },
    switch1Change(e) {
        this.setData({
            isdefault: e.detail.value
        })
    },
    nameInp(e) {
        this.keyword(e.detail.value);
        this.setData({
            addressName: e.detail.value
        })

    },

    mapCancel() {
        this.setData({
            searchList: [],
            mapShow: false,
            addressName: ""
        })
        this.selectComponent('#bottomFrame').hideFrame();
    },
    keyword() {
        var myAmapFun = new amapFile.AMapWX({
                key: '6d82583d03f5544e3d109c2e289f34eb'
            }),
            that = this;
        myAmapFun.getInputtips({
            keywords: this.data.addressName,
            location: '',
            success: function (data) {
                console.log("sss", data);
                if (data && data.tips) {
                    //将数据赋值到searchList
                    that.setData({
                        searchList: data.tips,
                    });
                    console.log("searchList", data.tips);

                }
            }
        });
    },
    mapConfirm() {
        this.selectComponent('#bottomFrame').hideFrame();
    },
    async saveTap() {
        const phone = this.data.phone
        const name = this.data.name
        const addressName = this.data.addressName
        const detailAddress = this.data.detailAddress
        const isdefault = this.data.isdefault ? "是" : "否";
        if (!name || !addressName) {
            wx.showToast({
                title: '请输入完整信息',
                icon: 'none'
            })
            return
        }
        if (!utils.validata("mobile", phone)) {
            wx.showToast({
                title: '请输入有效手机号码',
                icon: 'none'
            })
            return
        }

        const data = {
            name,
            addressName: detailAddress,
            address: addressName,
            phone,
            isdefault,
            userid: getApp().globalData.userInfo.id
        }

        let res
        this.data.editId ? (data['id'] = this.data.editId, res = await update("address", data)) :
            res = await add("address", data)
        if (res.code == 0) {
            wx.redirectTo({
                delta: 1,
                url: '/pages/address/list',
                complete: () => {
                    const pages = getCurrentPages();
                    if (pages.length >= 1) {
                        const prePage = pages[pages.length - 2];
                        const updatePage = pages[pages.length - 3];
                        prePage.onLoad(); //
                        updatePage.onLoad(); //
                    }
                }
            })
        }
    },
    selAddressTap(e) {
        const info = e.currentTarget.dataset.info;
        this.setData({
            addressName: e.currentTarget.dataset.info,
            listShow: false,
            mapShow: true
        })

        this.data.searchList.map(v => {
            if (info == v.district + v.address) {
                if (v.location) {
                    console.log("v.location", v.location);
                    let longitude = v.location.split(",")[0]
                    let latitude = v.location.split(",")[1]

                    const markers = [{
                        label: {
                            content: this.data.addressName
                        },
                        longitude,
                        latitude,
                        title: this.data.addressName

                    }]
                    this.setData({
                        longitude,
                        latitude,
                        markers
                    })
                }

            }
        })

    },
    defaultAddress(e) {
        // console.log("e.detail.value", e.detail.value);
        this.setData({
            isdefault: this.data.defaultList[e.detail.value]
        })
    },
    getLocation() {
        // 调用百度地图 API 进行附近地点搜索
        var that = this;

        wx.getLocation({
            type: '6d82583d03f5544e3d109c2e289f34eb',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                console.log('经度:', longitude, '纬度:', latitude);

                that.setData({
                    latitude: latitude,
                    longitude: longitude,
                });
            },
            fail: function (err) {
                console.log('获取位置信息失败', err);
            }
        });
    },
    getWeatherTap() {
        var that = this;
        var myAmapFun = new amapFile.AMapWX({
            // 高德Id
            key: '6d82583d03f5544e3d109c2e289f34eb'
        });
        myAmapFun.getWeather({
            success: function (data) {
                //成功回调
                console.log('成功回调', data)
            },
            fail: function (info) {
                //失败回调
                console.log('失败回调', info)
            }
        })
    },
    moveToLocation() {
        let that = this; //防止this指向问题
        wx.chooseLocation({
            success: function (res) {
                console.log(res.name);
                //赋值给data中的mapName
                that.setData({
                    addressName: res.name
                })
                            },
            //错误信息
            fail: function (err) {
                console.log(err);
            }
        })
    },
                                cancel() {
        this.setData({
            mapShow: false
        })
        this.selectComponent('#bottomFrame').showFrame();
    },
    bindInput: function (e) {
        var that = this;
        var keywords = e.detail.value;
        var key = config.Config.key;
        var myAmapFun = new amapFile.AMapWX({
            key: '6d82583d03f5544e3d109c2e289f34eb'
        });
        myAmapFun.getInputtips({
            keywords: keywords,
            location: '',
            success: function (data) {
                if (data && data.tips) {
                    that.setData({
                        tips: data.tips
                    });
                }

            }
        })
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

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        wx.navigateBack({
            delta: 1,
        })
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