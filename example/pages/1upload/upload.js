export const upload = {
  chooseImage: function({
    sizeType = ['compressed'],
    sourceType = ['album', 'camera'],
    count = 9
  }) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: count, // 最多可以选择的图片张数，默认9
        sizeType: sizeType, // original 原图，compressed 压缩图，默认二者都有
        sourceType: sourceType, // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res) {
          resolve(res.tempFilePaths);
        },
        fail: function(err) {
          reject(err);
        }
      });
    });
  },

  /**
   * @param {arr}     files         图片url集合
   * @param {String}  url           图片上传接口地址
   * @param {String}  dir           上传目录地址
   * @param {String}  name          文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
   * @param {Object}  header        HTTP 请求 Header, header 中不能设置 Referer
   * @param {Object}  formData      HTTP 请求中其他额外的 form data
   */
  uploadImagewx: function({
    files = [],
    name = 'file',
    formData = {},
    header = {},
    dir = '',
    url = config.uploadImageUrl
  }) {
    return new Promise((resolve, reject) => {
      if (files && files.length > 0) {
        let promiseList = [];

        for (let i = 0; i < files.length; i++) {
          promiseList[i] = new Promise((resolve, reject) => {
            wx.uploadFile({
              url: url + dir,
              filePath: files[i],
              name: name,
              // header: {}, // 设置请求的 header
              // formData: {}, // HTTP 请求中其他额外的 form data
              success: function(res) {
                resolve(res.data);
              },
              fail: function(err) {
                reject(err);
              }
            });
          });
        }

        Promise.all(promiseList)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        reject('files 错误');
      }
    });
  },

  uploadImageqn: function(files) {
    return new Promise((resolve, reject) => {
      if (files && files.length > 0) {
        let promiseList = [];
        let done = [];

        for (let i = 0; i < files.length; i++) {
          promiseList[i] = new Promise((resolve, reject) => {
            // qiniuUploader.upload(
            //   files[i],
            //   res => {
            //     resolve(res.imageURL);
            //   },
            //   err => {
            //     reject(err);
            //   }
            // );
            if (i == 1) {
              reject({ done: done, err: files[i] });
            } else {
              done.push(files[i]);
              resolve(done);
            }
          });
        }

        Promise.all(promiseList)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        reject('files 错误');
      }
    });
  }
};

//顺序处理函数
function sequenceTasks(tasks) {
  //记录返回值
  function recordValue(results, value) {
    results.push(value);
    return results;
  }

  let pushValue = recordValue.bind(null, []);
  let promise = Promise.resolve();

  // 处理tasks数组中的每个函数对象
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    promise = promise.then(task).then(pushValue);
  }

  return promise;
}

// sequenceTasks(promiseFuncArr).then(result => {
//   //对返回的result数组进行处理
// });
