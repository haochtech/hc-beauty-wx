var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "mall/mall",
        curr: -1,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        if (t != e.data.curr) {
            e.setData({
                curr: t,
                page: 1,
                isbottom: !1
            });
            var s = {
                op: "mall",
                page: e.data.page,
                pagesize: e.data.pagesize
            };
            -1 != e.data.curr && (s.cid = e.data.xc.class[e.data.curr].id), app.util.request({
                url: "entry/wxapp/service",
                data: s,
                success: function(a) {
                    var t = a.data;
                    wx.stopPullDownRefresh(), "" != t.data && (e.setData({
                        xc: t.data
                    }), "" != t.data.list && null != t.data.list ? e.setData({
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !0
                    }));
                }
            });
        }
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "mall",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (e.setData({
                    xc: t.data
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var e = this;
        e.setData({
            page: 1,
            isbottom: !1
        });
        var a = {
            op: "mall",
            page: e.data.page,
            pagesize: e.data.pagesize
        };
        -1 != e.data.curr && (a.cid = e.data.xc.class[e.data.curr].id), app.util.request({
            url: "entry/wxapp/service",
            data: a,
            success: function(a) {
                var t = a.data;
                wx.stopPullDownRefresh(), "" != t.data && (e.setData({
                    xc: t.data
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                }));
            }
        });
    },
    onReachBottom: function() {
        var s = this;
        if (!s.data.isbottom) {
            var a = {
                op: "mall",
                page: s.data.page,
                pagesize: s.data.pagesize
            };
            -1 != s.data.curr && (a.cid = s.data.xc.class[s.data.curr].id), app.util.request({
                url: "entry/wxapp/service",
                data: a,
                success: function(a) {
                    var t = a.data;
                    if (wx.stopPullDownRefresh(), "" != t.data) if ("" != t.data.list && null != t.data.list) {
                        var e = s.data.xc;
                        e.list = e.list.concat(t.data.list), s.setData({
                            page: s.data.page + 1,
                            xc: e
                        });
                    } else s.setData({
                        isbottom: !0
                    });
                }
            });
        }
    }
});