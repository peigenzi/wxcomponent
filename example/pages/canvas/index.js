// pages/canvas/index.js
const util = require('../../utils/util');
let windowWidth;
let windowHeight;
const TEXT_COLOR = '#000';
const WHITE = '#fff';
const THEME_COLOR = '#ff555c';
const GRAY_COLOR = '#333';
const TINT_COLOR = '#747474';

const temp = 0.01;
// 图片长宽比
const scale = 1.78;
// 背景图高度
const bgScale = 0.5;
//头像和宽的比
const avatarWidthScale = 0.368;
const avatarHeightScale = 0.117;
//头像白色圆形背景
const avatarBgWidthScale = 0.38;
const avatarStrokeWidth = 4;
//昵称高度比
const nicknameHeightScale = 0.34 + 5 * temp;
//第一行文字高度
const topTextScale = 0.515 + 3 * temp;
//分享内容
const contentScale = 0.585 + 3 * temp;
const contentScale2 = 0.62 + 3 * temp;
//二维码直径
const qrCodeWidthScale = 0.341;
//二维码高度
const qrCodeHeightScale = 0.69;
//极客文字
const bpbScale = 0.91 + temp * 2;
//识别文字
const decodeScale = 0.935 + temp * 2;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailStr: {
      tip: 'canvas绘制,你值得拥有',
      content: '组件库-组件库',
      contentOther: 'canvas，canvas，canvas',
      bpbMini: '组件库演示小程序',
      clickToMini: '(开始学习)'
    },

    avatar:
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2136187651,870864669&fm=27&gp=0.jpg',
    nickname: '绘制哈哈哈哈哈哈哈',
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    targetSharePath: null,
    QRPath: '../../image/geek-qr.jpg',
    avatarPath: null,
    realShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    wx.getSystemInfo({
      success: function(res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowWidth * scale;

        self.setData({
          canvasHeight: windowHeight,
          imageWidth: windowWidth * 0.7,
          imageHeight: windowHeight * 0.7
        });
      }
    });
  },

  shareMemontListener() {
    this.shareMoments();
  },

  /**
   *  @desc 生成分享图到朋友圈
   */
  shareMoments() {
    if (this.data.targetSharePath) {
      this.setData({
        realShow: true
      });
    } else {
      wx.showLoading({
        title: '加载中'
      });
      this.downloadAvatar();
    }
  },

  showErrorModel: function(content) {
    this.hideLoading();
    if (!content) {
      content = '网络错误';
    }
    wx.showModal({
      title: '提示',
      content: content
    });
  },

  showLoading: function() {
    wx.showLoading({
      title: '加载中...'
    });
  },

  hideLoading: function() {
    wx.hideLoading();
  },

  downloadAvatar() {
    const self = this;

    wx.downloadFile({
      url: self.data.avatar,
      success: function(res) {
        self.setData({
          avatarPath: res.tempFilePath
        });
        self.drawImage();
        self.hideLoading();
      },
      fail: function() {
        self.showErrorModel();
      }
    });
  },

  drawImage() {
    const ctx = wx.createCanvasContext('myCanvas', this);
    let bgPath = './share-bg.png';
    ctx.setFillStyle(WHITE);
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    // 绘制背景图
    ctx.drawImage(bgPath, 0, 0, windowWidth, windowHeight * bgScale);

    ctx.arc(
      windowWidth / 2,
      (avatarWidthScale / 2) * windowWidth + avatarHeightScale * windowHeight,
      (avatarWidthScale / 2) * windowWidth + avatarStrokeWidth,
      0,
      2 * Math.PI
    );

    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      windowWidth / 2,
      (avatarWidthScale / 2) * windowWidth + avatarHeightScale * windowHeight,
      (avatarWidthScale / 2) * windowWidth,
      0,
      2 * Math.PI
    );
    ctx.setStrokeStyle(WHITE);
    ctx.stroke();
    ctx.clip();
    let avatarWidth = avatarWidthScale * windowWidth; //头像半径
    ctx.drawImage(
      this.data.avatarPath,
      windowWidth * (0.5 - avatarWidthScale / 2),
      avatarHeightScale * windowHeight,
      avatarWidth,
      avatarWidth
    );
    ctx.restore();

    ctx.setFillStyle(GRAY_COLOR);
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.fillText(
      this.data.detailStr.content,
      windowWidth / 2,
      contentScale * windowHeight
    );

    this.setFontStyle(ctx, 'bold');
    ctx.setFillStyle(WHITE);
    ctx.setFontSize(20);
    ctx.setTextAlign('center');
    ctx.fillText(
      util.stringNum(this.data.nickname),
      windowWidth / 2,
      nicknameHeightScale * windowHeight
    );

    //绘制到canvas上
    ctx.draw(false, () => {
      this.saveCanvasImage();
    });
  },

  setFontStyle: function(ctx, fontWeight) {
    if (wx.canIUse('canvasContext.font')) {
      ctx.font = 'normal ' + fontWeight + ' ' + '14px' + ' sans-serif';
    }
  },

  // 转化为图片
  saveCanvasImage() {
    const self = this;

    wx.canvasToTempFilePath(
      {
        canvasId: 'myCanvas',
        success: function(res) {
          self.setData({
            targetSharePath: res.tempFilePath,
            realShow: true
          });
        },
        complete: function() {}
      },
      this
    );
  },

  /**
   *  @desc 保存到相册
   */
  saveImageTap() {
    this.requestAlbumScope();
  },

  /**
   * 检测相册权限
   */
  requestAlbumScope() {
    const self = this;

    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          self.saveImageToPhotosAlbum();
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function(res) {
              self.saveImageToPhotosAlbum();
            },
            fail: function() {
              wx.showModal({
                title: '提示',
                content: '你需要授权才能保存图片到相册',
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function(res) {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          self.saveImageToPhotosAlbum();
                        } else {
                        }
                      },
                      fail: function() {}
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  },

  saveImageToPhotosAlbum() {
    const self = this;

    wx.saveImageToPhotosAlbum({
      filePath: this.data.targetSharePath,
      success: function() {
        wx.showModal({
          title: '',
          content: '保存成功',
          showCancel: false
        });

        self.hideDialog();
      }
    });
  },

  closeModal: function() {
    this.hideDialog();
  },

  hideDialog: function() {
    this.setData({
      realShow: false
    });
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
