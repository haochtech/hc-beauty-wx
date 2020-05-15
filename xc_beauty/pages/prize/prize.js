var app = getApp(), common = require("../common/common.js"), QR = require("../../../utils/qrcode.js");

Page({
    data: {
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    code: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            maskHidden: !1
        }), wx.showToast({
            title: "生成中...",
            icon: "loading",
            duration: 2e3
        });
        var o = setTimeout(function() {
            wx.hideToast();
            var a = t.setCanvasSize();
            t.createQrCode(t.data.list[e].id, "mycanvas", a.w, a.h), t.setData({
                maskHidden: !0,
                shadow: !0,
                menu: !0
            }), clearTimeout(o);
        }, 2e3);
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "prize",
                page: e.data.page,
                pagesize: e.data.pagesize
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
            url: "entry/wxapp/user",
            data: {
                op: "prize",
                page: e.data.page,
                pagesize: e.data.pagesize
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
            var t = wx.getSystemInfoSync(), e = .42666666 * t.windowWidth, o = e;
            a.w = e, a.h = o;
        } catch (a) {
            console.log("获取设备信息失败" + a);
        }
        return a;
    },
    createQrCode: function(a, t, e, o) {
        QR.qrApi.draw(a, t, e, o);
        var n = this, i = setTimeout(function() {
            n.canvasToTempImage(), clearTimeout(i);
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
    },
    previewImg: function(a) {
        var t = this.data.imagePath;
        wx.previewImage({
            current: t,
            urls: [ t ]
        });
    }
});