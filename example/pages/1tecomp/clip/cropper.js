// 剪切框的默认高宽比_业务需求 剪裁特定高宽比的图片作为XXX 因为显示的时候回按比例显示
var cutHWRadio = 2; //如果此值不为0 则只能按照比率变换裁剪框的大小

var innerW = wx.getSystemInfoSync().windowWidth;
var innerH = wx.getSystemInfoSync().windowHeight;

//容器的高度70%
var windowHRPX = wx.getSystemInfoSync().windowHeight * 0.7;
//屏幕的宽度  容器的宽度
var windowWRPX = wx.getSystemInfoSync().windowWidth * 0.7;
windowHRPX = windowWRPX;

// 拖动时候的 pageX
var pageX = 0;
// 拖动时候的 pageY
var pageY = 0;

//设备的像素比
var pixelRatio = wx.getSystemInfoSync().pixelRatio;

// 调整大小时候的 pageX
var sizeConfPageX = 0;
// 调整大小时候的 pageY
var sizeConfPageY = 0;

var initDragCutW = 0;
var initDragCutL = 0;
var initDragCutH = 0;
var initDragCutT = 0;

// 移动时 手势位移与 实际元素位移的比
var dragScaleP = 1;

//剪切框的高宽比
var cutHWScale = 2;

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //裁剪图片的高宽比是否固定 默认可调控(active)  另 fixed
    cutScaleStatus: {
      type: String,
      value: 'active'
    },
    //裁剪的高宽比 默认为1  如何cut-scale-status为active 此参数无效
    cutScale: {
      type: Number,
      value: 1
    },

    imageSrc: {
      type: String,
      value:
        'http://tmp/wx5be5b716194d82a7.o6zAJs4gK1fw4eX36MDM5hHZS3DU.Z7R3AYmlnXubf2b17a35dfb1ac30bb41f0883a990e9c.jpg'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //图片的地址
    // imageSrc: '',
    returnImage: '',
    // 初始化的宽高
    cropperInitW: windowWRPX,
    cropperInitH: windowHRPX,
    // 图片的宽高
    cropperW: windowWRPX,
    cropperH: windowHRPX,

    // 图片缩放值
    scaleP: 0,
    imageW: 0,
    imageH: 0,

    // 裁剪框 宽高
    cutW: 0,
    cutH: 0,
    cutL: 0,
    cutT: 0,

    //固定裁剪框的比例_截取固定比例的图片
    fixedRatio: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //图片初始化
    imgageInit: function(imageSrc) {
      let _this = this;

      wx.showLoading({
        title: '图片加载中...'
      });

      wx.getImageInfo({
        src: imageSrc,
        success: function(res) {
          //高度比上宽度...容器高度固定
          var innerAspectRadio = res.height / res.width;
          //图片及容器高宽  left top
          var cropperH;
          var cropperW;

          //图片的真实高宽 及缩放比例  写入画布需要
          var imageW;
          var imageH;
          var scaleP;

          // 根据图片的宽高显示不同的效果   保证图片可以正常显示
          //>1表示 高度大于宽度  就不能缩小宽度 需要缩小高度
          if (innerAspectRadio >= 1) {
            //图片的高宽  left top
            cropperH = windowHRPX;

            cropperW = cropperH / innerAspectRadio;

            // imageH = res.height * pixelRatio;
            // imageW = imageH / innerAspectRadio;
          } else {
            cropperW = windowWRPX;
            cropperH = cropperW * innerAspectRadio;
          }

          imageW =
            res.width * pixelRatio > windowWRPX
              ? windowWRPX
              : res.height * pixelRatio;
          imageH = imageW * innerAspectRadio;
          scaleP = res.width / imageW; //缩放比例=原独立(css)像素/物理像素

          //console.log("imageW:" + imageW + "....imageH" + imageH);

          //剪切框的高宽  left top
          //默认为图片宽度的50%;__一般手机显示宽度小于高度，所以以宽度为固定来去高度更直观
          var cutW = cropperW * 0.5;
          //高度按照比例来
          var cutH = cutW * _this.data.cutScale;

          // cutHWScale = _this.data.cutScale;
          // var cutL = (cropperW - cutW) * 0.5;
          // var cutT = (cropperH - cutH) * 0.5;

          //裁剪框覆盖整张图片
          var cutW = cropperW;
          var cutH = cropperH;
          var cutL = 0;
          var cutT = 0;

          _this.setData({
            cropperH: cropperH,
            cropperW: cropperW,

            // 裁剪框
            cutW: cutW,
            cutH: cutH,
            cutL: cutL,
            cutT: cutT,
            // 图片缩放值
            scaleP: scaleP,
            // 图片原始宽度 rpx  会超出界限
            //imageW: res.width * pixelRatio,
            //imageH: res.height * pixelRatio
            imageW: imageW,
            imageH: imageH
          });
          // console.log("缩放值:" + res.width * pixelRatio / windowWRPX + "    原始高宽:" + res.width * pixelRatio + " " + res.height * pixelRatio);

          //改变剪切框的比例
          _this.changeCutHWScale();
        },
        complete: function() {
          wx.hideLoading();
        },
        fail: function(e) {
          console.log(e);
        }
      });
    },

    //改变剪切框的高宽比例
    scaleChange: function(e) {
      //console.log(e);
      var scale = e.detail.value;
      var reg = /^\d+(\.\d+)?$/;
      if (!reg.test(scale)) {
        wx.showToast({
          title: '格式错误...'
        });
        return;
      }
      //console.log(e);
      this.setData({
        cutScale: scale
      });
    },
    //改变比例
    alterScaleBtn: function() {
      var cutW = this.data.cutW;
      var cutHWScale = this.data.cutScale;

      //改变之后的高度
      var cutH = cutW * cutHWScale;
      //如果高度过高就提示错误信息

      //不加上top值  超出了图片高度就没办法了 提示错误
      if (cutH > this.data.cropperH) {
        wx.showToast({
          title: '比例过大！',
          duration: 1500
        });

        return;
      }
      //如果 加上top值 超过了就让top值为0
      if (cutH + this.data.cutT > this.data.cropperH) {
        this.setData({
          cutT: 0
        });
      }

      this.setData({
        cutW: cutW,
        cutH: cutH
      });
    },
    //是否固定剪切框的比例
    changefixedRatio: function() {
      var cur = this.data.fixedRatio;
      this.setData({
        fixedRatio: cur ? false : true
      });
    },

    // 拖动时候触发的touchStart事件
    contentStartMove(e) {
      //整体移动
      //console.log(e);
      pageX = e.touches[0].pageX;
      pageY = e.touches[0].pageY;
    },

    // 拖动时候触发的touchMove事件
    contentMoveing(e) {
      var _this = this;
      // _this.data.cutL + (e.touches[0].pageX - pageX)
      // console.log(e.touches[0].pageX)
      // console.log(e.touches[0].pageX - pageX)
      var dragLengthX = (pageX - e.touches[0].pageX) * dragScaleP;
      var dragLengthY = (pageY - e.touches[0].pageY) * dragScaleP;
      var minX = Math.max(_this.data.cutL - dragLengthX, 0);
      var minY = Math.max(_this.data.cutT - dragLengthY, 0);
      var maxX = _this.data.cropperW - _this.data.cutW;
      var maxY = _this.data.cropperH - _this.data.cutH;
      this.setData({
        cutL: Math.min(maxX, minX),
        cutT: Math.min(maxY, minY)
      });
      //console.log(`${maxX} ----- ${minX}`)
      pageX = e.touches[0].pageX;
      pageY = e.touches[0].pageY;
    },

    // 获取图片
    getImageInfo() {
      var _this = this;

      wx.showLoading({
        title: '图片生成中...'
      });

      var imageSrc = _this.data.imageSrc;

      // 将图片写入画布
      const ctx = wx.createCanvasContext('myCanvas', _this);
      //console.log(res);
      //画上去  不能超过屏幕  不然出错  ---
      //#########
      //如果不限制  画入的大小需要将下面导出的再乘以_this.data.scaleP
      //还要将下面调整  代码块打开
      //#########
      ctx.drawImage(imageSrc, 0, 0, _this.data.imageW, _this.data.imageH);

      // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
      var canvasW = (_this.data.cutW / _this.data.cropperW) * _this.data.imageW;
      var canvasH = (_this.data.cutH / _this.data.cropperH) * _this.data.imageH;
      var canvasL = (_this.data.cutL / _this.data.cropperW) * _this.data.imageW;
      var canvasT = (_this.data.cutT / _this.data.cropperH) * _this.data.imageH;

      // //可能越界了 要调整大小

      // let canvasW_temp = canvasW > windowWRPX ? windowWRPX : canvasW;

      // let rate = canvasW / canvasW_temp;

      // //同等比例缩放
      // canvasW = canvasW_temp;

      // canvasH = canvasH/rate;

      // canvasL = canvasL / rate;

      // canvasT = canvasT / rate;

      console.log(
        '生成图片===canvasW：' +
          canvasW +
          '..........canvasH:' +
          canvasH +
          '........canvasL:' +
          canvasL +
          '.............canvasT:' +
          canvasT
      );

      ctx.draw(true, () => {
        wx.canvasToTempFilePath(
          {
            x: canvasL,
            y: canvasT,
            width: canvasW,
            height: canvasH,
            destWidth: canvasW,
            destHeight: canvasH,
            canvasId: 'myCanvas',
            success: function(res) {
              // 成功获得地址的地方
              //console.log(res.tempFilePath)
              //返回
              app.globalData.imgageUploadUrl = res.tempFilePath;
              wx.navigateBack();
              wx.previewImage({
                current: '',
                urls: [res.tempFilePath]
              });
            },
            complete: function() {
              wx.hideLoading();
            },
            fail: function(e) {
              console.log(e);
            }
          },
          _this
        );
      });
    },

    // 拖动裁剪框的时候触发的touchStart事件
    dragStart(e) {
      //console.log(e);
      var _this = this;
      sizeConfPageX = e.touches[0].pageX;
      sizeConfPageY = e.touches[0].pageY;
      initDragCutW = _this.data.cutW;
      initDragCutL = _this.data.cutL;
      initDragCutT = _this.data.cutT;
      initDragCutH = _this.data.cutH;
    },

    // 拖动裁剪框的时候触发的touchMove事件
    dragMove(e) {
      var _this = this;
      var dragType = e.target.dataset.drag;
      switch (dragType) {
        case 'right':
          var dragLength = (sizeConfPageX - e.touches[0].pageX) * dragScaleP;

          // if (initDragCutW >= dragLength) {
          // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
          if (
            dragLength < 0 &&
            _this.data.cropperW > initDragCutL + _this.data.cutW
          ) {
            let x = initDragCutW - dragLength;
            if (x > _this.data.cropperW - initDragCutL) {
              x = Math.floor(_this.data.cropperW - initDragCutL);
            }

            this.setData({
              cutW: x
            });
            //改变剪切框的比例
            _this.changeCutHWScale();
            //之前的逻辑 只能判断开始触摸之前的点在图片之内 并不能保证大小改变之后点在不在图片之外所以需要处理
            _this.adjustCutframe();
          }

          // 如果是移动 大于0  说明在缩小  只需要缩小的距离小于原本裁剪的高度就ok
          //最小为20
          if (dragLength > 0 && _this.data.cutW > 20) {
            this.setData({
              cutW: initDragCutW - dragLength
            });
            //改变剪切框的比例
            _this.changeCutHWScale();
            //之前的逻辑 只能判断开始触摸之前的点在图片之内 并不能保证大小改变之后点在不在图片之外所以需要处理
            _this.adjustCutframe();
          }
          // }
          break;
        case 'left':
          var dragLength =
            (dragLength = sizeConfPageX - e.touches[0].pageX) * dragScaleP;
          //console.log(dragLength)
          // 右移,缩小
          if (dragLength < 0 && _this.data.cutW > 20) {
            this.setData({
              cutL: initDragCutL - dragLength,
              cutW: initDragCutW + dragLength
            });

            _this.changeCutHWScale();
            _this.adjustCutframe();
          }

          // 左移，放大
          if (
            dragLength > 0 &&
            initDragCutL >= 0 &&
            initDragCutL > dragLength
          ) {
            let x = initDragCutW + dragLength;
            if (x > initDragCutW + initDragCutL) {
              x = Math.floor(initDragCutW + initDragCutL);
            }

            this.setData({
              cutL: initDragCutL - dragLength,
              cutW: x
            });

            _this.changeCutHWScale();
            _this.adjustCutframe();
          }

          // if (initDragCutW >= dragLength && initDragCutL > dragLength) {
          //   if (dragLength < 0 && Math.abs(dragLength) >= initDragCutW) return
          //   this.setData({
          //     cutL: initDragCutL - dragLength,
          //     cutW: initDragCutW + dragLength
          //   })
          //   //改变剪切框的比例
          //   _this.changeCutHWScale();
          //   //之前的逻辑 只能判断开始触摸之前的点在图片之内 并不能保证大小改变之后点在不在图片之外所以需要处理
          //   _this.adjustCutframe()
          // }
          break;
        case 'top':
          var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP;

          // 下拉，缩小
          if (dragLength < 0 && _this.data.cutH > 20) {
            this.setData({
              cutT: initDragCutT - dragLength,
              cutH: initDragCutH + dragLength
            });

            _this.changeCutHWScale();
            _this.adjustCutframe();
          }

          // 上拉，放大
          if (
            dragLength > 0 &&
            initDragCutT >= 0 &&
            initDragCutT > dragLength
          ) {
            let y = initDragCutH + dragLength;
            if (y > initDragCutH + initDragCutT) {
              y = Math.floor(initDragCutH + initDragCutT);
            }

            this.setData({
              cutT: initDragCutT - dragLength,
              cutH: initDragCutH + dragLength
            });

            _this.changeCutHWScale();
            _this.adjustCutframe();
          }

          // if (initDragCutH >= dragLength && initDragCutT > dragLength) {
          //   if (dragLength < 0 && Math.abs(dragLength) >= initDragCutH) return
          //   this.setData({
          //     cutT: initDragCutT - dragLength,
          //     cutH: initDragCutH + dragLength
          //   })
          //   //改变剪切框的比例
          //   _this.changeCutHWScale();
          //   //之前的逻辑 只能判断开始触摸之前的点在图片之内 并不能保证大小改变之后点在不在图片之外所以需要处理
          //   _this.adjustCutframe()
          // }
          break;
        case 'bottom':
          var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP;
          // console.log(_this.data.cropperH > _this.data.cutT + _this.data.cutH)
          //console.log(dragLength)
          // console.log(initDragCutH >= dragLength)
          //console.log(_this.data.cropperH > initDragCutT + _this.data.cutH)
          // 必须是 dragLength 向上缩小的时候必须小于原本的高度

          // if (initDragCutH >= dragLength) {
          // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
          // 下拉，放大
          if (
            dragLength < 0 &&
            _this.data.cropperH > initDragCutT + _this.data.cutH
          ) {
            let y = initDragCutH - dragLength;
            if (y > _this.data.cropperH - initDragCutT) {
              y = Math.floor(_this.data.cropperH - initDragCutT);
            }

            this.setData({
              cutH: y
            });

            _this.changeCutHWScale();
            _this.adjustCutframe();
          }
          // 如上拉，缩小
          if (dragLength > 0 && _this.data.cutH > 20) {
            this.setData({
              cutH: initDragCutH - dragLength
            });

            _this.changeCutHWScale();
            _this.adjustCutframe();
          }
          // }
          break;
        case 'rightBottom':
          //右下角的点只能改变比例，不能改变反方向的位置

          //x轴变化 >0 表示左移 <0 表示右移
          var dragLengthX = (sizeConfPageX - e.touches[0].pageX) * dragScaleP;

          //y轴变化 >0 表示上移 <0 表示下移
          var dragLengthY = (sizeConfPageY - e.touches[0].pageY) * dragScaleP;

          //如果长度和宽度改变 不一样说明不是等比滑动

          if (initDragCutH >= dragLengthY && initDragCutW >= dragLengthX) {
            if (
              ((dragLengthY < 0 &&
                _this.data.cropperH > initDragCutT + _this.data.cutH) ||
                dragLengthY > 0) &&
              ((dragLengthX < 0 &&
                _this.data.cropperW > initDragCutL + _this.data.cutW) ||
                dragLengthX > 0)
            ) {
              //要保证按照比例变换后 不超出图片
              //滑动为 最小的一个 如何选择最大的可能会导致 小的出界
              var change =
                dragLengthY > dragLengthX ? dragLengthX : dragLengthY;
              //高宽比  宽度按照chnage类 高度按照比例变化
              this.setData({
                cutH: initDragCutH - change * cutHWScale,
                cutW: initDragCutW - change
              });

              //之前的逻辑 只能判断开始触摸之前的点在图片之内 并不能保证大小改变之后点在不在图片之外所以需要处理
              _this.adjustCutframe();
            } else {
              return;
            }
          } else {
            return;
          }
          break;
        default:
          break;
      }
    },
    adjustCutframe: function() {
      //水平超出
      if (this.data.cutL + this.data.cutW > this.data.cropperW) {
        //将left不变改变 剪切框的大小
        var distance = this.data.cutL + this.data.cutW - this.data.cropperW;

        this.setData({
          cutH: initDragCutH - distance * cutHWScale,
          cutW: initDragCutW - distance
        });
      }
      //垂直超出
      if (this.data.cutT + this.data.cutH > this.data.cropperH) {
        //将TOP不变改变 剪切框的大小
        var distance = this.data.cutT + this.data.cutH - this.data.cropperH;

        this.setData({
          cutH: initDragCutH - distance,
          cutW: initDragCutW - distance / cutHWScale
        });
      }
    },
    //改变剪切框的比例
    changeCutHWScale: function() {
      cutHWScale = this.data.cutH / this.data.cutW;

      this.setData({
        cutScale: cutHWScale
      });
    },

    throttle(fn, wait) {
      let timer = null;
      return function(...args) {
        if (timer === null) {
          console.log(args);
          fn.apply(this, args);
          timer = setTimeout(() => {
            timer = null;
          }, wait);
        }
      };
    },

    //##############################################################
    //##############################################################
    //监控方法 加一个_
    _contentStartMove: function(e) {
      // console.log("监听move:");
      // console.log(e);
      this.triggerEvent('contentStartMove', e);
    },
    _contentMoveing: function(e) {
      // console.log(e);

      this._contentMoveing = this.throttle(function(e) {
        this.triggerEvent('contentMoveing', e);
      }, 25);
    },
    _dragStart: function(e) {
      this.triggerEvent('dragStart', e);
    },
    _dragMove: function(e) {
      this._dragMove = this.throttle(function(e) {
        this.triggerEvent('dragMove', e);
      }, 25);
    },
    _scaleChange: function(e) {
      // console.log("监听scalechange:");
      //console.log(e);

      this.triggerEvent('scaleChange', e);
    },
    _getImageInfo: function(e) {
      this.triggerEvent('getImageInfo', e);
    },
    _changefixedRatio: function(e) {
      this.triggerEvent('changefixedRatio', e);
    },
    _alterScaleBtn: function() {
      this.triggerEvent('alterScaleBtn');
    }
  },

  ready() {
    this.imgageInit(this.data.imageSrc);
  }
});
