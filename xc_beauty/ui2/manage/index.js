var app = getApp(), common = require("../common/common.js");

function count(n) {
    app.util.request({
        url: "entry/wxapp/manage",
        data: {
            op: "amount",
            year: n.data.year,
            month: n.data.month[n.data.month_curr]
        },
        success: function(a) {
            var t = a.data;
            "" != t.data && n.setData({
                amount: t.data
            });
        }
    });
}

Page({
    data: {
        footer_curr: 2,
        month: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
    },
    month_left: function() {
        var a = this, t = a.data.month_curr;
        0 == t ? a.setData({
            month_curr: 11,
            year: a.data.year - 1
        }) : a.setData({
            month_curr: t - 1
        }), count(a);
    },
    month_right: function() {
        var a = this, t = a.data.month_curr;
        11 == t ? a.setData({
            month_curr: 0,
            year: a.data.year + 1
        }) : a.setData({
            month_curr: t + 1
        }), count(a);
    },
    month_choose: function(a) {
        var t = this, n = a.currentTarget.dataset.index;
        t.data.month_curr != n && (t.setData({
            month_curr: n
        }), count(t));
    },
    onLoad: function(a) {
        var n = this;
        common.config(n), common.theme(n);
        var t = new Date(), o = t.getFullYear(), r = t.getMonth();
        n.setData({
            year: o,
            month_curr: r
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "index2"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (n.setData({
                    all_amount: t.data.all_amount,
                    member: t.data.member,
                    card: t.data.card,
                    card_on: t.data.card_on,
                    over: t.data.over,
                    refund: t.data.refund,
                    pick_order: t.data.pick_order
                }), null != t.data.store && null != t.data.store && n.setData({
                    list: t.data.store
                }));
            }
        }), count(n);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});