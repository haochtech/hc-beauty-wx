var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    to_index: function() {
        "theme3" == this.data.theme.name ? wx.reLaunch({
            url: "../../ui2/index/index"
        }) : wx.reLaunch({
            url: "../index/index"
        });
    },
    submit: function() {
        var a = this;
        "theme3" == a.data.theme.name ? wx.navigateTo({
            url: "../../ui2/store/porder?&id=" + a.data.list.cid + "&member_id=" + a.data.list.id + "&member_name=" + a.data.list.name
        }) : wx.navigateTo({
            url: "porder?&id=" + a.data.list.cid + "&member_id=" + a.data.list.id + "&member_name=" + a.data.list.name
        });
    },
    zan: function() {
        var t = this, e = t.data.list;
        -1 == t.data.list.is_zan && app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "zan",
                id: e.id
            },
            success: function(a) {
                "" != a.data.data && (e.is_zan = 1, t.setData({
                    list: e
                }));
            }
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
                op: "member_code",
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
    link: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.list;
        wx.navigateTo({
            url: "../zuo/zuo?&bimg=" + e.zuo_pin[t].bimg + "&id=" + e.id
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "member_detail",
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
        var t = a.data.config.title + "-" + a.data.list.name, e = "../store/member_detail?&id=" + a.data.list.id, n = "/xc_beauty/pages/base/base?&share=" + (e = escape(e)), i = 1;
        return "" != app.share && null != app.share && "" != app.share.content && null != app.share.content && (i = app.share.content.status), 
        1 == i && (n = n + "&scene=" + app.userinfo.openid), console.log(n), {
            title: t,
            path: n,
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