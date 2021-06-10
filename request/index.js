// 同时发送异步代码的次数
let ajaxTimes = 0;

// 封装请求
export const request=(params)=>{
  ajaxTimes++;
  // 显示加载中效果
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
    
  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject)=>{
    wx.request({
      // 。。。结构
      ...params,
      url:baseUrl+params.url,
      // 成功回调的
      success:(result)=>{
        resolve(result);
      },
      // 失败回调的
      fail:(err)=>{
        reject(err)
      },
      // 不惯成功失败都会回调的
      complete:()=>{
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  })
}