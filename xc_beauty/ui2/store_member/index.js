var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        footer_curr: 5,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    call: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: this.data.list[t].userinfo.mobile
        });
    },
    menu_on: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            menu: !0,
            shadow: !0,
            curr: t,
            detail: this.data.list[t]
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1,
            menu2: !1
        });
    },
    order_call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.list[this.data.curr].userinfo.mobile
        });
    },
    map: function() {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.list[a.data.curr].userinfo.map.latitude),
            longitude: parseFloat(a.data.list[a.data.curr].userinfo.map.longitude),
            address: a.data.list[a.data.curr].userinfo.map.address,
            scale: 28
        });
    },
    submit: function() {
        var e = this, s = e.data.list;
        wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: e.data.detail.id
                    },
                    success: function(a) {
                        if ("" != a.data.data) {
                            "" != e.data.curr && null != e.data.curr && (s[e.data.curr].is_use = parseInt(s[e.data.curr].is_use) + 1, 
                            s[e.data.curr].is_use == parseInt(s[e.data.curr].can_use) && (s[e.data.curr].use = 1), 
                            e.setData({
                                list: s,
                                curr: ""
                            }));
                            var t = e.data.detail;
                            t.is_use = parseInt(t.is_use) + 1, t.is_use == parseInt(t.can_use) && (t.use = 1), 
                            e.setData({
                                detail: t
                            }), wx.showToast({
                                title: "核销成功",
                                icon: "success",
                                duration: 2e3
                            });
                        }
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    scan: function() {
        var e = this;
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(a) {
                console.log(a);
                var t = a.result;
                -1 != t.indexOf("package_") ? (t = t.split("_"), app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "package_search",
                        id: t[1]
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            package_detail: t.data,
                            shadow: !0,
                            menu2: !0
                        });
                    }
                })) : app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_member_search",
                        id: a.result,
                        store: e.data.store_id
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            detail: t.data,
                            shadow: !0,
                            menu: !0,
                            curr: ""
                        });
                    }
                });
            }
        });
    },
    getcode: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "buy_code",
                store: e.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    share: t.data.share,
                    yin: !0
                });
            }
        });
    },
    yin_close: function() {
        this.setData({
            yin: !1
        });
    },
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
    switchChange: function(a) {
        var e = this, s = {
            op: "member_status",
            id: e.data.member_user.member.id
        };
        a.detail.value ? s.status = 1 : s.status = -1, app.util.request({
            url: "entry/wxapp/manage",
            data: s,
            success: function(a) {
                if ("" != a.data.data) {
                    wx.showToast({
                        title: "操作成功"
                    });
                    var t = e.data.member_user;
                    t.member.status = s.status, e.setData({
                        member_user: t
                    });
                }
            }
        });
    },
    input: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.list;
        e[t].yu_check_content = a.detail.value, this.setData({
            list: e
        });
    },
    check_success: function(a) {
        var t = this, e = a.currentTarget.dataset.index, s = t.data.list;
        "" != s[e].yu_check_content && null != s[e].yu_check_content ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order_check",
                id: s[e].id,
                content: s[e].yu_check_content
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "操作成功"
                }), s[e].yu_check_result = 1, t.setData({
                    list: s
                }));
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入备注信息"
        });
    },
    check_fail: function(a) {
        var t = this, e = a.currentTarget.dataset.index, s = t.data.list;
        "" != s[e].yu_check_content && null != s[e].yu_check_content ? app.util.request({
            url: "entry/wxapp/OrderRefund",
            data: {
                id: s[e].id,
                content: s[e].yu_check_content,
                yu_check_result: 2
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "操作成功"
                }), s[e].yu_check_result = 2, t.setData({
                    list: s
                }));
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入备注信息"
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store_detail",
                id: a.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.store && null != t.data.store && (wx.setNavigationBarTitle({
                    title: t.data.store.name
                }), e.setData({
                    store_list: t.data.store,
                    store_id: t.data.store.id
                })), "" != t.data.store_member && null != t.data.store_member && e.setData({
                    store_member: t.data.store_member
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "member_user",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (e.setData({
                    member_user: t.data.user,
                    store_id: t.data.user.shop_id
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
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
        e.data.isbottom || app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "member_user",
                id: e.data.store_id,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && ("" != t.data.list && null != t.data.list ? e.setData({
                    list: e.data.list.concat(t.data.list),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                }));
            }
        });
    }
});