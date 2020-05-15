var app = getApp(), common = require("../common/common.js"), WxParse = require("../../../wxParse/wxParse.js");

function wxpay(a, t) {
    a.appId;
    var e = a.timeStamp.toString(), s = a.package, i = a.nonceStr, n = a.paySign.toUpperCase();
    wx.requestPayment({
        timeStamp: e,
        nonceStr: i,
        package: s,
        signType: "MD5",
        paySign: n,
        success: function(a) {
            wx.showToast({
                title: "支付成功"
            }), t.setData({
                shadow: !1,
                pay: !1
            }), setTimeout(function() {
                wx.navigateTo({
                    url: "user"
                });
            }, 2e3);
        },
        fail: function(a) {
            console.log(a);
        }
    });
}

Page({
    data: {
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        imgheights: [],
        current: 0,
        pay_type: 2,
        code: ""
    },
    imageLoad: function(a) {
        var t = 750 / (a.detail.width / (t = a.detail.height)), e = this.data.imgheights;
        e[a.currentTarget.dataset.index] = t, this.setData({
            imgheights: e
        });
    },
    bindchange: function(a) {
        this.setData({
            current: a.detail.current
        });
    },
    to_index: function() {
        "theme3" == this.data.theme.name ? wx.reLaunch({
            url: "../../ui2/index/index"
        }) : wx.navigateTo({
            url: "../index/index"
        });
    },
    pay: function() {
        this.setData({
            shadow: !0,
            pay: !0
        });
    },
    pay_choose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.pay_type && this.setData({
            pay_type: t
        });
    },
    submit: function(a) {
        var e = this;
        1 == e.data.pay_type ? app.util.request({
            url: "entry/wxapp/PackageOrder",
            data: {
                id: e.data.id,
                form_id: a.detail.formId,
                pay_type: e.data.pay_type
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (1 == t.data.status ? wxpay(t.data, e) : 2 == t.data.status && (wx.showToast({
                    title: "支付成功"
                }), setTimeout(function() {
                    wx.navigateTo({
                        url: "user"
                    });
                }, 2e3)));
            }
        }) : 2 == e.data.pay_type && e.setData({
            pay: !1,
            sign: !0,
            form_id: a.detail.formId
        });
    },
    sign_close: function() {
        this.setData({
            shadow: !1,
            sign: !1,
            password: ""
        });
    },
    input: function(a) {
        this.setData({
            password: a.detail.value
        });
    },
    sign_btn: function(a) {
        var e = this, t = e.data.password;
        "" != t && null != t ? app.util.request({
            url: "entry/wxapp/PackageOrder",
            data: {
                id: e.data.id,
                form_id: a.detail.formId,
                password: t,
                pay_type: e.data.pay_type
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (1 == t.data.status ? wxpay(t.data, e) : 2 == t.data.status && (e.setData({
                    shadow: !1,
                    sign: !1
                }), wx.showToast({
                    title: "支付成功"
                }), setTimeout(function() {
                    wx.navigateTo({
                        url: "user"
                    });
                }, 2e3)));
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入支付密码",
            showCancel: !1
        });
    },
    menu_close: function() {
        this.setData({
            pay: !1,
            shadow: !1
        });
    },
    share_on: function() {
        this.setData({
            showShare: !0
        });
    },
    closeShare: function() {
        this.setData({
            showShare: !1
        });
    },
    showhb: function() {
        var e = this;
        "" != e.data.code && null != e.data.code ? e.setData({
            showhb: !0,
            showShare: !1
        }) : app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "package_code",
                id: e.data.list.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    code: t.data.code,
                    showhb: !0,
                    showShare: !1
                });
            }
        });
    },
    closehb: function() {
        this.setData({
            showhb: !1
        });
    },
    dlimg: function() {
        wx.showLoading({
            title: "保存中"
        }), wx.downloadFile({
            url: this.data.code,
            success: function(a) {
                wx.saveImageToPhotosAlbum({
                    filePath: a.tempFilePath,
                    success: function(a) {
                        console.log(a), wx.hideLoading(), wx.showToast({
                            title: "保存成功",
                            icon: "success",
                            duration: 2e3
                        });
                    },
                    fail: function(a) {
                        wx.hideLoading(), wx.showToast({
                            title: "保存失败",
                            icon: "success",
                            duration: 2e3
                        });
                    }
                });
            }
        });
    },
    onLoad: function(a) {
        var s = this;
        common.config(s), common.theme(s), s.setData({
            id: a.id
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "package_detail",
                id: s.data.id
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data && (s.setData({
                    list: t.data
                }), "" != t.data.content && null != t.data.content)) {
                    var e = t.data.content;
                    WxParse.wxParse("content", "html", e, s, 5);
                }
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var a = this, t = "../../pages/package/detail?&id=" + a.data.list.id, e = "/xc_beauty/pages/base/base?&share=" + (t = escape(t)), s = 1;
        "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (s = app.share.content.status), 
        1 == s && (e = e + "&scene=" + app.userinfo.openid);
        var i = a.data.config.title + "-" + a.data.list.name;
        "" != a.data.list.share_title && null != a.data.list.share_title && (i = a.data.list.share_title);
        var n = "";
        return "" != a.data.list.share_img && null != a.data.list.share_img && (n = a.data.list.share_img), 
        {
            title: i,
            path: e,
            imageUrl: n,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});