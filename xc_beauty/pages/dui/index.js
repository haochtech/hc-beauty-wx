var app = getApp(), common = require("../common/common.js"), QR = require("../../../utils/qrcode.js");

Page({
    data: {
        tab: [ "全部", "待核销", "已核销" ],
        tabCurr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tabChange: function(a) {
        var e = this, t = a.currentTarget.id;
        if (t != e.data.tabCurr) {
            e.setData({
                tabCurr: t,
                page: 1,
                isbottom: !1
            });
            var o = {
                op: "score_log",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.tabCurr
            };
            app.util.request({
                url: "entry/wxapp/order",
                data: o,
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
    shFunc: function(a) {
        var t = this, e = a.currentTarget.dataset.index, o = t.data.list, n = t.setCanvasSize();
        t.createQrCode("score_" + o[e].id, "mycanvas", n.w, n.h), t.setData({
            canshow: !0,
            menu: !0
        });
    },
    canshow: function() {
        this.setData({
            canshow: !1,
            menu: !1,
            menu2: !1
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e);
        var t = {
            op: "score_log",
            page: e.data.page,
            pagesize: e.data.pagesize,
            curr: e.data.tabCurr
        };
        app.util.request({
            url: "entry/wxapp/order",
            data: t,
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
                op: "score_log",
                page: e.data.page,
                pagesize: e.data.pagesize,
                curr: e.data.tabCurr
            };
            app.util.request({
                url: "entry/wxapp/order",
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
    },
    setCanvasSize: function() {
        var a = {};
        try {
            var t = wx.getSystemInfoSync(), e = .4 * t.windowWidth, o = e;
            a.w = e, a.h = o;
        } catch (a) {
            console.log("获取设备信息失败" + a);
        }
        return a;
    },
    createQrCode: function(a, t, e, o) {
        QR.qrApi.draw(a, t, e, o);
        var n = this, s = setTimeout(function() {
            n.canvasToTempImage(), clearTimeout(s);
        }, 3e3);
    },
    canvasToTempImage: function() {
        var e = this;
        wx.canvasToTempFilePath({
            canvasId: "mycanvas",
            success: function(a) {
                var t = a.tempFilePath;
                console.log(t), e.setData({
                    imagePath: t
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    }
});