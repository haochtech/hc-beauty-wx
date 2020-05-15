var app = getApp(), common = require("../common/common.js"), QR = require("../../../utils/qrcode.js");

Page({
    data: {},
    order_del: function(a) {
        var t = this;
        wx.showModal({
            title: "提示",
            content: "确定取消订单吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/order",
                    data: {
                        op: "order_del",
                        id: t.data.list.id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "取消成功",
                            icon: "success",
                            duration: 2e3
                        }), wx.navigateBack({
                            delta: 1
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    pay: function() {
        var a = this;
        "theme3" == a.data.theme.name ? wx.navigateTo({
            url: "../../ui2/porder/pay?&out_trade_no=" + a.data.list.out_trade_no
        }) : wx.navigateTo({
            url: "../porder/pay?&out_trade_no=" + a.data.list.out_trade_no
        });
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "detail",
                out_trade_no: a.out_trade_no
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    if (1 == t.data.status) {
                        o.setData({
                            maskHidden: !1
                        }), wx.showToast({
                            title: "生成中...",
                            icon: "loading",
                            duration: 2e3
                        });
                        var e = setTimeout(function() {
                            wx.hideToast();
                            var a = o.setCanvasSize();
                            o.createQrCode(t.data.id, "mycanvas", a.w, a.h), o.setData({
                                maskHidden: !0,
                                shadow: !0,
                                code: !0
                            }), clearTimeout(e);
                        }, 2e3);
                    }
                    o.setData({
                        list: t.data
                    });
                }
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    setCanvasSize: function() {
        var a = {};
        try {
            var t = wx.getSystemInfoSync(), e = .53 * t.windowWidth, o = e;
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