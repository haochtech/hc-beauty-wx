var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            store_id: a.store_id,
            id: a.id,
            plan_date: a.plan_date
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
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "member_detail",
                id: e.data.id,
                plan_date: e.data.plan_date,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.member && null != t.data.member && e.setData({
                    member: t.data.member
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        e.data.isbottom || app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "member_detail",
                id: e.data.id,
                plan_date: e.data.plan_date,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.list && null != t.data.list ? e.setData({
                    list: e.data.list.concat(t.data.list),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                }));
            }
        });
    }
});