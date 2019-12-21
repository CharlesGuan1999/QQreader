//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    motto: 'QQ聊天文件由此导入',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    filename: " ",
    path: " ",
    filedata: " ",
  },


  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

 addfile(){
   var tempFilePaths = 'Ha'
   var that = this
   wx.chooseMessageFile({
     count: 1,
     type: 'file',
     success(res) {
       var size = res.tempFiles[0].size;
       var filename = res.tempFiles[0].name;

       console.log(res.tempFiles[0].name)
       console.log(res.tempFiles[0])

       var newfilename = filename + "";

       if (size > 4194304 || newfilename.indexOf(".txt") == -1) {
         //限制文件具体大小及其类型
         wx.showToast({
           title: '文件大小不能超过4MB,格式必须为.txt！',
           icon: "none",
           duration: 2000,
           mask: true
         })
       }
        else {
         that.setData({
           path: res.tempFiles[0].path, //将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
           filename: filename              //渲染到wxml方便用户知道自己选择了什么文件
         })
       }
      }
     })
    },

  loadfile(){
    var that = this
    console.log(this.data.filedata)
    var mymanager = wx.getFileSystemManager()
    if (this.data.path == ' '){
      wx.showToast({
        title: '请先选择上传文件！',
        icon: "none",
        duration: 2000,
        mask: true
      })
      return
    } 

    mymanager.readFile({
      filePath: that.data.path,
      encoding: "utf-8",
      success(res){
        var filedata = res.data
        that.setData({
          filedata: filedata
        })
        wx.setStorage({
          key: 'filedata',
          data: filedata,
        })

      }
    })

    wx.redirectTo({
      url: "../preview/preview"
    })

  },

  generateQuestion(){
    
  }

})