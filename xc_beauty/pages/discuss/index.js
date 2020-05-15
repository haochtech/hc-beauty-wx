var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 0,
        page: 1,
        pagesize: 15,
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
            url: "entry/wxapp/service",
            showLoading: !1,
            data: {
                op: "discuss",
                id: e.data.detail.id,
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
    previewImage: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.indexs;
        wx.previewImage({
            current: this.data.list[t].imgs[e],
            urls: this.data.list[t].imgs
        });
    },
    onLoad: function(e) {
        var s = this;
        common.config(s), common.theme(s), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "detail",
                id: e.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (s.setData({
                    detail: t.data
                }), app.util.request({
                    url: "entry/wxapp/service",
                    showLoading: !1,
                    data: {
                        op: "discuss",
                        id: e.id,
                        page: s.data.page,
                        pagesize: s.data.pagesize,
                        curr: s.data.curr
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data ? s.setData({
                            list: t.data,
                            page: s.data.page + 1
                        }) : s.setData({
                            isbottom: !0
                        });
                    }
                }));
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
            url: "entry/wxapp/service",
            showLoading: !1,
            data: {
                op: "discuss",
                id: options.id,
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