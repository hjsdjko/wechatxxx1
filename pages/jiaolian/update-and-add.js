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

    jiaolianzhanghao:"",
    jiaolianmima:"",
    jiaolianxingming:"",
    zhaopian:"",
        xingbieList:"男,女".split(','),
        xingbieIndex:null,
    lianxidianhua:"",
    shenfenzhenghao:"",
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
this.setData({
        xingbieList:  "男,女".split(',')
})



let  ro=this.data.ro
if(options?.cross){
var obj = wx.getStorageSync('crossObj');
for (var o in obj){
if(o=='jiaolianzhanghao'){
this.setData({
  'ruleForm.jiaolianzhanghao' : obj[o],
})
ro.jiaolianzhanghao = true;
continue;
}
if(o=='jiaolianmima'){
this.setData({
  'ruleForm.jiaolianmima' : obj[o],
})
ro.jiaolianmima = true;
continue;
}
if(o=='jiaolianxingming'){
this.setData({
  'ruleForm.jiaolianxingming' : obj[o],
})
ro.jiaolianxingming = true;
continue;
}
if(o=='zhaopian'){
this.setData({
  zhaopianPath :baseURL+ obj[o].split(",")[0],
})
ro.zhaopian = true;
continue;
}
if(o=='xingbie'){
this.setData({
  'ruleForm.xingbie' : obj[o],
})
ro.xingbie = true;
continue;
}
if(o=='lianxidianhua'){
this.setData({
  'ruleForm.lianxidianhua' : obj[o],
})
ro.lianxidianhua = true;
continue;
}
if(o=='shenfenzhenghao'){
this.setData({
  'ruleForm.shenfenzhenghao' : obj[o],
})
ro.shenfenzhenghao = true;
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
const  def_5= null  ;
    this.data.xingbieList.map((v, index) => {
        if (v == data.xingbie|| (v == def_5 && def_5 !=null)) {
            this.setData({
                    xingbieIndex: index,
                    xingbie: v
            })
        }else if (this.data.xingbieList.length == 1) {
            this.setData({
                    xingbieIndex: 0,
                    xingbie: v,
                    xingbieList:[def_5]
            })
        }
    })




const url = wx.getStorageSync("baseURL") + "/"
const detailList = data
this.setData({
detailList,
     jiaolianzhanghao: data.jiaolianzhanghao,
     jiaolianmima: data.jiaolianmima,
     jiaolianxingming: data.jiaolianxingming,
        zhaopian:data?.zhaopian?.split(',')[0],
        zhaopianPath:baseURL+data?.zhaopian?.split(',')[0],
     lianxidianhua: data.lianxidianhua,
     shenfenzhenghao: data.shenfenzhenghao,

});
//ss读取
let c = this.data
this.setData({
});

}else {
    this.setData({
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





































uploadzhaopian() {
wx.chooseImage({
count: 1,
sizeType: ['compressed'],
sourceType: ['album', 'camera'],
success: async (res) => {
    const tempFilePaths = res.tempFilePaths;
    // 本地临时图片的路径
    this.setData({
            zhaopianPath: tempFilePaths[0]
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
                        zhaopian: 'file/' + result.file
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








async xingbieChange(e) {
    const selectedIndex = e.detail.value;
    let  xingbie=this.data.xingbieList[selectedIndex]
    this.setData({
            xingbieIndex: selectedIndex,
            xingbie
    });},






















async submit() {
    let that = this
    var query = wx.createSelectorQuery();








    const baseURL = wx.getStorageSync('baseURL') + "/"
    const regex = new RegExp(baseURL, "g");
const obj={
    jiaolianzhanghao: this.data. jiaolianzhanghao,
    jiaolianmima: this.data. jiaolianmima,
    jiaolianxingming: this.data. jiaolianxingming,
        zhaopian:this.data.zhaopian?.replace(regex, ""),
    xingbie: this.data. xingbie,
    lianxidianhua: this.data. lianxidianhua,
    shenfenzhenghao: this.data. shenfenzhenghao,
}
const detailId= getApp().globalData.detailId
const tableName= `jiaolian`

//跨表计算判断
    var obj2;
    var  ruleForm=obj
    obj2 = ruleForm
    this.data.refid==""? ruleForm['refid']= getApp().globalData.detailId:""
    ruleForm['userid']=getApp().globalData.userInfo.id
    var userInfo=getApp().globalData.userInfo


const sessionReadArr=this.data.sessionReadArr
                            ruleForm['jiaolianzhanghao']=this.data.jiaolianzhanghao







                            ruleForm['jiaolianmima']=this.data.jiaolianmima







                            ruleForm['jiaolianxingming']=this.data.jiaolianxingming











    if(this.data.xingbieList[this.data.xingbieIndex]==undefined ){
        wx.showToast({
            icon: "none",
            title: `性别不能为空`,
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
            let corssRes = await list(`jiaolian`, params)
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
await update(`jiaolian`, ruleForm)
}
else {
await add(`jiaolian`, ruleForm)
            }
        }


        }
        else {


//跨表计算
if (ruleForm.id) {
await update(`jiaolian`, ruleForm)
}
else {
await add(`jiaolian`, ruleForm)
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