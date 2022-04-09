const app = getApp();
const qiniuUploader = require("../../lib/qiniuUploader.js");
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    imgList: "",
    checked: true,
    email: "",
    phone: "",
    sex: "男",
    slog: "",
    token: "",
    domain: "http://cdn.xjun.cloud",
  },
  onLoad() {
    let that = this;
    wx.request({
      url: `${app.globalData.Apiurl}/article/upload`,
      method: "GET",
      success(res) {
        that.setData({
          token: res.data,
        });
        console.log(that.data.token);
      },
    });

    wx.request({
      url:
        `${app.globalData.Apiurl}/user/getdetail?username=` +
        app.globalData.user.username,
      method: "GET",
      success(res) {
        if (res.statusCode == 200) {
          let email = res.data.email || "";
          let phone = res.data.phone || "";
          let sex = res.data.sex || "女";
          let slog = res.data.slog || "";
          let imgList = res.data.avatar || "";
          if (sex == "女") {
            that.setData({
              checked: false,
            });
          }
          that.setData({
            email: email,
            sex: sex,
            phone: phone,
            slog: slog,
            imgList: imgList,
          });
        }
      },
    });
  },
  saveDetail() {
    let that = this;
    if (that.data.imgList == "") {
      wx.showModal({
        content: "请选择头像",
        confirmText: "确定",
        showCancel: false,
      });
      return;
    }
    wx.request({
      url: `${app.globalData.Apiurl}/user/detail`,
      method: "POST",
      data: {
        username: app.globalData.user.username,
        email: that.data.email,
        phone: that.data.phone,
        slog: that.data.slog,
        sex: that.data.sex,
        avatar: that.data.imgList,
      },
      success(res) {
        console.log(res);
        if (res.statusCode == 200) {
          wx.showModal({
            content: "保存成功",
            confirmText: "确定",
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                });
              }
            },
          });
        }
      },
    });
  },
  updateImg: function (filePath, uptoken) {
    var that = this;
    var pathX = filePath + "";
    var qiniu_key = "wximage/" + Date.parse(new Date()) / 100 + ".jpg";

    qiniuUploader.upload(
      pathX,
      (res) => {
        // 将图片url上传给服务器
        if (that.data.domain[that.data.domain.length - 1] == "/") {
          that.setData({
            imgList: that.data.domain + qiniu_key,
          });
          console.log("avatar_url:" + that.data.userAvatar);
        } else {
          that.setData({
            imgList: that.data.domain + "/" + qiniu_key,
          });
        }
        // 图片上传成功之后取消加载框
        wx.hideLoading();
      },
      (error) => {
        // // 图片上传失败之后取消加载框
        wx.hideLoading();
        // // 把图片更改回来
        that.setData({
          imgList: "",
        });
        console.log(error);
      },
      {
        key: qiniu_key,
        region: "SCN",
        uptoken: that.data.token, // 从自己的服务器获取
        uploadURL: "https://upload-z2.qiniup.com", // 从自己的服务器获取
        domain: that.data.domain, // 从自己的服务器获取
      }
    );
  },
  checkChange(e) {
    if (e.detail.value == false) {
      this.setData({
        sex: "女",
      });
    } else {
      this.setData({
        sex: "男",
      });
    }
  },
  ChooseImage() {
    let that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album"], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths);
        wx.showLoading({
          title: "上传中",
          mask: true,
        });
        that.updateImg(res.tempFilePaths, that.data.token);
        // if (this.data.imgList.length != 0) {
        //   this.setData({
        //     imgList: this.data.imgList.concat(res.tempFilePaths)
        //   })
        // } else {
        //   wx.showLoading({
        //     title: '上传中',
        //     mask: true
        //   })

        //   that.updateImg(res.tempFilePaths, that.data.token)
        //   this.setData({
        //     imgList: res.tempFilePaths
        //   })
        // }
      },
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url,
    });
  },
  DelImg(e) {
    wx.showModal({
      content: "确定要删除？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            imgList: "",
          });
        }
      },
    });
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value,
    });
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value,
    });
  },
});
