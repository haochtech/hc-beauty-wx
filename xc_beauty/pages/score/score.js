var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        mobile: "",
        score: ""
    },
    to_coupon: function(t) {
        var o = this, n = t.currentTarget.dataset.index;
        -1 == o.data.list[n].user && (1 == o.data.userinfo.card ? wx.showModal({
            title: "提示",
            content: "确定兑换优惠券吗？",
            success: function(t) {
                t.confirm ? app.util.request({
                    url: "entry/wxapp/order",
                    data: {
                        op: "to_coupon",
                        id: o.data.list[n].id
                    },
                    success: function(t) {
                        if ("" != t.data.data) {
                            wx.showToast({
                                title: "兑换成功",
                                icon: "success",
                                duration: 2e3
                            });
                            var a = o.data.list, e = o.data.userinfo;
                            e.score = parseInt(e.score) - parseInt(a[n].score), a[n].user = 1, o.setData({
                                list: a,
                                userinfo: e
                            });
                        }
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        }) : wx.showModal({
            title: "错误",
            content: "请先开通会员！",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }));
    },
    score_give: function() {
        this.setData({
            yin1: !0
        });
    },
    input: function(t) {
        switch (t.currentTarget.dataset.name) {
          case "mobile":
            this.setData({
                mobile: t.detail.value
            });
            break;

          case "score":
            this.setData({
                score: t.detail.value
            });
        }
    },
    menu_next: function() {
        var e = this, t = e.data.mobile;
        "" != t && null != t ? app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "score_user",
                mobile: e.data.mobile
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && e.setData({
                    score_user: a.data,
                    yin1: !1,
                    yin2: !0
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入手机号码",
            showCancel: !1
        });
    },
    submit: function() {
        var e = this, t = e.data.score;
        "" != t && null != t && 0 < parseInt(t) ? app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "score_give",
                score: e.data.score,
                id: e.data.score_user.id
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && (wx.showToast({
                    title: "转赠成功"
                }), e.setData({
                    yin1: !1,
                    yin2: !1,
                    mobile: "",
                    score: "",
                    userinfo: a.data
                }));
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入转增积分",
            showCancel: !1
        });
    },
    menu_close: function() {
        this.setData({
            yin1: !1,
            yin2: !1
        });
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && (a.data.money = parseFloat(a.data.money).toFixed(2), e.setData({
                    userinfo: a.data
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "score_coupon"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && e.setData({
                    list: a.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});