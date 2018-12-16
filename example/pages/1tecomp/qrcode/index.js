// pages/1tecomp/qrcode/index.js
const Qr = require('./qrcode');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: Number,
      value: 0
    },
    height: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canvasHidden: false,
    imagePath:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
});
