// app.js
App({
    onLaunch() {
        const tabarList=[]
        const genPages=[]
    tabarList.push("kechengxinxi")
    tabarList.push("yujiaqicai")
        this.globalData.tabarList=tabarList
    },
    globalData: {
        name: null,
        goodsList: [],
        detailList: {},
        detailId: null,
        tabarList:[],
        userInfo:{},
        total:"",
        editorContent:''
    },

})