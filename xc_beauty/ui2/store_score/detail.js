var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    shFunc: function(t) {
        var o = this, n = o.data.list;
        wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "score_status",
                        id: n.id
                    },
                    success: function(t) {
                        "" != t.data.data && (wx.showToast({
                            title: "核销成功"
                        }), n.status = 1, o.setData({
                            list: n
                        }));
                    }
                });
            }
        });
    },
    onLoad: function(t) {
        var n = this;
        common.config(n), common.theme(n), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "score_log_detail",
                id: t.id
            },
            success: function(t) {
                var o = t.data;
                "" != o.data && n.setData({
                    list: o.data
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