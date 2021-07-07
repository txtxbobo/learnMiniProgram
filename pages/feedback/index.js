// pages/feedback/index.js
import {showToast} from '../../utils/asyncWX'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false,
      },
    ],
    chooseImgs: [],
    // 文本域的内容
    textVal: "",
  },
  // 外网的图片路径数据
  UpLoadImgs:[],
  handleItemChange(e) {
    console.log(e);
    const { index } = e.detail;
    const { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    this.setData({
      tabs,
    });
  },
  // 点击加号选中图片
  handleChoose() {
    // 调用小程序内置的选中图片的api
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片格式  原图  压缩
      sizeType: ["original", "compressed"],
      // 图片的来源  相册 照相机
      sourceType: ["album", "camera"],
      success: (result) => {
        console.log(result);
        this.setData({
          // 图片数组进行拼接  避免反复选中
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths],
        });
      },
    });
  },
  // 点击自定义图片 删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs,
    });
  },
  // 富文本容器数据
  handleTextInput(e) {
    console.log(e);
    this.setData({
      textVal: e.detail.value,
    });
  },
  // 提交按钮的点击事件
  handleFormSubmit() {
    const {textVal, chooseImgs} = this.data;
    if (!textVal.trim()) {
      showToast({title:"输入不合法"})
      return
    }
    // 显示加载图标
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    // 判断有没有需要上传的图片数组
    if (chooseImgs!=0) {
      // 遍历图片数组
      chooseImgs.forEach((v, i) => {
        // 准备上传图片到专门的服务器
        wx.uploadFile({
          // 图片要上传到哪里
          url: "http://img.coolcr.cn/api/upload",
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 用后台来获取文件
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).data.url;
            this.UpLoadImgs.push(url);
            console.log(this.UpLoadImgs);
            // 所有的图片都上传完毕了 才触发代码
            if (i === chooseImgs.length - 1) {
              // 关闭弹窗提示
              wx.hideLoading();
              // 把文本的内容和外网的图片数组提交到
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              // 提交成功后返回上一个页面
              this.setData({
                textVal: "",
                chooseImgs: [],
              });
              wx.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    }else{
      wx.hideLoading();
      console.log("只是提交了文本");
      this.setData({
        textVal:'',
        chooseImgs:[]
      })
      wx.navigateBack({
        delta: 1
      });
    }
  },
});
