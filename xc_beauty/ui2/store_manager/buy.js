var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.userinfo, o = a.data.amount, n = "";
    "" != o && null != o || (n = "请输入金额"), "" != t && null != t || (n = "请选择会员"), "" == n ? a.setData({
        submit: !0
    }) : wx.showModal({
        title: "错误",
        content: n
    });
}

Page({
    data: {
        o_amount: "0.00",
        submit: !1,
        pay_type: 2,
        coupon_curr: -1
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "search":
            t.setData({
                search: a.detail.value
            });
            break;

          case "amount":
            var o = "0.00";
            "" == a.detail.value || isNaN(parseFloat(a.detail.value)) || (o = a.detail.value), 
            1 == t.data.userinfo.card && 1 == t.data.card.content.discount_status && 1 == t.data.config.buy_sale_status && (o = (parseFloat(o) * parseFloat(t.data.card.content.discount) * .1).toFixed(2)), 
            t.setData({
                amount: a.detail.value,
                o_amount: o,
                coupon_curr: -1,
                coupon_price: null
            });
            break;

          case "content":
            t.setData({
                content: a.detail.value
            });
        }
    },
    menu_on: function() {
        var o = this;
        o.setData({
            menu: !0,
            shadow: !0
        }), "" != o.data.o_amount && null != o.data.o_amount && "0.00" != o.data.o_amount && app.util.request({
            url: "entry/wxapp/order",
            showLoading: !1,
            data: {
                op: "coupon",
                amount: o.data.o_amount
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && o.setData({
                    coupon: t.data
                });
            }
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1,
            pay: !1
        });
    },
    coupon_choose: function(a) {
        var t = this, o = a.currentTarget.dataset.index;
        if (o != t.data.coupon_curr) {
            var n = t.data.coupon[o].coupon.name, e = t.data.o_amount;
            e = (parseFloat(e) - parseFloat(n)).toFixed(2), t.setData({
                coupon_curr: o,
                coupon_price: n,
                o_amount: e
            });
        } else {
            e = t.data.list.amount;
            var u = t.data.card;
            "" != u && null != u && 1 == u.content.discount_status && (e = (parseFloat(e) * parseFloat(u.content.discount) / 10).toFixed(2)), 
            t.setData({
                coupon_curr: -1,
                coupon_price: null,
                o_amount: e
            });
        }
    },
    submit: function() {
        var o = this, a = o.data.search;
        "" != a && null != a ? app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "member_search",
                search: o.data.search,
                store: o.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (o.setData({
                    userinfo: t.data
                }), app.util.request({
                    url: "entry/wxapp/index",
                    showLoading: !1,
                    data: {
                        op: "card"
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && (1 == t.data.content.level_status && 1 == o.data.userinfo.card && "" != o.data.userinfo.card_price && null != o.data.userinfo.card_price && (t.data.content.discount = o.data.userinfo.card_price), 
                        o.setData({
                            card: t.data
                        }));
                    }
                }));
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入手机号"
        });
    },
    pay: function() {
        var t = this;
        if (sign(t), t.data.submit) {
            var a = {
                store: t.data.store_id,
                pay_type: t.data.pay_type,
                amount: t.data.amount,
                openid: t.data.userinfo.openid
            };
            -1 != t.data.coupon_curr && (a.coupon_id = t.data.coupon[t.data.coupon_curr].cid), 
            "" != t.data.content && null != t.data.content && (a.content = t.data.content), 
            app.util.request({
                url: "entry/wxapp/adminbuy",
                data: a,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "买单成功",
                        icon: "success",
                        duration: 2e3
                    }), t.setData({
                        userinfo: "",
                        amount: "",
                        o_amount: "0.00",
                        submit: !1,
                        pay_type: 2,
                        coupon_curr: -1,
                        content: ""
                    }));
                }
            });
        }
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), o.setData({
            store_id: a.store_id
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
                }), "" != t.data.store_manager && null != t.data.store_manager && o.setData({
                    store_manager: t.data.store_manager
                }));
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