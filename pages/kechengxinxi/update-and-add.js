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
    kechengshipin:"",
        jiaolianzhanghaoIndex: null,
        jiaolianzhanghaoList: [],
    jiaolianxingming:"",
storeupnum: '0',
kechengjianjie:"",
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
if(o=='kechengjianjie'){
this.setData({
  'ruleForm.kechengjianjie' : obj[o],
})
ro.kechengjianjie = true;
continue;
}
if(o=='kechengshipin'){
this.setData({
  'ruleForm.kechengshipin' : obj[o],
})
ro.kechengshipin = true;
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
if(o=='storeupnum'){
this.setData({
  'ruleForm.storeupnum' : obj[o],
})
ro.storeupnum = true;
continue;
}
if(o=='clicktime'){
this.setData({
  'ruleForm.clicktime' : obj[o],
})
ro.clicktime = true;
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
     kechengjianjie: data.kechengjianjie,
     kechengshipin: data.kechengshipin,
     jiaolianzhanghao: data.jiaolianzhanghao,
        storeupnum: '0',

        clicktime:utils.getCurrentDate("yMDhms"),

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
    let jiaolianzhanghao= getApp().globalData.userInfo.jiaolianzhanghao
    ro.jiaolianzhanghao=true
    this.setData({
            jiaolianzhanghao,
    })
    sessionReadArr.push('jiaolianzhanghao')
    let jiaolianxingming= getApp().globalData.userInfo.jiaolianxingming
    ro.jiaolianxingming=true
    this.setData({
            jiaolianxingming,
    })
    sessionReadArr.push('jiaolianxingming')

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
























kechengjianjieInput(e) {
this.setData({
        kechengjianjie: e.detail.value // 每次输入变化时更新文本框的值
});
},









uploadkechengshipin() {
wx.chooseImage({
count: 1,
sizeType: ['compressed'],
sourceType: ['album', 'camera'],
success: async (res) => {
    const tempFilePaths = res.tempFilePaths;
    // 本地临时图片的路径
    this.setData({
            kechengshipinPath: tempFilePaths[0]
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
                        kechengshipin: 'file/' + result.file
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
























onclicktimeTap(){
this.setData({
    showclicktime: true,
})
},
clicktimeTap(e) {
this.setData({
    clicktime: e.detail.data
})

},






async submit() {
    let that = this
    var query = wx.createSelectorQuery();
    // 在 Page 中的某个方法中调用

    query.select('#kechengjianjie').boundingClientRect();
    query.exec(function (res) {
        //res就是 所有标签为v1的元素的信息 的数组
        that.setData({
        kechengjianjie: res[0].dataset.info
        })
    })




if(this.data.shangkeshijian=="请选择上课时间"){
this.setData({
        shangkeshijian:""
})

}








if(this.data.clicktime=="请选择最近点击时间"){
this.setData({
        clicktime:""
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
    kechengshipin: this.data. kechengshipin,
    jiaolianzhanghao: this.data. jiaolianzhanghao,
    jiaolianxingming: this.data. jiaolianxingming,
    storeupnum: this.data. storeupnum,
    kechengjianjie:this.data. kechengjianjie,
}
const detailId= getApp().globalData.detailId
const tableName= `kechengxinxi`

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















                            ruleForm['kechengshipin']=this.data.kechengshipin







                            ruleForm['jiaolianzhanghao']=this.data.jiaolianzhanghao



    if(this.data.jiaolianzhanghaoList[this.data.jiaolianzhanghaoIndex]==undefined ){
        wx.showToast({
            icon: "none",
            title: `教练账号不能为空`,
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
            let corssRes = await list(`kechengxinxi`, params)
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
await update(`kechengxinxi`, ruleForm)
}
else {
await add(`kechengxinxi`, ruleForm)
            }
        }


        }
        else {


//跨表计算
if (ruleForm.id) {
await update(`kechengxinxi`, ruleForm)
}
else {
await add(`kechengxinxi`, ruleForm)
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