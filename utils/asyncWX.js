// 
export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
    });
  })
}

// 封装弹窗提示函数
export const showModal = ({ content }) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "提示",
      content: content,
      success: (res) => {
        resolve(res);
      },
      fail: (err)=> {
        reject(err);
      }
    });
  });
};

// 封装showToast
export const showToast = ({title})=>{
  return new Promise((resolve,reject)=> {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {}
    });
      
  })
}

//  promise形式的微信登录
export const Login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err)
      },
    });
  })
}

// 封装微信支付接口
/**
 * 
 * @param {object} pay 支付所必要的参数
 */

export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {}
    });
  })
}

// Promise形式封装getUserProfile

export const getUserProfile=()=>{
  return new Promise((resolve,reject)=>{
    wx.getUserProfile({
      desc:"用于获取用户信息",
      success: (res)=> {
        resolve(res)
      },
      fail: (err)=> {
        reject(err)
      }
    })
  })
}

// 防抖函数
export function debounce(func, delay) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(context, args);
    }, delay);
  };
}