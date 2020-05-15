var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: -1
    },
    tab: function(a) {
        var n = this, t = a.currentTarget.dataset.index;
        t != n.data.curr && (n.setData({
            curr: t,
            list: []
        }), 2 == n.data.curr ? app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "exchange"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? n.setData({
                    list: t.data
                }) : n.setData({
                    list: []
                });
            }
        }) : app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "coupon",
                curr: n.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? n.setData({
                    list: t.data
                }) : n.setData({
                    list: []
                });
            }
        }));
    },
    onLoad: function(a) {
        var n = this;
        common.config(n), common.theme(n), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "coupon",
                curr: n.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && n.setData({
                    list: t.data
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