//Page Object

import { getUserProfile } from "../../utils/asyncWX";
Page({
  async getUserProfile() {
    const {userInfo} = await getUserProfile()
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  },
});
  