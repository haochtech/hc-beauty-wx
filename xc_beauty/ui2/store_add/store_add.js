var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var e = a.data.userinfo, t = a.data.member_id, n = a.data.service_id, r = "";
    "" != n && null != n || (r = "请选择项目"), "" != t && null != t || (r = "请选择人员"), "" != e && null != e || "" != a.data.name && null != a.data.name && "" != a.data.mobile && null != a.data.mobile || (r = "请选择会员或输入姓名电话"), 
    "" == r ? a.setData({
        submit: !0
    }) : wx.showModal({
        title: "错误",
        content: r
    });
}

function getPackage(t) {
    "" != t.data.service_id && null != t.data.service_id && "" != t.data.store_id && null != t.data.store_id && "" != t.data.userinfo && null != t.data.userinfo ? app.util.request({
        url: "entry/wxapp/index",
        data: {
            op: "getPackage",
            service: t.data.service_id,
            store: t.data.store_id,
            openid: t.data.userinfo.openid
        },
        success: function(a) {
            var e = a.data;
            "" != e.data ? t.setData({
                package_list: e.data
            }) : t.setData({
                package_list: "",
                package_curr: -1
            });
        }
    }) : t.setData({
        package_list: "",
        package_curr: -1
    });
}

function get_amount(a) {
    var e = a.data.amount;
    "" != a.data.coupon_price && null != a.data.coupon_price && (e = (parseFloat(e) - parseFloat(a.data.coupon_price)).toFixed(2)), 
    -1 != a.data.package_curr && (e = 0), a.setData({
        o_amount: e
    });
}

Page({
    data: {
        o_amount: "0.00",
        submit: !1,
        pay_type: 3,
        coupon_curr: -1,
        package_curr: -1
    },
    pay_choose: function(a) {
        var e = a.currentTarget.dataset.index;
        e != this.data.pay_type && this.setData({
            pay_type: e
        });
    },
    input: function(a) {
        var e = this;
        switch (a.currentTarget.dataset.name) {
          case "search":
            e.setData({
                search: a.detail.value
            });
            break;

          case "content":
            e.setData({
                content: a.detail.value
            });
            break;

          case "name":
            e.setData({
                name: a.detail.value
            });
            break;

          case "mobile":
            e.setData({
                mobile: a.detail.value
            });
        }
    },
    menu_on: function() {
        var t = this;
        t.setData({
            menu: !0,
            shadow: !0
        }), "" != t.data.o_amount && null != t.data.o_amount && "0.00" != t.data.o_amount && app.util.request({
            url: "entry/wxapp/order",
            showLoading: !1,
            data: {
                op: "coupon",
                amount: t.data.o_amount
            },
            success: function(a) {
                var e = a.data;
                "" != e.data && t.setData({
                    coupon: e.data
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
        var e = this, t = a.currentTarget.dataset.index;
        if (t != e.data.coupon_curr) {
            var n = e.data.coupon[t].coupon.name;
            e.setData({
                coupon_curr: t,
                coupon_price: n
            });
        } else e.setData({
            coupon_curr: -1,
            coupon_price: null
        });
        get_amount(e);
    },
    submit: function() {
        var t = this, a = t.data.search;
        "" != a && null != a ? app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "member_search",
                search: t.data.search,
                store: t.data.store_id
            },
            success: function(a) {
                var e = a.data;
                "" != e.data && (t.setData({
                    userinfo: e.data
                }), getPackage(t));
            }
        }) : (t.setData({
            userinfo: ""
        }), getPackage(t));
    },
    pay: function() {
        var e = this;
        if (sign(e), e.data.submit) {
            var a = {
                store: e.data.store_id,
                pay_type: e.data.pay_type,
                member: e.data.member_id,
                service: e.data.service_id
            };
            "" != e.data.userinfo && null != e.data.userinfo ? a.openid = e.data.userinfo.openid : (a.name = e.data.name, 
            a.mobile = e.data.mobile), -1 != e.data.coupon_curr && (a.coupon_id = e.data.coupon[e.data.coupon_curr].cid), 
            "" != e.data.content && null != e.data.content && (a.content = e.data.content), 
            -1 != e.data.package_curr && (a.package_id = e.data.package_list[e.data.package_curr].id), 
            app.util.request({
                url: "entry/wxapp/AdminOrder",
                data: a,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "下单成功",
                        icon: "success",
                        duration: 2e3
                    }), e.setData({
                        userinfo: "",
                        amount: "",
                        o_amount: "0.00",
                        submit: !1,
                        pay_type: 2,
                        coupon_curr: -1,
                        content: "",
                        member_id: "",
                        member_name: "",
                        service_id: "",
                        service_name: "",
                        name: "",
                        mobile: ""
                    }), getPackage(e));
                }
            });
        }
    },
    member_on: function() {
        var t = this;
        t.setData({
            member_page: !0
        });
        var a = {
            op: "store_member",
            id: t.data.store_id
        };
        "" != t.data.service_id && null != t.data.service_id && (a.service = t.data.service_id), 
        app.util.request({
            url: "entry/wxapp/index",
            data: a,
            success: function(a) {
                var e = a.data;
                "" != e.data && t.setData({
                    member_list: e.data
                });
            }
        });
    },
    member_close: function() {
        this.setData({
            member_page: !1,
            member_list: []
        });
    },
    member_choose: function(a) {
        var e = a.currentTarget.dataset.index, t = this.data.member_list;
        this.setData({
            member_id: t[e].id,
            member_name: t[e].name,
            member_page: !1,
            member_list: []
        });
    },
    service_on: function() {
        var t = this;
        t.setData({
            shadow: !0,
            service_page: !0
        });
        var a = {
            op: "store_service",
            id: t.data.store_id
        };
        "" != t.data.member_id && null != t.data.member_id && (a.member = t.data.member_id), 
        app.util.request({
            url: "entry/wxapp/index",
            data: a,
            success: function(a) {
                var e = a.data;
                "" != e.data && t.setData({
                    service_list: e.data
                });
            }
        }), getPackage(t);
    },
    service_close: function() {
        this.setData({
            shadow: !1,
            service_page: !1,
            service_list: []
        }), getPackage(this);
    },
    service_choose: function(a) {
        var e = a.currentTarget.dataset.index, t = this.data.service_list;
        this.setData({
            shadow: !1,
            service_page: !1,
            service_id: t[e].id,
            service_name: t[e].name,
            service_list: [],
            o_amount: t[e].price,
            coupon_curr: -1,
            coupon_price: "",
            amount: t[e].price
        }), get_amount(this), getPackage(this);
    },
    package_choose: function(a) {
        var e = a.currentTarget.dataset.index;
        e != this.data.package_curr ? this.setData({
            package_curr: e
        }) : this.setData({
            package_curr: -1
        }), get_amount(this);
    },
    onLoad: function(a) {
        var t = this;
        common.config(t), common.theme(t), t.setData({
            store_id: a.store_id
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var e = a.data;
                "" != e.data && ("" != e.data.store && null != e.data.store && wx.setNavigationBarTitle({
                    title: e.data.store.name
                }), "" != e.data.store_manager && null != e.data.store_manager && t.setData({
                    store_manager: e.data.store_manager
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