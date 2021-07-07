// 给输入框绑定一个事件 input事件
import { request } from "../../request/index";
import { debounce } from "../../utils/asyncWX";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消按钮是否显示
    isFocus: false,
    // 输入框的值
    iptValue: "",
  },
  TimeId: null,
  // 输入框的值发生改变了就会触发的事件
  handleInput(e) {
    // console.log(e);
    // 获取输入框的值
    const { value } = e.detail;
    // 合法性验证
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false,
      });
      // 值不合格
      return;
    }
    this.setData({
      isFocus: true,
    });
    // 经过验证 发送请求获取数据
    // 准备发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
    debounce(this.test(), 1000)
  },

  // 发送请求 获取搜索建议的数据
  async qsearch(query) {
    const res = await request({ url: "/goods/search", data: { query } });
    console.log(res);
    this.setData({
      goods: res.data.message.goods,
    });
  },
  handleCancel() {
    this.setData({
      iptValue: "",
      isFocus: false,
      goods:[]
    });
    console.log("你好呀");
  },
  
  test() {
    console.log("你好呀");
  }
});