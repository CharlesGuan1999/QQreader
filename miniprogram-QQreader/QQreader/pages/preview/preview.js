// pages/preview/preview.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    text: " ",
    time: " ",
    name: " ",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    app.iterator = 0;

    var that = this
    var data = wx.getStorage({
      key: 'filedata',
      success: function (res) {
        console.log('Success')
        that.setData({
          text: res.data,
        })
      },
    })
  },


  answerG: function (idA, text, dicA) {
    var answer = ""
    var temp

    //读取答案
    while (text[app.iterator] != '#') {
      answer += text[app.iterator];
      app.iterator++
      //注意如果达到文件尾部,直接退出循环
      if (app.iterator == text.length) {
        break
      }
    }
    app.iterator++

    //将answer加入列表
    temp = {
      id: idA,
      name: this.data.name,
      content: answer,
      time: this.data.time,
    }
    dicA.push(temp)
  },


  questionG: function (idQ, text, dicQ) {
    var question = ""
    var temp

    //读取问题
    while (text[app.iterator] != '#') {
      question += text[app.iterator];
      app.iterator++
      //注意如果达到文件尾部,直接退出循环
      if (app.iterator == text.length) {
        break
      }
    }
    app.iterator++ ,

      //将question加入列表
      temp = {
        id: idQ,
        name: this.data.name,
        content: question,
        time: this.data.time,
      }
    dicQ.push(temp)
  },


  getTN: function (iterator) {
    //此对话段的说话人、说话时间
    var time = ""
    var name = ""
    //状态机所处状态, 初态为1
    var status = 1
    //读头指针指向的值
    var value
    //是否读取到说话人和说话时间
    var isReadTN = false
    //记录状态重复次数
    var cycle = 0
    //记录读取过程是否失败
    var isReadFailed = false
    //没有到文件头就继续循环
    for (iterator; iterator >= 0; iterator--) {

      //时间和说话人都已经接受，退出循环
      if (isReadTN) {
        break
      }
      //读取失败,重置time和name
      if (isReadFailed) {
        this.setData({
          name: "",
          time: ""
        })
        isReadFailed = false
      }

      //取出读头指针得到的值
      value = this.data.text[iterator]
      switch (status) {

        case 1:
          if (value == ')') {
            status = 2
          }
          break

        case 2:
          // 进入读取QQ号阶段
          if (value >= '0' && value <= '9') {
            break
          }
          else if (value == '(') {
            status = 3
          }
          else {
            //读到错误的数据，status置初态
            status = 1
          }
          break

        case 3:
          //进入识别名字阶段
          //名字不得包含空格，否则将识别失败
          if (value == ' ') {
            this.setData({
              name: name
            })
            status = 4
          }
          //名字的长度超过50，则识别失败，置为初态
          if (cycle == 50) {
            status = 1
          }
          //存储姓名
          name = value + name
          cycle++
          break

        case 4:
          //识别时间阶段
          if (value >= '0' && value <= '9') {
            time = value + time
          }
          else if (value == ':') {
            status = 5
            time = value + time
          }
          else {
            //读到错误的数据，status置初态
            status = 1
            //将姓名中的数据也清空
            isReadFailed = true
          }
          break

        case 5:
          if (value >= '0' && value <= '9') {
            time = value + time
          }
          else if (value == ':') {
            status = 6
            time = value + time
          }
          else {
            //读到错误的数据，status全部置位初态
            status = 1
            isReadFailed = true
          }
          break

        case 6:
          if (value >= '0' && value <= '9') {
            time = value + time
          }
          else if (value == ' ') {
            status = 7
            time = value + time
          }
          else {
            //读到错误的数据，status置位初态
            status = 1
            isReadFailed = true
          }
          break

        case 7:
          if (value >= '0' && value <= '9') {
            time = value + time
          }
          else if (value == '-') {
            status = 8
            time = value + time
          }
          else {
            status = 1
            isReadFailed = true
          }
          break

        case 8:
          if (value >= '0' && value <= '9') {
            time = value + time
          }
          else if (value == '-') {
            status = 9
            time = value + time
          }
          else {
            status = 1
            isReadFailed = true
          }
          break

        case 9:
          if (value >= '0' && value <= '9') {
            time = value + time
          }
          else if (value == '\n') {
            status = 10
            //时间读取成功！
            this.setData({
              time: time
            })
            //置状态标志
            isReadTN = true
          }
          else {
            status = 1
            isReadFailed = true
          }
          break
      }
    }
    // 如果读取到了说话人和说话时间，返回true
    // 反之如果未读取到，说明全文读取完毕未能找到
    return isReadTN
  },

  generate: function () {
    var text = String(this.data.text)
    console.log(text.length)

    var idQ = ""
    var idA = ""
    //接受Q和A的字典
    var dicQ = []
    var dicA = []
    //记录索引位置
    var index

    for (app.iterator; app.iterator < text.length; app.iterator++) {
      //问题的格式为 "#? + [id.] + [问题内容] + #"
      //问题的id值由问题人自由确定，id后的.可以省略
      if (text[app.iterator] == '#' && text[app.iterator + 1] == '?') {
        //每一次发现问题开始之前id置为空
        idQ = ""
        //向前寻找到说话人和说话时间
        //如果没有找到则全部置为默认
        if (!this.getTN(app.iterator - 1)) {
          this.setData({
            name: "Default",
            time: "Default"
          })
        }
        app.iterator = app.iterator + 2
        //记录此时索引位置，以防错误发生
        index = app.iterator
        while (text[app.iterator] >= '0' && text[app.iterator] <= '9' && text[app.iterator] != '.') {
          idQ = idQ + text[app.iterator]
          app.iterator++
          //到达text末尾，却没有找到. ，并且一直为数字，id置为None
          if (app.iterator == text.length) {
            idQ = 'None'
            app.iterator = index
            break
          }
        }
        //如果是正常检测到.并退出循环
        if (text[app.iterator] == '.') {
          app.iterator++
        }
        this.questionG(idQ, text, dicQ)
      }
      //回答的格式为 "#!+ [id.] + [问题内容] + #"
      else if (text[app.iterator] == '#' && text[app.iterator + 1] == '!') {
        idA = ""
        if (!this.getTN(app.iterator - 1)) {
          this.setData({
            name: "Default",
            time: "Default"
          })
        }
        app.iterator = app.iterator + 2
        //记录此时索引位置，以防错误发生
        index = app.iterator
        while (text[app.iterator] >= '0' && text[app.iterator] <= '9' && text[app.iterator] != '.') {
          idA = idA + text[app.iterator]
          app.iterator++
          if (app.iterator == text.length) {
            idA = 'None'
            app.iterator = index
            break
          }
        }
        //如果是正常检测到.并退出循环
        if (text[app.iterator] == '.') {
          app.iterator++
        }
        this.answerG(idA, text, dicA)
      }
    }

    console.log(dicQ)
    console.log(dicA)

    wx.setStorage({
      key: 'dicA',
      data: dicA,
    })

    wx.setStorage({
      key: 'dicQ',
      data: dicQ,
    })

    wx.redirectTo({
      url: '../showQA/showQA',
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