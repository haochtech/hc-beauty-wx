var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        service_type: 1
    },
    input: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    service_choose: function(t) {
        var e = t.currentTarget.dataset.index;
        e != this.data.service_type && this.setData({
            service_type: e
        });
    },
    submit: function(t) {
        var e = this;
        if ("" != e.data.address && null != e.data.address) {
            var a = {
                op: "scoreorder",
                address: JSON.stringify(e.data.address),
                form_id: t.detail.formId
            };
            "" != e.data.content && null != e.data.content && (a.content = e.data.content), 
            a.member = e.data.member, a.service = e.data.id, a.service_type = e.data.service_type, 
            app.util.request({
                url: "entry/wxapp/user",
                data: a,
                success: function(t) {
                    "" != t.data.data && (wx.showToast({
                        title: "兑换成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2e3));
                }
            });
        } else wx.showModal({
            title: "错误",
            content: "请选择地址"
        });
    },
    onLoad: function(t) {
        var a = this;
        common.config(a), common.theme(a), "" != t.id && null != t.id && a.setData({
            id: t.id
        }), "" != t.member && null != t.member && a.setData({
            member: t.member
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "score_porder",
                id: a.data.id,
                member: a.data.member
            },
            success: function(t) {
                var e = t.data;
                "" != e.data && a.setData({
                    list: e.data
                });
            }
        }), 2 == app.config.content.mall_pei && a.setData({
            service_type: 2
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "address_default"
            },
            success: function(t) {
                var e = t.data;
                "" != e.data && a.setData({
                    address: e.data
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});