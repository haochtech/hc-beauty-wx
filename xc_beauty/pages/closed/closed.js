var app = getApp(), common = require("../common/common.js"), WxParse = require("../../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(t) {
        common.config(this), common.theme(this);
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "closed"
            },
            success: function(t) {
                var n = t.data;
                if ("" != n.data) if (1 == n.data.status) {
                    if (a.setData({
                        list: n.data
                    }), "" != n.data.content && null != n.data.content) {
                        n.data.content2;
                        WxParse.wxParse("content", "html", n.data.content, a, 5);
                    }
                } else wx.redirectTo({
                    url: "../base/base"
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});