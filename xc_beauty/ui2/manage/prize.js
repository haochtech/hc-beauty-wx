var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        footer_curr: 4,
        curr: -1,
        page: 1,
        pagesize: 20,
        type: 1
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.curr && (e.setData({
            curr: t,
            page: 1,
            isbottom: !1,
            list: []
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "prize",
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
    menu_on: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            index: t,
            shadow: !0,
            menu: !0
        });
    },
    menu_close: function(a) {
        this.setData({
            shadow: !1,
            menu: !1,
            menu2: !1
        });
    },
    scan: function() {
        var e = this;
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(a) {
                console.log(a), app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "prize_detail",
                        id: a.result
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            detail: t.data,
                            shadow: !0,
                            menu2: !0
                        });
                    }
                });
            }
        });
    },
    submit: function() {
        var t = this, e = t.data.list;
        -1 == e[t.data.index].status && wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "prize_status",
                        id: e[t.data.index].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }), e[t.data.index].status = 1, t.setData({
                            list: e
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    submit2: function() {
        var t = this, e = t.data.detail;
        -1 == e.status && wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "prize_status",
                        id: e.id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }), e.status = 1, t.setData({
                            detail: e
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), null != a.store_id && "" != a.store_id && e.setData({
            store_id: a.store_id
        }), "" != a.type && null != a.type && e.setData({
            type: a.type,
            footer_curr: 0
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
                op: "prize",
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
                op: "prize",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.curr
            },
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
        this.data.list;
    }
});