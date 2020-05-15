var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "share"
            },
            success: function(a) {
                var n = a.data;
                "" != n.data && o.setData({
                    share: n.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var n = a.data;
                "" != n.data && o.setData({
                    userinfo: n.data
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