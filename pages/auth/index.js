import { Login } from "../../utils/asyncWX";
import { request } from "../../request/index";

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // console.log(e);
      // 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 获取小程序登录成功后的值
      const { code } = await Login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 发送请求  获取用户的token值
      const res = await request({
        url: "/users/wxlogin",
        data: loginParams,
        methods: "post",
      });
      let token =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      // 把token值保存到本地存储中
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1,
      });
    } catch (error) {
      console.log(error);
    }
  },
});
