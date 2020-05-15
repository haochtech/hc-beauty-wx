var a = getApp(), t = require("../common/common.js");

Page({
    data: {
        footer_curr: 3,
        today: 1,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        order_item: 0,
        order: []
    },
    tab: function(t) {
        var e = this, o = t.currentTarget.dataset.index;
        o != e.data.today && (e.setData({
            today: o
        }), a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "count",
                today: e.data.today
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    count: t.data
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
        var t = this, e = t.data.order;
        1 == e[t.data.order_item].status && -1 == e[t.data.order_item].use ? wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(o) {
                o.confirm ? a.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: e[t.data.order_item].id
                    },
                    success: function(a) {
                        "" != a.data.data && (e[t.data.order_item].is_use = parseInt(e[t.data.order_item].is_use) + 1, 
                        e[t.data.order_item].is_use == parseInt(e[t.data.order_item].can_use) && (e[t.data.order_item].use = 1), 
                        t.setData({
                            order: e
                        }), wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : o.cancel && console.log("用户点击取消");
            }
        }) : 2 == e[t.data.order_item].status && -1 == e[t.data.order_item].refund_status && wx.showModal({
            title: "提示",
            content: "确定退款吗？",
            success: function(o) {
                o.confirm ? a.util.request({
                    url: "entry/wxapp/orderrefund",
                    data: {
                        id: e[t.data.order_item].id
                    },
                    success: function(a) {
                        "" != a.data.data && (e[t.data.order_item].use = 1, t.setData({
                            order: e,
                            shadow: !1,
                            menu: !1
                        }), wx.showToast({
                            title: "退款成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : o.cancel && console.log("用户点击取消");
            }
        });
    },
    input: function(a) {
        this.setData({
            search: a.detail.value
        });
    },
    search: function() {
        var t = this, e = t.data.search;
        null != e && "" != e ? a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order_search",
                out_trade_no: e
            },
            success: function(a) {
                var e = a.data;
                if ("" != e.data) {
                    var o = t.data.order;
                    o.push(e.data), t.setData({
                        order: o,
                        order_item: o.length - 1,
                        shadow: !0,
                        menu: !0
                    });
                }
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入订单号",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    scan: function() {
        var t = this;
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(e) {
                console.log(e), a.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_search",
                        id: e.result
                    },
                    success: function(a) {
                        var e = a.data;
                        if ("" != e.data) {
                            var o = t.data.order;
                            o.push(e.data), t.setData({
                                order: o,
                                order_item: o.length - 1,
                                shadow: !0,
                                menu: !0
                            });
                        }
                    }
                });
            }
        });
    },
    onLoad: function(e) {
        var o = this;
        t.config(o), t.theme(o), o.setData({
            userinfo: a.userinfo
        }), a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "index"
            },
            showLoading: !1,
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.count && null != t.data.count && o.setData({
                    count: t.data.count
                }), "" != t.data.order && null != t.data.order && o.setData({
                    order: t.data.order
                }));
            }
        }), a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "income",
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? o.setData({
                    list: t.data,
                    page: o.data.page + 1
                }) : o.setData({
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
                op: "income",
                page: t.data.page,
                pagesize: t.data.pagesize
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