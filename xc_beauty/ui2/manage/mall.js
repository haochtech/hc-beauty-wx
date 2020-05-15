var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        can_up: !0
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        if (t != e.data.curr) {
            e.setData({
                curr: t,
                page: 1,
                isbottom: !1
            });
            var s = {
                op: "mall_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr,
                store: e.data.store_id
            };
            "" != e.data.search && null != e.data.search && (s.search = e.data.search), app.util.request({
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
    call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.list[this.data.order_item].userinfo.mobile
        });
    },
    map: function() {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.list[a.data.order_item].userinfo.map.latitude),
            longitude: parseFloat(a.data.list[a.data.order_item].userinfo.map.longitude),
            address: a.data.list[a.data.order_item].userinfo.map.address,
            scale: 28
        });
    },
    to_order: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            menu: !0,
            shadow: !0,
            order_item: t
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    input: function(a) {
        this.setData({
            search: a.detail.value
        });
    },
    search: function() {
        var e = this, a = e.data.search;
        if ("" != a && null != a) {
            e.setData({
                page: 1,
                isbottom: !1
            });
            var t = {
                op: "mall_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr,
                store: e.data.store_id
            };
            "" != e.data.search && null != e.data.search && (t.search = e.data.search), app.util.request({
                url: "entry/wxapp/manage",
                data: t,
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
        } else wx.showModal({
            title: "错误",
            content: "请输入订单号"
        });
    },
    tui_input: function(a) {
        this.setData({
            tui_amount: a.detail.value
        });
    },
    submit: function() {
        var e = this, s = e.data.list;
        e.data.can_up && (1 == s[e.data.order_item].status && -1 == s[e.data.order_item].use ? wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm ? (e.setData({
                    can_up: !1
                }), app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: s[e.data.order_item].id
                    },
                    success: function(a) {
                        e.setData({
                            can_up: !0
                        }), "" != a.data.data && (s[e.data.order_item].is_use = parseInt(s[e.data.order_item].is_use) + 1, 
                        s[e.data.order_item].is_use == parseInt(s[e.data.order_item].can_use) && (s[e.data.order_item].use = 1), 
                        e.setData({
                            list: s
                        }), wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                })) : a.cancel && console.log("用户点击取消");
            }
        }) : 2 == s[e.data.order_item].status && -1 == s[e.data.order_item].refund_status && wx.showModal({
            title: "提示",
            content: "确定退款吗？",
            success: function(a) {
                if (a.confirm) {
                    e.setData({
                        can_up: !1
                    });
                    var t = {
                        id: s[e.data.order_item].id
                    };
                    "" != e.data.tui_amount && null != e.data.tui_amount && (t.tui_amount = e.data.tui_amount), 
                    app.util.request({
                        url: "entry/wxapp/orderrefund",
                        data: t,
                        success: function(a) {
                            e.setData({
                                can_up: !0
                            }), "" != a.data.data && (s[e.data.order_item].refund_status = 1, e.setData({
                                list: s,
                                menu: !1,
                                shadow: !1
                            }), wx.showToast({
                                title: "退款成功",
                                icon: "success",
                                duration: 2e3
                            }));
                        }
                    });
                } else a.cancel && console.log("用户点击取消");
            }
        }));
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), null != a.store_id && "" != a.store_id && e.setData({
            store_id: a.store_id
        }), "" != a.type && null != a.type && e.setData({
            type: a.type
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
                op: "mall_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr,
                store: a.store_id
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
                op: "mall_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr,
                store: e.data.store_id
            };
            "" != e.data.search && null != e.data.search && (a.search = e.data.search), app.util.request({
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