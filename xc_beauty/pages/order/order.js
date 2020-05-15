var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1,
        page: 1,
        pagesize: 15,
        isbottom: !1
    },
    tab: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        a != e.data.curr && (e.setData({
            curr: a,
            isbottom: !1,
            page: 1
        }), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(t) {
                var a = t.data;
                "" != a.data ? e.setData({
                    list: a.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0,
                    list: []
                });
            }
        }));
    },
    to_detail: function(t) {
        var a = t.currentTarget.dataset.index;
        wx.navigateTo({
            url: "detail?&out_trade_no=" + this.data.list[a].out_trade_no
        });
    },
    order_del: function(t) {
        var e = this, s = t.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确定取消订单吗？",
            success: function(t) {
                t.confirm ? app.util.request({
                    url: "entry/wxapp/order",
                    data: {
                        op: "order_del",
                        id: e.data.list[s].id
                    },
                    success: function(t) {
                        if ("" != t.data.data) {
                            wx.showToast({
                                title: "取消成功",
                                icon: "success",
                                duration: 2e3
                            });
                            var a = e.data.list;
                            a.splice(s, 1), e.setData({
                                list: a
                            });
                        }
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    menu_on: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            refund: a,
            shadow: !0,
            menu: !0
        });
    },
    menu_close: function(t) {
        this.setData({
            shadow: !1,
            menu: !1
        });
    },
    input: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    menu_btn: function() {
        var e = this, t = e.data.content;
        if ("" != t && null != t) {
            e.setData({
                content: "",
                shadow: !1,
                menu: !1
            });
            var a = {
                op: "refund",
                id: e.data.list[e.data.refund].id,
                content: t
            };
            app.util.request({
                url: "entry/wxapp/order",
                data: a,
                success: function(t) {
                    if ("" != t.data.data) {
                        wx.showToast({
                            title: "提交成功",
                            icon: "success",
                            duration: 2e3
                        });
                        var a = e.data.list;
                        a.splice(e.data.refund, 1), e.setData({
                            list: a
                        });
                    }
                }
            });
        }
    },
    to_discuss: function(t) {
        var a = t.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../discuss/discuss?&out_trade_no=" + this.data.list[a].out_trade_no
        });
    },
    member_discuss: function(t) {
        var a = t.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../discuss/member?&out_trade_no=" + this.data.list[a].out_trade_no
        });
    },
    onLoad: function(t) {
        common.config(this), common.theme(this);
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        e.setData({
            page: 1,
            isbottom: !1
        }), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(t) {
                var a = t.data;
                "" != a.data ? e.setData({
                    list: a.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        e.data.isbottom || app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(t) {
                var a = t.data;
                "" != a.data ? e.setData({
                    list: e.data.list.concat(a.data),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});