var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    setcard: function(a) {
        var t = this, e = a.currentTarget.dataset.index, s = t.data.list;
        wx.showModal({
            title: "提示",
            content: "您将充值" + s[e].amount + "元到当前账户余额",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/index",
                    data: {
                        op: "setcard",
                        id: s[e].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "充值成功"
                        }), s[e].status = 1, t.setData({
                            list: s
                        }));
                    }
                }) : a.cancel;
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e);
        var t = {
            op: "user_card",
            page: e.data.page,
            pagesize: e.data.pagesize
        };
        "" != a.id && null != a.id && (t.id = a.id), app.util.request({
            url: "entry/wxapp/index",
            data: t,
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }), app.util.request({
            url: "entry/wxapp/index",
            showLoading: !1,
            data: {
                op: "r_card"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    card_config: t.data
                });
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
            op: "user_card",
            page: e.data.page,
            pagesize: e.data.pagesize
        };
        app.util.request({
            url: "entry/wxapp/index",
            data: a,
            success: function(a) {
                var t = a.data;
                wx.stopPullDownRefresh(), "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0,
                    list: []
                });
            }
        });
    },
    onReachBottom: function() {
        var e = this;
        e.data.isbottom || app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "user_card",
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
    },
    onShareAppMessage: function(a) {
        var t = this, e = "/xc_beauty/pages/index/index", s = t.data.config.title + "-首页", i = "";
        if ("button" == a.from) {
            var n = a.target.dataset.index, o = t.data.list;
            if (e = "/xc_beauty/pages/r_card/user?&id=" + o[n].id, "" != t.data.card_config && null != t.data.card_config) {
                var d = t.data.card_config;
                "" != d.share_title && null != d.share_title && (s = (s = (s = d.share_title).replace(/{uname}/g, d.nick)).replace(/{jine}/g, o[n].amount)), 
                "" != d.share_img && null != d.share_img && (i = d.share_img);
            }
        }
        return {
            title: s,
            path: "/xc_beauty/pages/base/base?&share=" + (e = escape(e)),
            imageUrl: i,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});