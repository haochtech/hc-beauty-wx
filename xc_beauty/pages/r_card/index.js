var app = getApp(), common = require("../common/common.js"), WxParse = require("../../../wxParse/wxParse.js");

function wxpay(t, a) {
    t.appId;
    var n = t.timeStamp.toString(), e = t.package, o = t.nonceStr, r = t.paySign.toUpperCase();
    wx.requestPayment({
        timeStamp: n,
        nonceStr: o,
        package: e,
        signType: "MD5",
        paySign: r,
        success: function(t) {
            wx.showToast({
                title: "购买成功"
            }), setTimeout(function() {
                wx.reLaunch({
                    url: "user"
                });
            }, 2e3);
        },
        fail: function(t) {
            console.log(t);
        }
    });
}

Page({
    data: {
        curr: -1
    },
    tab: function(t) {
        var a = t.currentTarget.dataset.index;
        a != this.data.curr && this.setData({
            curr: a
        });
    },
    submit: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/rcard",
            data: {
                curr: n.data.curr
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && (2 == a.data.status ? (wx.showToast({
                    title: "购买成功"
                }), setTimeout(function() {
                    wx.reLaunch({
                        url: "user"
                    });
                }, 2e3)) : 1 == a.data.status && wxpay(a.data, n));
            }
        });
    },
    onLoad: function(t) {
        var n = this;
        common.config(n), common.theme(n), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "r_card"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && (n.setData({
                    list: a.data
                }), "" != a.data.list && null != a.data.list && n.setData({
                    curr: 0
                }), "" != a.data.content && null != a.data.content && WxParse.wxParse("content", "html", a.data.content, n, 5));
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "r_card"
            },
            success: function(t) {
                var a = t.data;
                wx.stopPullDownRefresh(), "" != a.data && (n.setData({
                    list: a.data
                }), "" != a.data.list && null != a.data.list && n.setData({
                    curr: 0
                }), "" != a.data.content && null != a.data.content && WxParse.wxParse("content", "html", a.data.content, n, 5));
            }
        });
    },
    onReachBottom: function() {}
});