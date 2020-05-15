var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1,
        recharge: [],
        recharge_page: 1,
        recharge_pagesize: 20,
        recharge_isbottom: !1,
        buy: []
    },
    tab: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.curr && this.setData({
            curr: t
        });
    },
    bindDateChange: function(a) {
        var e = this;
        e.setData({
            date: a.detail.value
        }), app.util.request({
            url: "entry/wxapp/manage",
            showLoading: !1,
            data: {
                op: "buy_order",
                store: e.data.store_id,
                plan_date: e.data.date
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    buy: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "buy_order",
                store: e.data.store_id,
                plan_date: e.data.date
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    buy: t.data
                });
            }
        });
    },
    choose: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.buy;
        e.list[t].status = -e.list[t].status, this.setData({
            buy: e
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e);
        var t = new Date(), r = t.getFullYear(), o = t.getMonth() + 1;
        o < 10 && (o = "0" + o), e.setData({
            store_id: a.store_id,
            curr: a.curr,
            date: r + "-" + o
        }), app.util.request({
            url: "entry/wxapp/manage",
            showLoading: !1,
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.store && null != t.data.store && wx.setNavigationBarTitle({
                    title: t.data.store.name
                });
            }
        }), app.util.request({
            url: "entry/wxapp/manage",
            showLoading: !1,
            data: {
                op: "recharge_order",
                page: e.data.recharge_page,
                pagesize: e.data.recharge_pagesize,
                store: e.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    recharge: t.data,
                    recharge_page: e.data.recharge_page + 1
                }) : e.setData({
                    recharge_isbottom: !0
                });
            }
        }), app.util.request({
            url: "entry/wxapp/manage",
            showLoading: !1,
            data: {
                op: "buy_order",
                store: e.data.store_id,
                plan_date: e.data.date
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    buy: t.data
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
        2 != e.data.curr || e.data.recharge_isbottom || app.util.request({
            url: "entry/wxapp/manage",
            showLoading: !1,
            data: {
                op: "recharge_order",
                page: e.data.recharge_page,
                pagesize: e.data.recharge_pagesize,
                store: e.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    recharge: e.data.recharge.concat(t.data),
                    recharge_page: e.data.recharge_page + 1
                }) : e.setData({
                    recharge_isbottom: !0
                });
            }
        });
    }
});