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
        var o = this.data.share;
        "" != o && null != o ? (wx.showLoading({
            title: "保存中"
        }), wx.downloadFile({
            url: o,
            success: function(o) {
                wx.saveImageToPhotosAlbum({
                    filePath: o.tempFilePath,
                    success: function(o) {
                        console.log(o), wx.hideLoading(), wx.showToast({
                            title: "保存成功",
                            icon: "success",
                            duration: 2e3
                        });
                    },
                    fail: function(o) {
                        wx.hideLoading(), wx.showToast({
                            title: "保存失败",
                            icon: "success",
                            duration: 2e3
                        });
                    }
                });
            }
        })) : wx.showModal({
            title: "错误",
            content: "保存图片失败",
            success: function(o) {
                o.confirm ? console.log("用户点击确定") : o.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(o) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/share",
            success: function(o) {
                var n = o.data;
                "" != n.data && e.setData({
                    share: n.data.share
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