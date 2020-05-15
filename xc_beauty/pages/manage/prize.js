var a = getApp(), t = require("../common/common.js");

Page({
    data: {
        footer_curr: 5,
        curr: -1,
        page: 1,
        pagesize: 20
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
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            index: e,
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
        var t = this;
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(e) {
                console.log(e), a.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "prize_detail",
                        id: e.result
                    },
                    success: function(a) {
                        var e = a.data;
                        "" != e.data && t.setData({
                            detail: e.data,
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
            success: function(s) {
                s.confirm ? a.util.request({
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
                }) : s.cancel && console.log("用户点击取消");
            }
        });
    },
    submit2: function() {
        var t = this, e = t.data.detail;
        -1 == e.status && wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(s) {
                s.confirm ? a.util.request({
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
                }) : s.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(e) {
        var s = this;
        t.config(s), t.theme(s), a.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "prize",
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
                op: "prize",
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
        }), this.data.list;
    }
});