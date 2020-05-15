var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        code: ""
    },
    call: function(a) {
        wx.makePhoneCall({
            phoneNumber: this.data.list.mobile
        });
    },
    map: function(a) {
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.list.map.latitude),
            longitude: parseFloat(t.data.list.map.longitude),
            name: t.data.list.address,
            address: t.data.list.address,
            scale: 28
        });
    },
    qie: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    yuyue: function() {
        var a = this;
        "theme3" == a.data.theme.name ? wx.navigateTo({
            url: "../../ui2/store/porder?&id=" + a.data.list.id
        }) : wx.navigateTo({
            url: "porder?&id=" + a.data.list.id
        });
    },
    to_index: function() {
        "theme3" == this.data.theme.name ? wx.reLaunch({
            url: "../../ui2/index/index"
        }) : wx.reLaunch({
            url: "../index/index"
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
                op: "store_code",
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
        common.config(e), common.theme(e), "" != a.bind && null != a.bind && e.setData({
            bind: a.bind
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "store_detail",
                id: a.id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    list: t.data
                });
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
        var t = a.data.config.title + "-" + a.data.list.name, e = "../store/detail?&id=" + a.data.list.id;
        return {
            title: t,
            path: "/xc_beauty/pages/base/base?&share=" + (e = escape(e)),
            imageUrl: "",
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});