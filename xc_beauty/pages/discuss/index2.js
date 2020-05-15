var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "discuss",
                id: a.id,
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? o.setData({
                    list: t.data,
                    page: o.data.page + 1
                }) : o.setData({
                    isbottom: !0
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var o = this;
        o.data.isbottom || app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "discuss",
                id: options.id,
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? o.setData({
                    list: o.data.concat(t.data),
                    page: o.data.page + 1
                }) : o.setData({
                    isbottom: !0
                });
            }
        });
    }
});