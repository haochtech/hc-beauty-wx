var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.curr && (e.setData({
            curr: t,
            page: 1,
            isbottom: !1
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "apply_share",
                curr: e.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page
                }) : e.setData({
                    isbottom: !0,
                    list: []
                });
            }
        }));
    },
    apply_change: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index, n = a.currentTarget.dataset.status;
        app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "apply_change",
                id: e[s].id,
                status: n
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "操作成功"
                }), e[s].status = n, t.setData({
                    list: e
                }));
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "apply_share",
                curr: e.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page
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
            url: "entry/wxapp/manage",
            data: {
                op: "apply_share",
                curr: e.data.curr
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: e.data.list.concat(t.data),
                    page: e.data.page
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});