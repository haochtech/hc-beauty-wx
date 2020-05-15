var app = getApp(), common = require("../common/common.js");

function count(e) {
    app.util.request({
        url: "entry/wxapp/manage",
        data: {
            op: "amount",
            year: e.data.year,
            month: e.data.month[e.data.month_curr],
            store: e.data.store_id
        },
        success: function(a) {
            var t = a.data;
            "" != t.data && e.setData({
                amount: t.data
            });
        }
    });
}

Page({
    data: {
        footer_curr: 5,
        page: 1,
        pagesize: 20,
        month: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
    },
    order_call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.detail.userinfo.mobile
        });
    },
    map: function() {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.detail.userinfo.map.latitude),
            longitude: parseFloat(a.data.detail.userinfo.map.longitude),
            address: a.data.detail.userinfo.map.address,
            scale: 28
        });
    },
    qie: function() {
        wx.reLaunch({
            url: "index"
        });
    },
    month_left: function() {
        var a = this, t = a.data.month_curr;
        0 == t ? a.setData({
            month_curr: 11,
            year: a.data.year - 1
        }) : a.setData({
            month_curr: t - 1
        }), count(a);
    },
    month_right: function() {
        var a = this, t = a.data.month_curr;
        11 == t ? a.setData({
            month_curr: 0,
            year: a.data.year + 1
        }) : a.setData({
            month_curr: t + 1
        }), count(a);
    },
    month_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.data.month_curr != e && (t.setData({
            month_curr: e
        }), count(t));
    },
    scan: function() {
        var e = this;
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(a) {
                console.log(a);
                var t = a.result;
                -1 != t.indexOf("score_") ? (t = t.split("_"), wx.navigateTo({
                    url: "../store_score/detail?&store_id=" + e.data.store_id + "&id=" + t[1]
                })) : -1 != t.indexOf("package_") ? (t = t.split("_"), app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "package_search",
                        id: t[1]
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            package_detail: t.data,
                            shadow: !0,
                            menu2: !0
                        });
                    }
                })) : app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_search",
                        id: a.result
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            detail: t.data,
                            shadow: !0,
                            menu: !0
                        });
                    }
                });
            }
        });
    },
    submit: function() {
        var t = this, e = t.data.detail;
        1 == e.status && -1 == e.use ? wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: e.id
                    },
                    success: function(a) {
                        "" != a.data.data && (e.is_use = parseInt(e.is_use) + 1, e.is_use == parseInt(e.can_use) && (e.use = 1), 
                        t.setData({
                            detail: e
                        }), wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        }) : 2 == e.status && -1 == e.refund_status && wx.showModal({
            title: "提示",
            content: "确定退款吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/orderrefund",
                    data: {
                        id: e.id
                    },
                    success: function(a) {
                        "" != a.data.data && (t.setData({
                            shadow: !1,
                            menu: !1
                        }), wx.showToast({
                            title: "退款成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1,
            menu2: !1
        });
    },
    input: function(a) {
        this.setData({
            search: a.detail.value
        });
    },
    search: function() {
        var a = this.data.search;
        "" != a && null != a ? wx.navigateTo({
            url: "../store_manager/member?&curr=1&search=" + a + "&id=" + this.data.store_id
        }) : wx.showModal({
            title: "错误",
            content: "请输入手机号"
        });
    },
    link: function(a) {
        var t = this, e = a.currentTarget.dataset.index, n = t.data.package_detail;
        app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "package_use",
                id: n.list[e].id,
                store: t.data.store_id
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "核销成功"
                }), n.list[e].is_member = parseInt(n.list[e].is_member) + 1, t.setData({
                    package_detail: n
                }));
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e);
        var t = new Date(), n = t.getFullYear(), s = t.getMonth();
        e.setData({
            year: n,
            month_curr: s,
            userinfo: app.userinfo
        }), "" != a.store_id && null != a.store_id && e.setData({
            store_id: a.store_id
        }), app.util.request({
            url: "entry/wxapp/user",
            showLoading: !1,
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    userinfo: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (e.setData({
                    member: t.data.member,
                    store_card: t.data.store_card,
                    card_on: t.data.card_on,
                    wxpay: t.data.wxpay,
                    recharge: t.data.recharge,
                    canpay: t.data.canpay
                }), "" != t.data.store && null != t.data.store && (e.setData({
                    store: t.data.store
                }), wx.setNavigationBarTitle({
                    title: t.data.store.name
                })), "" != t.data.store_manager && null != t.data.store_manager && e.setData({
                    store_manager: t.data.store_manager
                }), "" != t.data.all_amount && null != t.data.all_amount && e.setData({
                    all_amount: t.data.all_amount
                }), null != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                }));
            }
        }), count(e);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});