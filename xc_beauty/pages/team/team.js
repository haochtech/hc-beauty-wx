var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1,
        level: 3,
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
            url: "entry/wxapp/index",
            data: {
                op: "team",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
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
            url: "entry/wxapp/index",
            showLoading: !1,
            data: {
                op: "share"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.content && null != t.data.content && "" != t.data.content.level && null != t.data.content.level && e.setData({
                    level: t.data.content.level
                });
            }
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "share_num"
            },
            showLoading: !1,
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    userinfo: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "team",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
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
            url: "entry/wxapp/index",
            data: {
                op: "team",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
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