var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    bindDateChange: function(a) {
        this.setData({
            date: a.detail.value
        });
    },
    search: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_member",
                id: e.data.store_id,
                plan_date: e.data.date
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    list: t.data
                });
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e);
        var t = new Date(), n = t.getFullYear(), o = t.getMonth() + 1;
        o < 10 && (o = "0" + o), e.setData({
            store_id: a.store_id,
            date: n + "-" + o
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
                op: "store_member",
                id: a.store_id,
                plan_date: e.data.date
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    list: t.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});