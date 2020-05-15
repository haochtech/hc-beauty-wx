var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../card/card"
    },
    to_get: function(a) {
        var o = this;
        if (1 == o.data.userinfo.card) {
            var n = a.currentTarget.dataset.index;
            -1 == o.data.coupon[n].user && app.util.request({
                url: "entry/wxapp/index",
                data: {
                    op: "set_coupon",
                    id: o.data.coupon[n].id
                },
                success: function(a) {
                    if ("" != a.data.data) {
                        wx.showToast({
                            title: "领取成功",
                            icon: "success",
                            duration: 2e3
                        });
                        var t = o.data.coupon;
                        t[n].user = 1, o.setData({
                            coupon: t
                        });
                    }
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请先开通会员",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    to_edit: function(a) {
        var t = a.currentTarget.dataset.index;
        1 == t ? wx.navigateTo({
            url: "info?&edit=1"
        }) : 2 == t && wx.navigateTo({
            url: "info?&edit=2"
        });
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "card"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.card && null != t.data.card && o.setData({
                    card: t.data.card
                }), "" != t.data.coupon && null != t.data.coupon && o.setData({
                    coupon: t.data.coupon
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/user",
            showLoading: !1,
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && o.setData({
                    userinfo: t.data
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});