// pages/qrcode/index.js
const Qr = require('./qrcode');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden: false,
    imagePath: ''
  },

  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    Qr.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },

  canvasToTempImage: function() {
    var that = this;
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath
          // canvasHidden:true
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  previewImg: function(e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.createQrCode('qr二维码&测试=1&name=2', 'mycanvas', 300, 300);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
