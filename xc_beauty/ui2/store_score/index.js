var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        tab: [ "全部", "待核销", "已核销" ],
        tabCurr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tabChange: function(a) {
        var e = this, t = a.currentTarget.id;
        if (t != e.data.tabCurr) {
            e.setData({
                tabCurr: t,
                page: 1,
                isbottom: !1
            });
            var s = {
                op: "score_log",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.tabCurr
            };
            app.util.request({
                url: "entry/wxapp/manage",
                data: s,
                success: function(a) {
                    var t = a.data;
                    "" != t.data ? e.setData({
                        list: t.data,
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !0,
                        list: []
                    });
                }
            });
        }
    },
    shFunc: function(a) {
        var t = this, e = a.currentTarget.dataset.index, s = t.data.list;
        wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "score_status",
                        id: s[e].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "核销成功"
                        }), s[e].status = 1, t.setData({
                            list: s
                        }));
                    }
                });
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            store_id: a.store_id
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.store && null != t.data.store && wx.setNavigationBarTitle({
                    title: t.data.store.name
                }), "" != t.data.store_manager && null != t.data.store_manager && e.setData({
                    store_manager: t.data.store_manager
                }));
            }
        });
        var t = {
            op: "score_log",
            page: e.data.page,
            pagesize: e.data.pagesize,
            curr: e.data.tabCurr
        };
        app.util.request({
            url: "entry/wxapp/manage",
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
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        if (!e.data.isbottom) {
            var a = {
                op: "score_log",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.tabCurr
            };
            app.util.request({
                url: "entry/wxapp/manage",
                data: a,
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
    }
});