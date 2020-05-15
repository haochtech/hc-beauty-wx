var app = getApp(), common = require("../common/common.js"), WxParse = require("../../../wxParse/wxParse.js");

Page({
    data: {
        numbervalue: 1,
        imgheights: [],
        current: 0
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
    radiochange: function(a) {
        var t = a.detail.value;
        this.setData({
            format: t
        });
    },
    numMinus: function() {
        var a = this.data.numbervalue;
        1 == a || (a--, this.setData({
            numbervalue: a
        }));
    },
    numPlus: function() {
        var a = this.data.numbervalue;
        a++, this.setData({
            numbervalue: a
        });
    },
    valChange: function(a) {
        var t = a.detail.value;
        1 <= t || (t = 1), this.setData({
            numbervalue: t
        });
    },
    submit: function(a) {
        wx.navigateTo({
            url: "porder?&id=" + this.data.list.id + "&member=" + this.data.numbervalue
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
                op: "mall_code",
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
        var e = this;
        e.setData({
            id: a.id
        }), common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "mall_detail",
                id: a.id
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data && (e.setData({
                    list: t.data
                }), "" != t.data.content && null != t.data.content)) WxParse.wxParse("article", "html", t.data.content, e, 0);
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
        var a = this;
        a.setData({
            showShare: !1
        });
        var t = "../mall_score/index?&id=" + a.data.id, e = "/xc_beauty/pages/base/base?&share=" + (t = escape(t)), n = 1;
        return "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (n = app.share.content.status), 
        1 == n && (e = e + "&scene=" + app.userinfo.openid), {
            title: a.data.config.title + "-" + a.data.list.name,
            imageUrl: a.data.list.simg,
            path: e,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});