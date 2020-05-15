var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "jishi/index",
        page: 1,
        pagesize: 21,
        isbottom: !1
    },
    store_on: function() {
        this.setData({
            store_page: !0
        });
    },
    store_close: function() {
        this.setData({
            store_page: !1
        });
    },
    store_choose: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        e.setData({
            store_curr: t,
            store_id: e.data.store_list[t].id,
            store_page: !1,
            page: 1,
            isbottom: !1
        });
        var o = {
            op: "store_member",
            page: e.data.page,
            pagesize: e.data.pagesize
        };
        "" != e.data.store_id && null != e.data.store_id && (o.id = e.data.store_id), app.util.request({
            url: "entry/wxapp/index",
            data: o,
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    list: [],
                    isbottom: !0
                });
            }
        });
    },
    submit: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "../store/porder?&id=" + t.data.list[e].cid + "&member_id=" + t.data.list[e].id + "&member_name=" + t.data.list[e].name
        });
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "store_member",
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? o.setData({
                    list: t.data,
                    page: o.data.page + 1
                }) : o.setData({
                    isbottom: !0
                });
            }
        }), wx.getLocation({
            type: "wgs84",
            success: function(a) {
                var t = a.latitude, e = a.longitude;
                a.speed, a.accuracy;
                o.setData({
                    latitude: t,
                    longitude: e
                });
            },
            complete: function() {
                var a = {
                    op: "store"
                };
                null != o.data.latitude && "" != o.data.latitude && (a.latitude = o.data.latitude), 
                null != o.data.longitude && "" != o.data.longitude && (a.longitude = o.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/order",
                    data: a,
                    showLoading: !1,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && o.setData({
                            store_list: t.data
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
    onReachBottom: function() {
        var e = this;
        if (!e.data.isbottom) {
            var a = {
                op: "store_member",
                page: e.data.page,
                pagesize: e.data.pagesize
            };
            "" != e.data.store_id && null != e.data.store_id && (a.id = e.data.store_id), app.util.request({
                url: "entry/wxapp/index",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data ? e.setData({
                        list: e.data.list.concat(t.data),
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !0
                    });
                }
            });
        }
    }
});