var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.id, e = a.data.userinfo, n = a.data.amount, o = a.data.member_id, d = !0;
    "" != t && null != t || (d = !1), "" != o && null != o || (d = !1), "" != e && null != e || (d = !1), 
    "" != n && null != n || (d = !1), a.setData({
        submit: d
    });
}

function wxpay(a, t) {
    a.appId;
    var e = a.timeStamp.toString(), n = a.package, o = a.nonceStr, d = a.paySign.toUpperCase();
    wx.requestPayment({
        timeStamp: e,
        nonceStr: o,
        package: n,
        signType: "MD5",
        paySign: d,
        success: function(a) {
            wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                "theme3" == t.data.theme.name ? wx.reLaunch({
                    url: "../../ui2/index/index"
                }) : wx.reLaunch({
                    url: "../index/index"
                });
            }, 2e3);
        },
        fail: function(a) {}
    });
}

Page({
    data: {
        id: "",
        o_amount: "0.00",
        submit: !1,
        pay_type: 2,
        coupon_curr: -1
    },
    qie: function() {
        var e = this;
        -1 != e.data.id && (e.setData({
            store_page: !0,
            store_list: []
        }), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "store"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    store_list: t.data
                });
            }
        }));
    },
    store_close: function() {
        this.setData({
            store_page: !1
        });
    },
    store_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            list: t.data.store_list[e],
            id: t.data.store_list[e].id,
            store_page: !1,
            memner_id: "",
            member_name: ""
        }), sign(t);
    },
    call: function(a) {
        var t = this;
        "" != t.data.id && null != t.data.id && (-1 == t.data.id ? wx.makePhoneCall({
            phoneNumber: t.data.map.content.mobile
        }) : wx.makePhoneCall({
            phoneNumber: t.data.list.mobile
        }));
    },
    map: function(a) {
        var t = this;
        "" != t.data.id && null != t.data.id && (-1 == t.data.id ? wx.openLocation({
            latitude: parseFloat(t.data.map.content.latitude),
            longitude: parseFloat(t.data.map.content.longitude),
            name: t.data.map.content.address,
            address: t.data.map.content.address,
            scale: 28
        }) : wx.openLocation({
            latitude: parseFloat(t.data.list.map.latitude),
            longitude: parseFloat(t.data.list.map.longitude),
            name: t.data.list.address,
            address: t.data.list.address,
            scale: 28
        }));
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "amount":
            var e = "0.00";
            "" == a.detail.value || isNaN(parseFloat(a.detail.value)) || (e = a.detail.value), 
            console.log(e), 1 == t.data.userinfo.card && 1 == t.data.card.content.discount_status && 1 == t.data.config.buy_sale_status && (e = (parseFloat(e) * parseFloat(t.data.card.content.discount) * .1).toFixed(2)), 
            t.setData({
                amount: a.detail.value,
                o_amount: parseFloat(e).toFixed(2),
                coupon_curr: -1,
                coupon_price: null
            });
            break;

          case "content":
            t.setData({
                content: a.detail.value
            });
            break;

          case "password":
            t.setData({
                password: a.detail.value
            });
        }
        sign(t);
    },
    menu_on: function() {
        var e = this;
        e.setData({
            menu: !0,
            shadow: !0
        }), "" != e.data.o_amount && null != e.data.o_amount && app.util.request({
            url: "entry/wxapp/order",
            showLoading: !1,
            data: {
                op: "coupon",
                amount: e.data.amount,
                store: e.data.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    coupon: t.data
                }) : e.setData({
                    coupon: []
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
        var t = this, e = a.currentTarget.dataset.index;
        if (e != t.data.coupon_curr) {
            var n = t.data.coupon[e].coupon.name, o = t.data.amount;
            d = 1 == t.data.userinfo.card && 1 == t.data.card.content.discount_status ? (parseFloat(o) * parseFloat(t.data.card.content.discount) * .1).toFixed(2) : o, 
            d = (parseFloat(d) - parseFloat(n)).toFixed(2), t.setData({
                coupon_curr: e,
                coupon_price: n,
                o_amount: d
            });
        } else {
            var d;
            t.data.card, o = t.data.amount;
            d = 1 == t.data.userinfo.card && 1 == t.data.card.content.discount_status ? (parseFloat(o) * parseFloat(t.data.card.content.discount) * .1).toFixed(2) : o, 
            t.setData({
                coupon_curr: -1,
                coupon_price: null,
                o_amount: d
            });
        }
    },
    pay_on: function() {
        var a = this;
        if (a.data.submit) {
            if (1 == a.data.userinfo.card) if (parseFloat(a.data.o_amount) > parseFloat(a.data.userinfo.money)) {
                var t = (parseFloat(a.data.o_amount) - parseFloat(a.data.userinfo.money)).toFixed(2);
                a.setData({
                    tip: !0,
                    tip_amount: t
                });
            } else a.setData({
                tip: !1
            }); else a.setData({
                tip: !1
            });
            a.setData({
                shadow: !0,
                pay: !0
            });
        }
    },
    pay_choose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.pay_type && this.setData({
            pay_type: t
        });
    },
    member_on: function() {
        var e = this;
        "" != e.data.id && null != e.data.id ? app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "store_member",
                id: e.data.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    member_list: t.data,
                    member_page: !0
                }) : wx.showModal({
                    title: "提示",
                    content: "暂无店员",
                    showCancel: !1
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请先选择门店",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    member_close: function() {
        this.setData({
            member_page: !1
        });
    },
    member_choose: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.member_list;
        this.setData({
            member_id: e[t].id,
            member_name: e[t].name,
            member_page: !1
        }), sign(this);
    },
    onLoad: function(a) {
        var n = this;
        common.config(n), common.theme(n);
        var t = {
            op: "store_order"
        };
        "" != a.id && null != a.id && (n.setData({
            id: a.id,
            map: app.map
        }), t.id = a.id), "" != a.buy && null != a.buy && (t.buy = a.buy), wx.getLocation({
            type: "wgs84",
            success: function(a) {
                var t = a.latitude, e = a.longitude;
                a.speed, a.accuracy;
                n.setData({
                    latitude: t,
                    longitude: e
                });
            },
            complete: function() {
                null != n.data.latitude && "" != n.data.latitude && (t.latitude = n.data.latitude), 
                null != n.data.longitude && "" != n.data.longitude && (t.longitude = n.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/service",
                    data: t,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && ("" != t.data.list && null != t.data.list && n.setData({
                            list: t.data.list,
                            id: t.data.list.id
                        }), "" != t.data.member && null != t.data.member && n.setData({
                            member_id: t.data.member.id,
                            member_name: t.data.member.name
                        }), n.setData({
                            more_store: t.data.more_store
                        }));
                    }
                });
            }
        }), app.util.request({
            url: "entry/wxapp/user",
            showLoading: !1,
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (n.setData({
                    userinfo: t.data
                }), app.util.request({
                    url: "entry/wxapp/index",
                    showLoading: !1,
                    data: {
                        op: "card"
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && (1 == t.data.content.level_status && 1 == n.data.userinfo.card && null != n.data.userinfo.card_price && "" != n.data.userinfo.card_price && (t.data.content.discount = n.data.userinfo.card_price), 
                        n.setData({
                            card: t.data
                        }));
                    }
                }));
            }
        });
    },
    submit: function(a) {
        var e = this;
        if (1 == e.data.pay_type) {
            var t = {
                store: e.data.id,
                pay_type: e.data.pay_type,
                amount: e.data.amount,
                member: e.data.member_id
            };
            -1 != e.data.coupon_curr && (t.coupon_id = e.data.coupon[e.data.coupon_curr].cid), 
            "" != e.data.content && null != e.data.content && (t.content = e.data.content), 
            app.util.request({
                url: "entry/wxapp/orderbuy",
                data: t,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && (1 == t.data.status ? "" != t.data.errno && null != t.data.errno ? wx.showModal({
                        title: "错误",
                        content: t.data.message,
                        showCancel: !1
                    }) : wxpay(t.data, e) : 2 == t.data.status && (wx.showToast({
                        title: "支付成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        "theme3" == theme.name ? wx.reLaunch({
                            url: "../../ui2/index/index"
                        }) : wx.reLaunch({
                            url: "../index/index"
                        });
                    }, 2e3)));
                }
            });
        } else 2 == e.data.pay_type && e.setData({
            pay: !1,
            sign: !0
        });
    },
    sign_close: function() {
        this.setData({
            shadow: !1,
            sign: !1,
            password: ""
        });
    },
    sign_btn: function() {
        var e = this, a = e.data.password;
        if ("" == a || null == a) e.setData({
            sign_error: !0
        }); else {
            var t = {
                store: e.data.id,
                pay_type: e.data.pay_type,
                password: a,
                amount: e.data.amount,
                member: e.data.member_id
            };
            -1 != e.data.coupon_curr && (t.coupon_id = e.data.coupon[e.data.coupon_curr].cid), 
            "" != e.data.content && null != e.data.content && (t.content = e.data.content), 
            app.util.request({
                url: "entry/wxapp/orderbuy",
                data: t,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && (e.setData({
                        shadow: !1,
                        sign: !1,
                        password: ""
                    }), 1 == t.data.status ? "" != t.data.errno && null != t.data.errno ? wx.showModal({
                        title: "错误",
                        content: t.data.message,
                        showCancel: !1
                    }) : wxpay(t.data, e) : 2 == t.data.status && (wx.showToast({
                        title: "支付成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        "theme3" == e.data.theme.name ? wx.reLaunch({
                            url: "../../ui2/index/index"
                        }) : wx.reLaunch({
                            url: "../index/index"
                        });
                    }, 2e3)));
                }
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});