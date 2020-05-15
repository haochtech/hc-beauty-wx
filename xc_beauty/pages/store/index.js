var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../store/index",
        bind: -1
    },
    detail: function(t) {
        var a = t.currentTarget.dataset.index;
        1 == this.data.bind ? wx.showModal({
            title: "提示",
            content: "确定绑定该门店吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/user",
                    data: {
                        op: "store_bind",
                        id: a
                    },
                    success: function(t) {
                        "" != t.data.data && (wx.showToast({
                            title: "绑定成功",
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
        }) : wx.navigateTo({
            url: "detail?&id=" + a
        });
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), "" != t.bind && null != t.bind && e.setData({
            bind: t.bind
        }), wx.getLocation({
            type: "wgs84",
            success: function(t) {
                var a = t.latitude, n = t.longitude;
                t.speed, t.accuracy;
                e.setData({
                    latitude: a,
                    longitude: n
                }), console.log(t);
            },
            complete: function() {
                var t = {
                    op: "store"
                };
                null != e.data.latitude && "" != e.data.latitude && (t.latitude = e.data.latitude), 
                null != e.data.longitude && "" != e.data.longitude && (t.longitude = e.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/index",
                    data: t,
                    success: function(t) {
                        var a = t.data;
                        "" != a.data && e.setData({
                            list: a.data
                        });
                    }
                });
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