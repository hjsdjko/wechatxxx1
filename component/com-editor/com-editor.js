const {
    forumSave
} = require('../../api/index')
var that;
Component({
    data: {
        content: '',
        formats: {}, // 样式
        placeholder: '开始输入...',
        userInfo: {},
        parentId: ""
    },
    observers: {
        'value': function (newValue) {
            this.setData({
                content: newValue
            })
            console.log("newValue", newValue);
        },
    },

    // async onLoad(option) {
    ready() {
        const that = this;
        const parentId = "点击id";

        this.setData({
            parentId
        });

        that.onEditorReady();
    },
    methods: {
        // 初始化编辑器
        onEditorReady() {
            const that = this;
            const editorQuery = this.createSelectorQuery().select('#editor');

            if (getApp().globalData.editorContent) {
                const content = getApp().globalData.editorContent;
                setTimeout(() => {
                    editorQuery.context((res) => {
                        that.editorCtx = res.context;
                        // 初始化赋值内容
                        that.editorCtx.setContents({
                            html: content
                        });
                    }).exec();
                }, 100);
            } else {
                editorQuery.context((res) => {
                    that.editorCtx = res.context;
                    console.log("res.context", res);

                    if (wx.getStorageSync("content")) {
                        that.editorCtx.insertText(wx.getStorageSync("content"));
                    }
                }).exec();
            }
        },

        // 返回选区已设置的样式
        onStatusChange(e) {
            // console.log(e.detail)
            const formats = e.detail
            this.setData({
                formats
            })
        },
        // 内容发生改变
        onContentChange(e) {
            // console.log("内容改变")
            // console.log(e.detail.html)
            getApp().globalData.editorContent = e.detail.html
       
        },
        // 失去焦点
        onNoFocus(e) {
            // console.log("失去焦点")
            // console.log(e.detail)
            // that.setData({
            //   content: e.detail
            // })
            // wx.setStorageSync("content", e.detail)
        },
        // 获取内容
        clickLogText(e) {
            // that.editorCtx.getContents({
            //     success: async function (res) {
            //         that.triggerEvent('acceptChild', {
            //             data: res.html
            //         })

            //     }
            // })
            // that.editorCtx.getContents({
            //     success: async function (res) {
            //         wx.setStorageSync("content", res.html);
            //         console.log(" this.data.userInfo", that.data.userInfo);
            //         const data = {
            //             avatarurl: that.data.userInfo?.touxiang,
            //             content: res.html,
            //             parentid: that.data.parentId,
            //             username: that.data.userInfo?.yonghuming
            //         }
            //         const responed = await forumSave(data)
            //         console.log('res', responed);
            //         if (responed.code == 0) {
            //             wx.showToast({
            //                 title: '回复成功',
            //                 icon: "none"
            //             })
            //             wx.navigateBack({
            //                 delta: 1
            //             })
            //         }
            //     }
            // })
        },
        // 清空所有
        clear() {
            this.editorCtx.clear({
                success: function (res) {
                    console.log("清空成功")
                }
            })
        },
        // 清除样式
        removeFormat() {
            this.editorCtx.removeFormat()
        },

        insertImg() {
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    const tempFilePaths = res.tempFilePaths;
                    this.editorCtx.insertImage({
                        src: tempFilePaths[0],
                        width: '100rpx',
                        height: '100rpx',
                        extClass: "charutupian"
                    })
                }
            })

        },
        // 记录样式
        format(e) {
            let {
                name,
                value
            } = e.target.dataset
            if (!name) return
            this.editorCtx.format(name, value)
        },
    }
})