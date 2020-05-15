var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "service/service",
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
            data: {
                op: "service_load",
                page: e.data.page,
                pagesize: e.data.pagesize,
                cid: e.data.pclass[e.data.curr].id
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
        }));
    },
    onLoad: function(s) {
        var i = this;
        common.config(i), common.theme(i);
        var a = {
            op: "service",
            page: i.data.page,
            pagesize: i.data.pagesize
        };
        "" != s.cid && null != s.cid && (a.cid = s.cid), app.util.request({
            url: "entry/wxapp/service",
            data: a,
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    if ("" != t.data.class && null != t.data.class && (i.setData({
                        pclass: t.data.class
                    }), "" != s.cid && null != s.cid)) for (var e = 0; e < t.data.class.length; e++) t.data.class[e].id == s.cid && i.setData({
                        curr: e
                    });
                    "" != t.data.list && null != t.data.list ? i.setData({
                        list: t.data.list,
                        page: i.data.page + 1
                    }) : i.setData({
                        isbottom: !0
                    });
                }
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
            data: {
                op: "service_load",
                page: e.data.page,
                pagesize: e.data.pagesize,
                cid: e.data.pclass[e.data.curr].id
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
    },
    onShareAppMessage: function() {
        var a = this, t = "/xc_beauty/pages/service/service";
        t = escape(t);
        var e = a.data.config.title + "-首页";
        "" != a.data.config.share_service_title && null != a.data.config.share_service_title && (e = a.data.config.share_service_title);
        var s = "";
        "" != a.data.config.share_service_img && null != a.data.config.share_service_img && (s = a.data.config.share_service_img);
        var i = "/xc_beauty/pages/base/base?&share=" + t, c = 1;
        return "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (c = app.share.content.status), 
        1 == c && (i = i + "&scene=" + app.userinfo.openid), {
            title: e,
            path: i,
            imageUrl: s,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});