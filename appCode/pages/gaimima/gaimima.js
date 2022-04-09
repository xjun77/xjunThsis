// pages/gaimima/gaimima.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldpassword:'',
    password:'',
    regpassword:''
  },


  submit(){
    let that = this
    if(this.data.oldpassword == ''){
      wx.showToast({
        title: '请输入原密码!',
        icon:'none'
      })
      return
    }
    if(this.data.password.length<6 || this.data.regpassword.length<6){
      wx.showToast({
        title: '密码应大于6位!',
        icon:'none'

      })
      return
    }
    if(this.data.password != this.data.regpassword){
      wx.showToast({
        title: '两次输入不一致!',
        icon:'none'

      })
      return
    }
    wx.request({
      url: `${app.globalData.Apiurl}/user/password`,
      method: 'POST',
      data: {
        username: app.globalData.user.username,
        password: that.data.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.statusCode == 200){
          wx.showModal({
            content: '修改成功',
            confirmText: '确定',
            showCancel:false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})