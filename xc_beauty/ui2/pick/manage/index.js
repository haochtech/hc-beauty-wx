var app = getApp(), common = require("../../common/common.js");

Page({
    data: {
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    call: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.list;
        wx.makePhoneCall({
            phoneNumber: e[t].store_list.mobile
        });
    },
    order_del: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index;
        -1 == e[s].status && wx.showModal({
            title: "提示",
            content: "确定取消订单吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    method: "POST",
                    data: {
                        op: "pick_order_del",
                        id: e[s].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 2e3
                        }), e.splice(s, 1), t.setData({
                            list: e
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    order_status: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index;
        -1 == e[s].status && wx.showModal({
            title: "提示",
            content: "确定配货完成吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    method: "POST",
                    data: {
                        op: "pick_order_status",
                        id: e[s].id,
                        status: 1
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 2e3
                        }), e[s].status = 1, t.setData({
                            list: e
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    input: function(a) {
        this.setData({
            search: a.detail.value
        });
    },
    search: function() {
        var e = this, a = e.data.search;
        "" != a && null != a ? (e.setData({
            page: 1,
            isbottom: !1,
            list: []
        }), app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                content: a
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !1
                });
            }
        })) : wx.showModal({
            title: "错误",
            content: "请输入订单号"
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !1
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
                op: "pick_order",
                page: e.data.page,
                pagesize: e.data.pagesize
            };
            "" != e.data.search && null != e.data.search && (a.content = e.data.search), app.util.request({
                url: "entry/wxapp/manage",
                method: "POST",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data ? e.setData({
                        list: e.data.list.concat(t.data),
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !1
                    });
                }
            });
        }
    }
});