var a = getApp(), t = require("../common/common.js");

Page({
    data: {
        curr: 1,
        footer_curr: 2,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(t) {
        var e = this, s = t.currentTarget.dataset.index;
        s != e.data.curr && (e.setData({
            curr: s,
            page: 1,
            isbottom: !1,
            list: []
        }), a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order",
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
    to_order: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            menu: !0,
            shadow: !0,
            order_item: e
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    submit: function() {
        var t = this, e = t.data.list;
        1 == e[t.data.order_item].status && -1 == e[t.data.order_item].use ? wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(s) {
                s.confirm ? a.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: e[t.data.order_item].id
                    },
                    success: function(a) {
                        "" != a.data.data && (e[t.data.order_item].is_use = parseInt(e[t.data.order_item].is_use) + 1, 
                        e[t.data.order_item].is_use == parseInt(e[t.data.order_item].can_use) && (e[t.data.order_item].use = 1), 
                        t.setData({
                            list: e
                        }), wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : s.cancel && console.log("用户点击取消");
            }
        }) : 2 == e[t.data.order_item].status && -1 == e[t.data.order_item].refund_status && wx.showModal({
            title: "提示",
            content: "确定退款吗？",
            success: function(s) {
                s.confirm ? a.util.request({
                    url: "entry/wxapp/orderrefund",
                    data: {
                        id: e[t.data.order_item].id
                    },
                    success: function(a) {
                        "" != a.data.data && (e[t.data.order_item].use = 1, t.setData({
                            list: e,
                            menu: !1,
                            shadow: !1
                        }), wx.showToast({
                            title: "退款成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : s.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(e) {
        var s = this;
        t.config(s), t.theme(s), a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order",
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
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        t.data.isbottom || a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order",
                page: t.data.page,
                pagesize: t.data.pagesize,
                curr: t.data.curr
            },
            success: function(a) {
                var e = a.data;
                "" != e.data ? t.setData({
                    list: t.data.list.concat(e.data),
                    page: t.data.page + 1
                }) : t.setData({
                    isbottom: !0
                });
            }
        });
    }
});