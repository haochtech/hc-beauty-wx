var app = getApp(), common = require("../common/common.js"), QR = require("../../../utils/qrcode.js");

Page({
    data: {
        curr: 1,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.curr && (e.setData({
            curr: t,
            list: [],
            page: 1,
            isbottom: !1
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "package_order",
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
    link: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id;
        "theme3" == this.data.theme.name ? wx.navigateTo({
            url: "../../ui2/store/porder?&package=" + t + "&package_service=" + e
        }) : wx.navigateTo({
            url: "../store/porder?&package=" + t + "&package_service=" + e
        });
    },
    up: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.list;
        e[t].up = -e[t].up, this.setData({
            list: e
        });
    },
    setcode: function(a) {
        var t = this, e = a.currentTarget.dataset.index, n = t.data.list, o = t.setCanvasSize();
        t.createQrCode("package_" + n[e].id, "mycanvas", o.w, o.h), t.setData({
            canshow: !0,
            menu: !0
        });
    },
    canshow: function() {
        this.setData({
            canshow: !1,
            menu: !1
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "package_order",
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
            url: "entry/wxapp/index",
            data: {
                op: "package_order",
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
    },
    setCanvasSize: function() {
        var a = {};
        try {
            var t = wx.getSystemInfoSync(), e = .4 * t.windowWidth, n = e;
            a.w = e, a.h = n;
        } catch (a) {
            console.log("获取设备信息失败" + a);
        }
        return a;
    },
    createQrCode: function(a, t, e, n) {
        QR.qrApi.draw(a, t, e, n);
        var o = this, s = setTimeout(function() {
            o.canvasToTempImage(), clearTimeout(s);
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