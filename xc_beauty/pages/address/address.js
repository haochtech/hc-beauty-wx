var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    to_add: function() {
        wx.navigateTo({
            url: "edit"
        });
    },
    choose: function(t) {
        var n = this, e = t.currentTarget.dataset.index;
        -1 == n.data.list[e].status && app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "address_choose",
                id: n.data.list[e].id
            },
            success: function(t) {
                if ("" != t.data.data) {
                    for (var a = n.data.list, s = 0; s < a.length; s++) a[s].status = -1;
                    a[e].status = 1, n.setData({
                        list: a
                    });
                }
            }
        });
    },
    address_del: function(t) {
        var s = this, n = t.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确定删除地址吗？",
            success: function(t) {
                t.confirm ? -1 == s.data.list[n].status ? app.util.request({
                    url: "entry/wxapp/user",
                    data: {
                        op: "address_del",
                        id: s.data.list[n].id
                    },
                    success: function(t) {
                        if ("" != t.data.data) {
                            var a = s.data.list;
                            a.splice(n, 1), s.setData({
                                list: a
                            });
                        }
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: "默认地址不能删除",
                    success: function(t) {
                        t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    address_edit: function(t) {
        var a = t.currentTarget.dataset.index;
        wx.navigateTo({
            url: "edit?&id=" + this.data.list[a].id
        });
    },
    onLoad: function(t) {
        common.config(this), common.theme(this);
    },
    onReady: function() {},
    onShow: function() {
        var s = this;
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "address"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && s.setData({
                    list: a.data
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});