// pages/showQA/showQA.js

Page({

  /**
   * Page initial data
   */
  data: {
    question: {},
    answer: {},
    listQue: [],
    listAns: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    
    //从storage中取出question和answer字典
    /*wx.getStorage({
      key: 'dicQ',
      success: function(res) {
        that.setData({
          question: res.data
        })
      },
    })
    */

    //从上一个页面获取到QA字典信息
    var temp = wx.getStorageSync('dicQ');
    this.setData({
      question: temp
    })
    console.log(this.data.question)

    temp = wx.getStorageSync('dicA');
    this.setData({
      answer: temp
    })
    console.log(this.data.answer)

    //设置data
    this.setData({
      listQue: this.data.question,
      listAns: this.data.answer, 
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})