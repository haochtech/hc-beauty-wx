var app = getApp(), common = require("../common/common.js");

function timeup(e) {
    setInterval(function() {
        for (var a = e.data.list, t = 0; t < a.length; t++) -1 == a[t].status && (0 < parseInt(a[t].second) ? a[t].second = parseInt(a[t].second) - 1 : 0 < parseInt(a[t].min) ? (a[t].second = 59, 
        a[t].min = parseInt(a[t].min) - 1) : 0 < parseInt(a[t].hour) ? (a[t].second = 59, 
        a[t].min = 59, a[t].hour = parseInt(a[t].hour) - 1) : a[t].status = 2);
        e.setData({
            list: a
        });
    }, 1e3);
}

Page({
    data: {
        page: 1,
        pagesize: 15,
        isbottom: !1
    },
    to_detail: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "detail?&id=" + this.data.list[t].id
        });
    },
    to_order: function(a) {
        var t = a.currentTarget.dataset.index;
        1 == this.data.list[t].status && wx.navigateTo({
            url: "../order/detail?&out_trade_no=" + this.data.list[t].out_trade_no
        });
    },
    to_discuss: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../discuss/discuss?&out_trade_no=" + this.data.list[t].out_trade_no
        });
    },
    member_discuss: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../discuss/member?&out_trade_no=" + this.data.list[t].out_trade_no
        });
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "group_order",
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    for (var e = 0; e < t.data.length; e++) -1 == t.data[e].status && (t.data[e].hour = parseInt(t.data[e].fail / 3600), 
                    t.data[e].min = parseInt((t.data[e].fail - 3600 * t.data[e].hour) / 60), t.data[e].second = t.data[e].fail % 60);
                    o.setData({
                        list: t.data,
                        page: o.data.page + 1
                    }), timeup(o);
                } else o.setData({
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
        var o = this;
        o.data.isbottom || app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "group_order",
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    for (var e = 0; e < t.data.length; e++) -1 == t.data[e].status && (t.data[e].hour = parseInt(t.data[e].fail / 3600), 
                    t.data[e].min = parseInt((t.data[e].fail - 3600 * t.data[e].hour) / 60), t.data[e].second = t.data[e].fail % 60);
                    o.setData({
                        list: o.data.list.concat(t.data),
                        page: o.data.page + 1
                    });
                } else o.setData({
                    isbottom: !0
                });
            }
        });
    }
});