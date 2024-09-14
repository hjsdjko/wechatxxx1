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

    kechengmingcheng:"",
    kechengfengmian:"",
        kechengfenleiList:"${column.customize}".split(','),
        kechengfenleiIndex:null,
    shangkeshijian:"请选择时间",
showshangkeshijian:false,
    shangkedidian:"",
    kechengjiage:"",
        jiaolianzhanghaoIndex: null,
        jiaolianzhanghaoList: [],
    jiaolianxingming:"",
    yuyueshijian:"请选择时间",
showyuyueshijian:false,
    yonghuzhanghao:"",
    yonghuxingming:"",
    shoujihaoma:"",
sfsh: '待审核',
    quxiaoshijian:"请选择时间",
showquxiaoshijian:false,
    quxiaoyuanyin:"",
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
const kechengfenleires = await option('kechengfenlei/kechengfenlei')
        kechengfenleires.data.unshift('请选择课程分类')
this.setData({
        kechengfenleiList: kechengfenleires.data
})
const jiaolianzhanghaores = await option('jiaolian/jiaolianzhanghao')
        jiaolianzhanghaores.data.unshift('请选择教练账号')
this.setData({
        jiaolianzhanghaoList: jiaolianzhanghaores.data
})


let  ro=this.data.ro
if(options?.cross){
var obj = wx.getStorageSync('crossObj');
for (var o in obj){
if(o=='kechengmingcheng'){
this.setData({
  'ruleForm.kechengmingcheng' : obj[o],
})
ro.kechengmingcheng = true;
continue;
}
if(o=='kechengfengmian'){
this.setData({
  kechengfengmianPath :baseURL+ obj[o].split(",")[0],
})
ro.kechengfengmian = true;
continue;
}
if(o=='kechengfenlei'){
this.setData({
  'ruleForm.kechengfenlei' : obj[o],
})
ro.kechengfenlei = true;
continue;
}
if(o=='shangkeshijian'){
this.setData({
  'ruleForm.shangkeshijian' : obj[o],
})
ro.shangkeshijian = true;
continue;
}
if(o=='shangkedidian'){
this.setData({
  'ruleForm.shangkedidian' : obj[o],
})
ro.shangkedidian = true;
continue;
}
if(o=='kechengjiage'){
this.setData({
  'ruleForm.kechengjiage' : obj[o],
})
ro.kechengjiage = true;
continue;
}
if(o=='jiaolianzhanghao'){
this.setData({
  'ruleForm.jiaolianzhanghao' : obj[o],
})
ro.jiaolianzhanghao = true;
continue;
}
if(o=='jiaolianxingming'){
this.setData({
  'ruleForm.jiaolianxingming' : obj[o],
})
ro.jiaolianxingming = true;
continue;
}
if(o=='yuyueshijian'){
this.setData({
  'ruleForm.yuyueshijian' : obj[o],
})
ro.yuyueshijian = true;
continue;
}
if(o=='yonghuzhanghao'){
this.setData({
  'ruleForm.yonghuzhanghao' : obj[o],
})
ro.yonghuzhanghao = true;
continue;
}
if(o=='yonghuxingming'){
this.setData({
  'ruleForm.yonghuxingming' : obj[o],
})
ro.yonghuxingming = true;
continue;
}
if(o=='shoujihaoma'){
this.setData({
  'ruleForm.shoujihaoma' : obj[o],
})
ro.shoujihaoma = true;
continue;
}
if(o=='quxiaoshijian'){
this.setData({
  'ruleForm.quxiaoshijian' : obj[o],
})
ro.quxiaoshijian = true;
continue;
}
if(o=='quxiaoyuanyin'){
this.setData({
  'ruleForm.quxiaoyuanyin' : obj[o],
})
ro.quxiaoyuanyin = true;
continue;
}
if(o=='crossuserid'){
this.setData({
  'ruleForm.crossuserid' : obj[o],
})
ro.crossuserid = true;
continue;
}
if(o=='crossrefid'){
this.setData({
  'ruleForm.crossrefid' : obj[o],
})
ro.crossrefid = true;
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
        kechengfenleires.data.map((item, index) => {
        if (item == data.kechengfenlei) {
            this.setData({
                    kechengfenleiIndex: index,
                    kechengfenlei: item
            })
        }else if (this.data.kechengfenleiList.length == 1) {
            this.setData({
                    kechengfenleiIndex: 0,
                    kechengfenlei: v
            })
        }
    })


        jiaolianzhanghaores.data.map((item, index) => {
        if (item == data.jiaolianzhanghao) {
            this.setData({
                    jiaolianzhanghaoIndex: index,
                    jiaolianzhanghao: item
            })
        }else if (this.data.jiaolianzhanghaoList.length == 1) {
            this.setData({
                    jiaolianzhanghaoIndex: 0,
                    jiaolianzhanghao: v
            })
        }
    })




const url = wx.getStorageSync("baseURL") + "/"
const detailList = data
this.setData({
detailList,
     kechengmingcheng: data.kechengmingcheng,
        kechengfengmian:data?.kechengfengmian?.split(',')[0],
        kechengfengmianPath:baseURL+data?.kechengfengmian?.split(',')[0],
        shangkeshijian:utils.getCurrentDate("yMDhms"),
     shangkedidian: data.shangkedidian,
     kechengjiage: data.kechengjiage,
     jiaolianzhanghao: data.jiaolianzhanghao,
        yuyueshijian:utils.getCurrentDate("yMDhms"),
     yonghuzhanghao: data.yonghuzhanghao,
     yonghuxingming: data.yonghuxingming,
     shoujihaoma: data.shoujihaoma,
        sfsh: '待审核',

     shhf: data.shhf,
        quxiaoshijian:utils.getCurrentDate("yMDhms"),
     quxiaoyuanyin: data.quxiaoyuanyin,
     crossuserid: data.crossuserid,
     crossrefid: data.crossrefid,

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
    let yonghuzhanghao= getApp().globalData.userInfo.yonghuzhanghao
    ro.yonghuzhanghao=true
    this.setData({
            yonghuzhanghao,
    })
    sessionReadArr.push('yonghuzhanghao')
    let yonghuxingming= getApp().globalData.userInfo.yonghuxingming
    ro.yonghuxingming=true
    this.setData({
            yonghuxingming,
    })
    sessionReadArr.push('yonghuxingming')
    let shoujihaoma= getApp().globalData.userInfo.shoujihaoma
    ro.shoujihaoma=true
    this.setData({
            shoujihaoma,
    })
    sessionReadArr.push('shoujihaoma')

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









this.setData({
        yuyueshijian:utils.getCurrentDate("yMDhms")
})







this.setData({
        quxiaoshijian:utils.getCurrentDate("yMDhms")
})




},





















uploadkechengfengmian() {
wx.chooseImage({
count: 1,
sizeType: ['compressed'],
sourceType: ['album', 'camera'],
success: async (res) => {
    const tempFilePaths = res.tempFilePaths;
    // 本地临时图片的路径
    this.setData({
            kechengfengmianPath: tempFilePaths[0]
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
                        kechengfengmian: 'file/' + result.file
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








async kechengfenleiChange(e) {
    const selectedIndex = e.detail.value;
    let  kechengfenlei=this.data.kechengfenleiList[selectedIndex]
    this.setData({
            kechengfenleiIndex: selectedIndex,
            kechengfenlei
    });},








onshangkeshijianTap(){
this.setData({
    showshangkeshijian: true,
})
},
shangkeshijianTap(e) {
this.setData({
    shangkeshijian: e.detail.data
})

},
























async jiaolianzhanghaoChange(e) {
const selectedIndex = e.detail.value;
let  jiaolianzhanghao=this.data.jiaolianzhanghaoList[selectedIndex]
this.setData({
        jiaolianzhanghaoIndex: selectedIndex,
        jiaolianzhanghao
});
const {
data
} = await follow('jiaolian/jiaolianzhanghao', jiaolianzhanghao)
    if(data.jiaolianxingming){
        this.setData({
                jiaolianxingming:data.jiaolianxingming
        })
    }

},
















onyuyueshijianTap(){
this.setData({
    showyuyueshijian: true,
})
},
yuyueshijianTap(e) {
this.setData({
    yuyueshijian: e.detail.data
})

},








































shhfInput(e) {
this.setData({
        shhf: e.detail.value // 每次输入变化时更新文本框的值
});
},









onquxiaoshijianTap(){
this.setData({
    showquxiaoshijian: true,
})
},
quxiaoshijianTap(e) {
this.setData({
    quxiaoshijian: e.detail.data
})

},






























async submit() {
    let that = this
    var query = wx.createSelectorQuery();




if(this.data.shangkeshijian=="请选择上课时间"){
this.setData({
        shangkeshijian:""
})

}





if(this.data.yuyueshijian=="请选择预约时间"){
this.setData({
        yuyueshijian:""
})

}






if(this.data.quxiaoshijian=="请选择取消时间"){
this.setData({
        quxiaoshijian:""
})

}




    const baseURL = wx.getStorageSync('baseURL') + "/"
    const regex = new RegExp(baseURL, "g");
const obj={
    kechengmingcheng: this.data. kechengmingcheng,
        kechengfengmian:this.data.kechengfengmian?.replace(regex, ""),
    kechengfenlei: this.data. kechengfenlei,
    shangkeshijian: this.data. shangkeshijian,
    shangkedidian: this.data. shangkedidian,
    kechengjiage: this.data. kechengjiage,
    jiaolianzhanghao: this.data. jiaolianzhanghao,
    jiaolianxingming: this.data. jiaolianxingming,
    yuyueshijian: this.data. yuyueshijian,
    yonghuzhanghao: this.data. yonghuzhanghao,
    yonghuxingming: this.data. yonghuxingming,
    shoujihaoma: this.data. shoujihaoma,
    sfsh: this.data. sfsh,
    quxiaoshijian: this.data. quxiaoshijian,
    quxiaoyuanyin: this.data. quxiaoyuanyin,
    crossuserid: this.data. crossuserid,
    crossrefid: this.data. crossrefid,
}
const detailId= getApp().globalData.detailId
const tableName= `yuyuequxiao`

//跨表计算判断
    var obj2;
    var  ruleForm=obj
    obj2 = ruleForm
    this.data.refid==""? ruleForm['refid']= getApp().globalData.detailId:""
    ruleForm['userid']=getApp().globalData.userInfo.id
    var userInfo=getApp().globalData.userInfo


const sessionReadArr=this.data.sessionReadArr
                            ruleForm['kechengmingcheng']=this.data.kechengmingcheng











    if(this.data.kechengfenleiList[this.data.kechengfenleiIndex]==undefined ){
        wx.showToast({
            icon: "none",
            title: `课程分类不能为空`,
        })
        return
    }




                            ruleForm['shangkeshijian']=this.data.shangkeshijian







                            ruleForm['shangkedidian']=this.data.shangkedidian











                            ruleForm['jiaolianzhanghao']=this.data.jiaolianzhanghao



    if(this.data.jiaolianzhanghaoList[this.data.jiaolianzhanghaoIndex]==undefined ){
        wx.showToast({
            icon: "none",
            title: `教练账号不能为空`,
        })
        return
    }




































                            ruleForm['quxiaoyuanyin']=this.data.quxiaoyuanyin


















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
            let corssRes = await list(`yuyuequxiao`, params)
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
await update(`yuyuequxiao`, ruleForm)
}
else {
await add(`yuyuequxiao`, ruleForm)
            }
        }


        }
        else {


//跨表计算
if (ruleForm.id) {
await update(`yuyuequxiao`, ruleForm)
}
else {
await add(`yuyuequxiao`, ruleForm)
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