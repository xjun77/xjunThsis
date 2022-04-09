// pages/login/login.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },
  onLoad:function(){
    
  },
  login() {
    let that = this
    if (that.data.username == '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (that.data.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: `${app.globalData.Apiurl}/user/login`,
      method: 'POST',
      data: {
        username: that.data.username,
        password: that.data.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.setStorageSync('user', res.data.user)
          // console.log(wx.getStorageSync('user'))
          app.globalData.user = res.data.user
          console.log(app.globalData.user)

          wx.showModal({
            title: 'success',
            showCancel: false,
            content: res.data.user.username + ',登录成功',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../home/home',
                  success: function (res) {
                    // success 
                    wx.showToast({
                      title: '登录成功',
                      icon: 'none',
                      duration: 2000
                    })
                  },
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: 'error',
            showCancel: false,
            content: res.data,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } 
            }
          })
        }
      }
    })

  }

})