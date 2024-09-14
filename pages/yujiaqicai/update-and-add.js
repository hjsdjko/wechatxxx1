// pages/edit/edit.js
const {
detail,
option,
update,
add,
list,
    follow,
    faceMatch,
    session,
    rubbish,
    baiduIdentify
} = require("../../api/index.js")

const des = require('../../utils/des.js')
const utils = require("../../utils/index.js")

Page({

/**
* 页面的初始数据
*/
data: {
    baseURL:'',
    sessionReadArr:[],

detailList: null,
id: "",
cross:"",
ruleForm:{},
userid:getApp().globalData.userInfo.id,
userInfo:getApp().globalData.userInfo,
ro:{
},

    qicaibianhao:"",
    qicaimingcheng:"",
    qicaitupian:"",
shiyongfangfa:"",
shiyongxiaoguo:"",
},

    // 监听 yiwanjiage 字段的变化
    watch: {

    },
/**
* 生命周期函数--监听页面加载
*/
async onLoad(options) {
    if(!this.data.userid){
        let nowTable = wx.getStorageSync("nowTable");
        const res = await session(nowTable)
        getApp().globalData.userInfo=res.data
    }
    let baseURL =wx.getStorageSync('baseURL') + '/'
const id = getApp().globalData.detailId
    this.setData({
        refid:id,
        baseURL
    })
//人脸识别


let  ro=this.data.ro
if(options?.cross){
var obj = wx.getStorageSync('crossObj');
for (var o in obj){
if(o=='qicaibianhao'){
this.setData({
  'ruleForm.qicaibianhao' : obj[o],
})
ro.qicaibianhao = true;
continue;
}
if(o=='qicaimingcheng'){
this.setData({
  'ruleForm.qicaimingcheng' : obj[o],
})
ro.qicaimingcheng = true;
continue;
}
if(o=='qicaitupian'){
this.setData({
  qicaitupianPath :baseURL+ obj[o].split(",")[0],
})
ro.qicaitupian = true;
continue;
}
if(o=='shiyongfangfa'){
this.setData({
  'ruleForm.shiyongfangfa' : obj[o],
})
ro.shiyongfangfa = true;
continue;
}
if(o=='shiyongxiaoguo'){
this.setData({
  'ruleForm.shiyongxiaoguo' : obj[o],
})
ro.shiyongxiaoguo = true;
continue;
}
if(o=='qicaijieshao'){
this.setData({
  'ruleForm.qicaijieshao' : obj[o],
})
ro.qicaijieshao = true;
continue;
}
}
  let  statusColumnName=wx.getStorageSync('statusColumnName');
    statusColumnName=statusColumnName.replace('[',"").replace(']',"");
    this.setData({
        ro,
        cross:options?.cross,
        statusColumnName
    })
}

if(id){
// 如果上一级页面传递了id，获取改id数据信息
const   data=getApp().globalData.detailList


const url = wx.getStorageSync("baseURL") + "/"
const detailList = data
this.setData({
detailList,
       'ro.qicaibianhao':true,
        qicaibianhao: data.qicaibianhao ? data.qicaibianhao  : this.getUUID(),
     qicaimingcheng: data.qicaimingcheng,
        qicaitupian:data?.qicaitupian?.split(',')[0],
        qicaitupianPath:baseURL+data?.qicaitupian?.split(',')[0],
     shiyongfangfa: data.shiyongfangfa,
     shiyongxiaoguo: data.shiyongxiaoguo,
     qicaijieshao: data.qicaijieshao,

});
//ss读取
let c = this.data
this.setData({
});

}else {
    this.setData({
qicaibianhao: this.getUUID(),
    })
}



// ss读取
let sessionReadArr=[]

this.setData({
cross:options?.cross,
ro,
id,
 sessionReadArr

})




},

getUUID () {
return new Date().getTime();
},
onUnload: function () {
console.log('页面被卸载，执行销毁操作');
},
onShow() {






},





























uploadqicaitupian() {
wx.chooseImage({
count: 1,
sizeType: ['compressed'],
sourceType: ['album', 'camera'],
success: async (res) => {
    const tempFilePaths = res.tempFilePaths;
    // 本地临时图片的路径
    this.setData({
            qicaitupianPath: tempFilePaths[0]
    })
    let _this = this;
    // 上传网络图片
    const baseURL = wx.getStorageSync('baseURL')
    wx.uploadFile({
        url: `${baseURL}/file/upload`,
        filePath: res.tempFilePaths[0],
        name: 'file',
        header: {
            'Token': wx.getStorageSync('token')
        },
        success: (uploadFileRes) => {
            let result = JSON.parse(uploadFileRes.data);
            // result.file是上传成功为网络图片的名称
            if (result.code == 0) {
                this.setData({
                        qicaitupian: 'file/' + result.file
                })
            } else {
                wx.showToast({
                    title: result.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }
    })

    this.setData({
        face: tempFilePaths[0]
    });

}
})
},








shiyongfangfaInput(e) {
this.setData({
        shiyongfangfa: e.detail.value // 每次输入变化时更新文本框的值
});
},









shiyongxiaoguoInput(e) {
this.setData({
        shiyongxiaoguo: e.detail.value // 每次输入变化时更新文本框的值
});
},















async submit() {
    let that = this
    var query = wx.createSelectorQuery();
    // 在 Page 中的某个方法中调用

    query.select('#shiyongfangfa').boundingClientRect();
    query.exec(function (res) {
        //res就是 所有标签为v1的元素的信息 的数组
        that.setData({
        shiyongfangfa: res[0].dataset.info
        })
    })
    // 在 Page 中的某个方法中调用

    query.select('#shiyongxiaoguo').boundingClientRect();
    query.exec(function (res) {
        //res就是 所有标签为v1的元素的信息 的数组
        that.setData({
        shiyongxiaoguo: res[0].dataset.info
        })
    })







    const baseURL = wx.getStorageSync('baseURL') + "/"
    const regex = new RegExp(baseURL, "g");
const obj={
    qicaibianhao: this.data. qicaibianhao,
    qicaimingcheng: this.data. qicaimingcheng,
        qicaitupian:this.data.qicaitupian?.replace(regex, ""),
        qicaijieshao: getApp().globalData.editorContent,
    shiyongfangfa:this.data. shiyongfangfa,
    shiyongxiaoguo:this.data. shiyongxiaoguo,
}
const detailId= getApp().globalData.detailId
const tableName= `yujiaqicai`

//跨表计算判断
    var obj2;
    var  ruleForm=obj
    obj2 = ruleForm
    this.data.refid==""? ruleForm['refid']= getApp().globalData.detailId:""
    ruleForm['userid']=getApp().globalData.userInfo.id
    var userInfo=getApp().globalData.userInfo


const sessionReadArr=this.data.sessionReadArr




                            ruleForm['qicaimingcheng']=this.data.qicaimingcheng























   let qicaijieshao=  getApp().globalData.editorContent
    ruleForm['qicaijieshao']=getApp().globalData.editorContent
    if(qicaijieshao==='' ){
        wx.showToast({
            icon: "none",
            title: `器材介绍不能为空`,
        })
        return
    }



    //更新跨表属性
    var crossuserid;
    var crossrefid;
    var crossoptnum;

    if(this.data.cross) {
        wx.setStorageSync('crossCleanType', true);
        var statusColumnName = wx.getStorageSync('statusColumnName');
        if (statusColumnName != '') {
                obj2 = wx.getStorageSync('crossObj');
            if (!statusColumnName.startsWith("[")) {
                for (var o in obj2) {
                    if (o == statusColumnName) {
                        obj2[o] = statusColumnValue;
                    }

                }
                var table = wx.getStorageSync('crossTable');
                 await update(table, obj2)
            } else {

                crossuserid =getApp().globalData.userInfo.id
                crossrefid =  this.data.id
                crossoptnum = wx.getStorageSync('statusColumnName');
                crossoptnum = crossoptnum.replace(/\[/, "").replace(/\]/, "");
                            }
        }
    }
    this.data.cross ? (crossrefid = this.data.id, crossuserid = getApp().globalData.userInfo.id) : ""

        if(crossrefid && crossuserid) {
            ruleForm['crossuserid'] = getApp().globalData.userInfo.id
            ruleForm['crossrefid'] =this.data.id

            this.setData({
                ruleForm
            })
            let params = {
                page: 1,
                limit: 10,
                crossuserid: crossuserid,
                crossrefid: crossrefid,
            }
                        const tips = wx.getStorageSync('tips')
            let corssRes = await list(`yujiaqicai`, params)
            crossoptnum = wx.getStorageSync('statusColumnName');
            crossoptnum = crossoptnum.match(/\d+/g);
            if (corssRes.data.total >= parseInt(crossoptnum)) {
                wx.showToast({
                    icon: "none",
                    title: tips,
                })
                                wx.removeStorageSync('crossCleanType');
                return ;
            }
            else {


//跨表计算






if (ruleForm.id) {
await update(`yujiaqicai`, ruleForm)
}
else {
await add(`yujiaqicai`, ruleForm)
            }
        }


        }
        else {


//跨表计算
if (ruleForm.id) {
await update(`yujiaqicai`, ruleForm)
}
else {
await add(`yujiaqicai`, ruleForm)
            }
        }
getApp().globalData.editorContent=''
wx.showToast({
title: '提交成功',
icon: "none"
})
    const preId = getApp().globalData.detailId


        let res = await detail(table, preId)
    if(res){
        getApp().globalData.detailList = res.data
    }


            wx.navigateBack({
                delta: 1,
                complete: () => {
                    // 触发事件通知，传递需要更新的数据
                    const pages = getCurrentPages();
                    if (pages.length >= 1) {
                        const prePage = pages[pages.length - 1];
                        prePage.onLoad(); //
                    }
                }
            })













 },

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