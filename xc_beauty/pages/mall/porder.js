var app = getApp(), common = require("../common/common.js");

function wxpay(t, a) {
    t.appId;
    var e = t.timeStamp.toString(), s = t.package, d = t.nonceStr, o = t.paySign.toUpperCase();
    t.out_trade_no;
    wx.requestPayment({
        timeStamp: e,
        nonceStr: d,
        package: s,
        signType: "MD5",
        paySign: o,
        success: function(t) {
            wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                wx.redirectTo({
                    url: "../mall_order/mall_order"
                });
            }, 2e3);
        }
    });
}

Page({
    data: {
        amount: 0,
        o_amount: 0,
        ticketCurr: 0,
        showTicket: !1,
        pay_type: 2,
        service_type: 1
    },
    input: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    showTicket: function() {
        this.setData({
            showTicket: !0
        });
    },
    tchoice: function(t) {
        var a = t.currentTarget.id;
        this.setData({
            ticketCurr: a,
            showTicket: !1
        }), this.get_sum();
    },
    store_on: function() {
        this.setData({
            store_page: !0
        });
    },
    store_close: function() {
        this.setData({
            store_page: !1
        });
    },
    store_choose: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list.store;
        this.setData({
            store_page: !1,
            store_id: e[a].id,
            store_name: e[a].name,
            ticketCurr: 0
        });
    },
    pay_choose: function(t) {
        var a = t.currentTarget.dataset.index;
        a != this.data.pay_type && this.setData({
            pay_type: a
        });
    },
    service_choose: function(t) {
        var a = t.currentTarget.dataset.index;
        a != this.data.service_type && this.setData({
            service_type: a
        });
    },
    submit: function(t) {
        var e = this;
        if ("" != e.data.address && null != e.data.address) if ("" != e.data.store_id && null != e.data.store_id) if (2 == e.data.pay_type) e.setData({
            sign: !0,
            shadow: !0,
            form_id: t.detail.formId
        }); else {
            var a = {
                address: JSON.stringify(e.data.address),
                form_id: t.detail.formId,
                store: e.data.store_id
            };
            "" != e.data.content && null != e.data.content && (a.content = e.data.content), 
            0 < e.data.ticketCurr && (a.coupon = e.data.list.coupon[e.data.ticketCurr - 1].id), 
            "" != e.data.exchange && null != e.data.exchange ? (a.exchange = e.data.exchange, 
            a.id = e.data.list.id) : (a.format = e.data.format, a.id = e.data.id), a.member = e.data.member, 
            a.pay_type = e.data.pay_type, a.service_type = e.data.service_type, "" != e.data.list.prize && null != e.data.list.prize && (a.prize = e.data.list.prize.id), 
            app.util.request({
                url: "entry/wxapp/mallorder",
                data: a,
                success: function(t) {
                    var a = t.data;
                    "" != a.data && (1 == a.data.status ? "" != a.data.errno && null != a.data.errno ? wx.showModal({
                        title: "错误",
                        content: a.data.message,
                        showCancel: !1
                    }) : wxpay(a.data, e) : 2 == a.data.status && (wx.showToast({
                        title: "支付成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.redirectTo({
                            url: "../mall_order/mall_order"
                        });
                    }, 2e3)));
                }
            });
        } else wx.showModal({
            title: "错误",
            content: "请选择门店"
        }); else wx.showModal({
            title: "错误",
            content: "请选择地址"
        });
    },
    onLoad: function(t) {
        var s = this;
        common.config(s), common.theme(s);
        var a = {
            op: "porder"
        };
        "" != t.id && null != t.id && (s.setData({
            id: t.id
        }), a.id = t.id), "" != t.format && null != t.format && (s.setData({
            format: t.format
        }), a.format = t.format), "" != t.member && null != t.member && (s.setData({
            member: t.member
        }), a.member = t.member), "" != t.exchange && null != t.exchange && (s.setData({
            exchange: t.exchange,
            member: 1
        }), a.exchange = t.exchange), wx.getLocation({
            type: "wgs84",
            success: function(t) {
                var a = t.latitude, e = t.longitude;
                t.speed, t.accuracy;
                s.setData({
                    latitude: a,
                    longitude: e
                });
            },
            complete: function() {
                null != s.data.latitude && "" != s.data.latitude && (a.latitude = s.data.latitude), 
                null != s.data.longitude && "" != s.data.longitude && (a.longitude = s.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/user",
                    data: a,
                    success: function(t) {
                        var a = t.data;
                        "" != a.data && (s.setData({
                            list: a.data
                        }), "" != a.data.user_store && null != a.data.user_store && s.setData({
                            store_id: a.data.user_store.id,
                            store_name: a.data.user_store.name
                        }), "" != a.data.userinfo && null != a.data.userinfo && (s.setData({
                            userinfo: a.data.userinfo
                        }), 1 != a.data.userinfo.card && s.setData({
                            pay_type: 1
                        })), s.get_sum());
                    }
                });
            }
        }), 2 == app.config.content.mall_pei && s.setData({
            service_type: 2
        }), app.util.request({
            url: "entry/wxapp/index",
            showLoading: !1,
            data: {
                op: "card"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && (s.setData({
                    card: a.data
                }), s.get_sum());
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "address_default"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && e.setData({
                    address: a.data
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    get_sum: function() {
        var t = this, a = 0, e = 0;
        "" != t.data.exchange && null != t.data.exchange || "" == t.data.list || null == t.data.list || (e = -1 == t.data.format ? (parseInt(t.data.member) * parseFloat(t.data.list.price)).toFixed(2) : (parseInt(t.data.member) * parseFloat(t.data.list.format[t.data.format].price)).toFixed(2), 
        a = 0 < t.data.ticketCurr ? (parseFloat(e) - parseFloat(t.data.list.coupon[t.data.ticketCurr - 1].name)).toFixed(2) : e, 
        "" != t.data.list.prize && null != t.data.list.prize && (a = (parseFloat(a) - parseFloat(t.data.list.prize.price)).toFixed(2)), 
        "" != t.data.card && null != t.data.card && 1 == t.data.card.content.discount_status && 1 == t.data.userinfo.card && "" != t.data.card.content.discount && null != t.data.card.content.discount && (a = (parseFloat(a) * parseFloat(t.data.card.content.discount) / 10).toFixed(2))), 
        t.setData({
            o_amount: a,
            amount: e
        });
    },
    password_input: function(t) {
        this.setData({
            password: t.detail.value
        });
    },
    sign_close: function() {
        this.setData({
            password: "",
            shadow: !1,
            sign: !1
        });
    },
    sign_btn: function() {
        var e = this, t = e.data.password;
        if ("" != t && null != t) {
            var a = {
                address: JSON.stringify(e.data.address),
                form_id: e.data.form_id,
                store: e.data.store_id,
                password: e.data.password
            };
            "" != e.data.content && null != e.data.content && (a.content = e.data.content), 
            0 < e.data.ticketCurr && (a.coupon = e.data.list.coupon[e.data.ticketCurr - 1].id), 
            "" != e.data.exchange && null != e.data.exchange ? (a.exchange = e.data.exchange, 
            a.id = e.data.list.id) : (a.format = e.data.format, a.id = e.data.id), a.member = e.data.member, 
            a.pay_type = e.data.pay_type, a.service_type = e.data.service_type, "" != e.data.list.prize && null != e.data.list.prize && (a.prize = e.data.list.prize.id), 
            app.util.request({
                url: "entry/wxapp/mallorder",
                data: a,
                success: function(t) {
                    var a = t.data;
                    "" != a.data && (1 == a.data.status ? "" != a.data.errno && null != a.data.errno ? wx.showModal({
                        title: "错误",
                        content: a.data.message,
                        showCancel: !1
                    }) : wxpay(a.data, e) : 2 == a.data.status && (wx.showToast({
                        title: "支付成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.redirectTo({
                            url: "../mall_order/mall_order"
                        });
                    }, 2e3)));
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请输入密码"
        });
    }
});