var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    previewImage: function() {
        wx.previewImage({
            current: this.data.share,
            urls: [ this.data.share ]
        });
    },
    saveImageToPhotosAlbum: function() {
        var a = this.data.share;
        "" != a && null != a ? (wx.showLoading({
            title: "保存中"
        }), wx.downloadFile({
            url: a,
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
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }
        })) : wx.showModal({
            title: "错误",
            content: "保存图片失败"
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            store_id: a.store_id
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.store && null != t.data.store && wx.setNavigationBarTitle({
                    title: t.data.store.name
                }), "" != t.data.store_manager && null != t.data.store_manager && e.setData({
                    store_manager: t.data.store_manager
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    list: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/admincode",
            data: {
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    share: t.data.share
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