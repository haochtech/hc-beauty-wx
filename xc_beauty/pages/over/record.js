var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.curr && (e.setData({
            curr: t,
            list: [],
            page: 1,
            isbottom: !1
        }), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "over",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "over",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
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
        var e = this;
        e.data.isbottom || app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "over",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: e.data.list.concat(t.data),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});