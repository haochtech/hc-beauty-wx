var app = getApp(), common = require("../common/common.js");

function wxpay(a, t) {
    a.appId;
    var e = a.timeStamp.toString(), n = a.package, r = a.nonceStr, o = a.paySign.toUpperCase();
    wx.requestPayment({
        timeStamp: e,
        nonceStr: r,
        package: n,
        signType: "MD5",
        paySign: o,
        success: function(a) {
            wx.showToast({
                title: "充值成功",
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                wx.navigateBack({
                    delta: 1
                });
            }, 2e3);
        },
        fail: function(a) {}
    });
}

function sign(a) {
    var t = a.data.username, e = a.data.curr, n = a.data.mobile, r = a.data.name, o = a.data.amount, s = !0;
    if ("" != t && null != t || (s = !1), 1 == e) {
        "" != n && null != n || (s = !1);
        /^[1][0-9]{10}$/.test(n) || (s = !1);
    } else 2 == e && ("" != r && null != r || (s = !1));
    "" != o && null != o || (s = !1), a.setData({
        submit: s
    });
}

Page({
    data: {
        curr: 1,
        submit: !1,
        over: 0,
        over2: -1
    },
    choose: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            over: t,
            over2: -1
        });
    },
    choose2: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            over2: t,
            over: -1
        });
    },
    tab: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.curr && this.setData({
            curr: t
        });
    },
    all: function() {
        var a = this;
        1 == a.data.order_type ? a.setData({
            amount: a.data.userinfo.money
        }) : 2 == a.data.order_type && a.setData({
            amount: a.data.userinfo.share_o_amount
        }), sign(a);
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "amount":
            t.setData({
                amount: a.detail.value
            });
            break;

          case "username":
            t.setData({
                username: a.detail.value
            });
            break;

          case "mobile":
            t.setData({
                mobile: a.detail.value
            });
            break;

          case "name":
            t.setData({
                name: a.detail.value
            });
        }
    },
    submit: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        if (1 == t) {
            if (-1 != e.data.over && -1 == e.data.over2) {
                var n = {
                    amount: e.data.card.content.recharge[e.data.over].r_price
                };
                "" != e.data.card.content.recharge[e.data.over].g_price && null != e.data.card.content.recharge[e.data.over].g_price && (n.gift = e.data.card.content.recharge[e.data.over].g_price);
            } else if (-1 != e.data.over2 && -1 == e.data.over) n = {
                id: e.data.card.prize[e.data.over2].id
            };
            n.form_id = a.detail.formId, app.util.request({
                url: "entry/wxapp/cardorder",
                data: n,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && ("" != t.data.errno && null != t.data.errno ? wx.showModal({
                        title: "错误",
                        content: t.data.message,
                        showCancel: !1
                    }) : wxpay(t.data, e));
                }
            });
        } else if (2 == t) if (sign(e), e.data.submit) {
            n = {
                username: e.data.username,
                amount: e.data.amount,
                pay_type: e.data.curr,
                order_type: e.data.order_type
            };
            1 == e.data.curr ? n.mobile = e.data.mobile : 2 == e.data.curr && (n.name = e.data.name), 
            app.util.request({
                url: "entry/wxapp/withdraw",
                data: n,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "申请成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2e3));
                }
            });
        } else wx.showModal({
            title: "错误",
            content: "请输入账号,金额",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            edit: a.edit
        }), "" != a.order_type && null != a.order_type && e.setData({
            order_type: a.order_type
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "card"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    card: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (t.data.money = parseFloat(t.data.money).toFixed(2), e.setData({
                    userinfo: t.data
                }));
            }
        }), 2 == e.data.order_type && app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "share"
            },
            showLoading: !1,
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    share: t.data
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