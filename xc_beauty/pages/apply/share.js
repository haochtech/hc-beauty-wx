function _defineProperty(t, a, n) {
    return a in t ? Object.defineProperty(t, a, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = n, t;
}

var app = getApp(), common = require("../common/common.js"), WxParse = require("../../../wxParse/wxParse.js");

function sign(t) {
    var a = t.data.name;
    if ("" == a || null == a) return wx.showModal({
        title: "提示",
        content: "请输入姓名"
    }), !1;
    var n = t.data.mobile;
    if ("" == n || null == n) return wx.showModal({
        title: "提示",
        content: "请输入联系方式"
    }), !1;
    if (!/^[1][0-9]{10}$/.test(n)) return wx.showModal({
        title: "提示",
        content: "请选择地址"
    }), !1;
    var e = t.data.address;
    return "" != e && null != e || (wx.showModal({
        title: "提示",
        content: "请输入联系方式"
    }), !1);
}

Page({
    data: {
        pro: !1,
        pro_status: !0
    },
    pro_on: function() {
        this.setData({
            pro: !0
        });
    },
    pro_change: function() {
        this.setData({
            pro_status: !this.data.pro_status
        });
    },
    pro_close: function() {
        this.setData({
            pro: !1
        });
    },
    map: function() {
        var a = this;
        wx.chooseLocation({
            success: function(t) {
                a.setData({
                    address: t.address,
                    map: t
                });
            }
        });
    },
    input: function(t) {
        var a = t.currentTarget.dataset.name;
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    submit: function(t) {
        var n = this, a = sign(n);
        if (a) {
            var e = {
                op: "apply",
                name: n.data.name,
                mobile: n.data.mobile,
                address: n.data.address,
                map: n.data.map
            };
            "" != n.data.content && null != n.data.content && (e.content = n.data.content), 
            app.util.request({
                url: "entry/wxapp/user",
                data: e,
                success: function(t) {
                    if ("" != t.data.data) {
                        wx.showToast({
                            title: "提交成功"
                        });
                        var a = n.data.xc;
                        a.apply_in = {
                            status: -1
                        }, n.setData({
                            xc: a
                        });
                    }
                }
            });
        }
    },
    reload: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "apply_change",
                id: n.data.xc.apply_fail.id
            },
            success: function(t) {
                if ("" != t.data.data) {
                    var a = n.data.xc;
                    a.apply_fail = !1, n.setData({
                        xc: a
                    });
                }
            }
        });
    },
    onLoad: function(t) {
        var n = this;
        common.config(n), common.theme(n), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "apply_share"
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data && (n.setData({
                    xc: a.data
                }), "" != a.data.config.apply_pro_content && null != a.data.config.apply_pro_content)) WxParse.wxParse("article", "html", a.data.config.apply_pro_content, n, 0);
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