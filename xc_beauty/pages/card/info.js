var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.mobile, o = a.data.code, n = a.data.password, s = !0;
    "" != t && null != t || (s = !1), "" != e && null != e || (s = !1);
    /^[1][0-9]{10}$/.test(e) || (s = !1);
    var i = a.data.card;
    "" != i && null != i && null != i.content && "" != i.content && 1 == i.content.code_status && ("" != o && null != o || (s = !1)), 
    ("" == n || null == n || n.length < 6) && (s = !1), "" != a.data.userinfo.store && null != a.data.userinfo.store || (s = !1), 
    a.setData({
        submit: s
    });
}

function forget_sign(a) {
    var t = a.data.code, e = a.data.password, o = a.data.mobile, n = !0, s = a.data.card;
    "" != s && null != s && null != s.content && "" != s.content && 1 == s.content.code_status && ("" != t && null != t || (n = !1)), 
    ("" == e || null == e || e.length < 6) && (n = !1), "" != o && null != o || (n = !1), 
    a.setData({
        forget_submit: n
    });
}

function time_dowm(t) {
    var e = setInterval(function() {
        var a = t.data.times;
        0 == a ? (t.setData({
            isload: !1
        }), clearInterval(e)) : (a -= 1, t.setData({
            times: a
        }));
    }, 1e3);
}

Page({
    data: {
        submit: !1,
        forget_submit: !1,
        isload: !1
    },
    to_store: function() {
        var a = this.data.userinfo;
        "" != a.store && null != a.store || (wx, wx.navigateTo({
            url: "../../pages/store/index?&bind=1"
        }));
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "name":
            t.setData({
                name: a.detail.value
            });
            break;

          case "mobile":
            t.setData({
                mobile: a.detail.value
            });
            break;

          case "code":
            t.setData({
                code: a.detail.value
            });
            break;

          case "password":
            t.setData({
                password: a.detail.value
            });
        }
        sign(t), forget_sign(t);
    },
    getcode: function() {
        var t = this, a = t.data.mobile;
        t.data.isload || ("" != a && null != a && /^[1][0-9]{10}$/.test(a) ? app.util.request({
            url: "entry/wxapp/getcode",
            data: {
                mobile: t.data.mobile
            },
            success: function(a) {
                t.setData({
                    times: 60,
                    isload: !0
                }), time_dowm(t);
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入正确的手机号",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        }));
    },
    submit: function() {
        var a = this;
        if (a.data.submit) {
            var t = {
                op: "card_on",
                name: a.data.name,
                mobile: a.data.mobile,
                password: a.data.password
            };
            null != a.data.code && "" != a.data.code && (t.code = a.data.code), app.util.request({
                url: "entry/wxapp/user",
                data: t,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "开通成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2e3));
                }
            });
        }
    },
    forget: function() {
        this.setData({
            edit: 3,
            mobile: this.data.userinfo.mobile
        });
    },
    forget_submit: function() {
        var a = this;
        if (a.data.forget_submit) {
            var t = {
                op: "card_edit",
                password: a.data.password,
                mobile: a.data.mobile
            };
            "" != a.data.code && null != a.data.code && (t.code = a.data.code), app.util.request({
                url: "entry/wxapp/user",
                data: t,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "修改成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2e3));
                }
            });
        }
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            edit: a.edit
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "card"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.card && null != t.data.card && e.setData({
                    card: t.data.card
                }), "" != t.data.coupon && null != t.data.coupon && e.setData({
                    coupon: t.data.coupon
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/user",
            showLoading: !1,
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (e.setData({
                    userinfo: t.data
                }), sign(e));
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});