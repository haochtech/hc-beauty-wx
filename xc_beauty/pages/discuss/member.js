var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    input: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    submit: function() {
        var t = this;
        "" != t.data.content && null != t.data.content ? app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "member_discuss",
                id: t.data.list.member,
                out_trade_no: t.data.list.out_trade_no,
                content: t.data.content
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.reLaunch({
                        url: "../../pages/order/order"
                    });
                }, 2e3));
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入内容"
        });
    },
    onLoad: function(t) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "detail",
                out_trade_no: t.out_trade_no
            },
            success: function(t) {
                var n = t.data;
                "" != n.data && o.setData({
                    list: n.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});