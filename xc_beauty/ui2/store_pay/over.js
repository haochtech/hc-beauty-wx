var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.username, e = a.data.mobile, r = (a.data.amount, "");
    if ("" == a.data.amount || null == a.data.amount ? r = "请输入提现金额" : parseFloat(a.data.amount) < 1 ? r = "1元起提" : parseFloat(a.data.amount) > parseFloat(a.data.store_user.store_fee) && (r = "余额不足"), 
    "" == e || null == e) r = "请输入手机号码"; else {
        /^[1][0-9]{10}$/.test(e) || (r = "请输入正确的手机号码");
    }
    "" != t && null != t || (r = "请输入微信账号"), "" == r ? a.setData({
        submit: !0
    }) : wx.showModal({
        title: "错误",
        content: r
    });
}

Page({
    data: {
        nav: [ "申请提现", "提现记录", "账单流水" ],
        curr: 0,
        submit: !1,
        draw: [],
        draw_page: 1,
        draw_pagesize: 20,
        draw_isbottom: !1,
        record: [],
        record_page: 1,
        record_pagesize: 20,
        record_isbottom: !1
    },
    tab: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.curr && this.setData({
            curr: t
        });
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "username":
            t.setData({
                username: a.detail.value
            });
            break;

          case "mobile":
            t.setData({
                mobile: a.detail.value
            });
            break;

          case "amount":
            t.setData({
                amount: a.detail.value
            });
        }
    },
    all: function(a) {
        this.setData({
            amount: this.data.store_user.store_fee
        });
    },
    submit: function() {
        var e = this;
        if (sign(e), e.data.submit) {
            var r = {
                username: e.data.username,
                mobile: e.data.mobile,
                amount: e.data.amount
            };
            app.util.request({
                url: "entry/wxapp/storefee",
                data: r,
                success: function(a) {
                    if ("" != a.data.data) {
                        wx.showToast({
                            title: "提交成功"
                        });
                        var t = e.data.store_user;
                        t.store_fee = (parseFloat(t.store_fee) - parseFloat(r.amount)).toFixed(2), e.setData({
                            store_user: t,
                            submit: !1,
                            username: "",
                            mobile: "",
                            amount: ""
                        });
                    }
                }
            });
        }
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            store_id: a.store_id
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: e.data.store_id
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
            url: "entry/wxapp/manage",
            data: {
                op: "store_user",
                draw_page: e.data.draw_page,
                draw_pagesize: e.data.draw_pagesize,
                record_page: e.data.record_page,
                record_pagesize: e.data.record_pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.user && null != t.data.user && e.setData({
                    store_user: t.data.user
                }), "" != t.data.draw && null != t.data.draw ? e.setData({
                    draw: t.data.draw,
                    draw_page: e.data.draw_page + 1
                }) : e.setData({
                    draw_isbottom: !0
                }), "" != t.data.record && null != t.data.record ? e.setData({
                    record: t.data.record,
                    record_page: e.data.record_page + 1
                }) : e.setData({
                    record_isbottom: !0
                }));
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
        1 == e.data.curr ? e.data.record_isbottom || app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "draw",
                record_page: e.data.record_page,
                record_pagesize: e.data.record_pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    record: e.data.record.concat(t.data),
                    record_page: e.data.record_page + 1
                }) : e.setData({
                    record_isbottom: !0
                });
            }
        }) : 2 == e.data.curr && (e.data.draw_isbottom || app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "records",
                draw_page: e.data.draw_page,
                draw_pagesize: e.data.draw_pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    draw: e.data.draw.concat(t.data),
                    draw_page: e.data.draw_page + 1
                }) : e.setData({
                    draw_isbottom: !0
                });
            }
        }));
    }
});