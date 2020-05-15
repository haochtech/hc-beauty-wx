var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(o) {
        common.config(this), common.theme(this);
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(o) {
                var n = o.data;
                "" != n.data && (t.setData({
                    userinfo: n.data
                }), 1 != n.data.share && wx.showModal({
                    title: "提示",
                    content: "未满足消费金额",
                    showCancel: !1,
                    success: function(o) {
                        o.confirm ? wx.navigateBack({
                            delta: 1
                        }) : o.cancel && console.log("用户点击取消");
                    }
                }));
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});