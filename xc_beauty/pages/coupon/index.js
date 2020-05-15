var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    pay: function() {
        "theme3" == this.data.theme.name ? wx.reLaunch({
            url: "../../ui2/service/service"
        }) : wx.reLaunch({
            url: "../service/service"
        });
    },
    share: function() {
        wx.navigateTo({
            url: "../share/index"
        });
    },
    onLoad: function(n) {
        var a = this;
        common.config(a), common.theme(a), a.setData({
            share: app.share
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "set_coupon",
                id: n.id
            },
            success: function(n) {
                var e = n.data;
                "" != e.data && a.setData({
                    list: e.data
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