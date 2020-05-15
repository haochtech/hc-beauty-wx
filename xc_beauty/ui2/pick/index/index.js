var app = getApp(), common = require("../../common/common.js");

function shop_num(e) {
    app.util.request({
        url: "entry/wxapp/manage",
        method: "POST",
        showLoading: !1,
        data: {
            op: "shop_num"
        },
        success: function(a) {
            var t = a.data;
            "" != t.data && e.setData({
                shop_num: t.data
            });
        }
    });
}

function change_num(a) {
    for (var t = 0, e = 0, s = a.data.change_list, n = 0; n < s.pid.length; n++) {
        t += parseInt(s.pid[n].total);
        var i = (parseInt(s.pid[n].total) * parseFloat(s.pid[n].price)).toFixed(2);
        e = (parseFloat(e) + parseFloat(i)).toFixed(2);
    }
    s.total = t, s.amount = e, a.setData({
        change_list: s
    });
}

Page({
    data: {
        nav: 1,
        curr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.nav && (e.setData({
            nav: t,
            page: 1,
            isbototm: !1,
            list: []
        }), 1 == e.data.nav ? (app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "service",
                page: e.data.page,
                pagesize: e.data.pagesize,
                cid: e.data.pclass[e.data.curr].id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }), shop_num(e)) : 2 == e.data.nav && app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                store: e.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    },
    menu_on: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "shop"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    shop_list: t.data
                });
            }
        }), e.setData({
            shadow: !0,
            menu: !0
        });
    },
    menu_close: function() {
        var e = this;
        e.setData({
            shadow: !1,
            menu: !1,
            page: 1,
            isbottom: !1,
            list: []
        }), app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "service",
                page: e.data.page,
                pagesize: e.data.pagesize,
                cid: e.data.pclass[e.data.curr].id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    tbas: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.curr && (e.setData({
            curr: t,
            page: 1,
            isbottom: !1,
            list: []
        }), app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "service",
                page: e.data.page,
                pagesize: e.data.pagesize,
                cid: e.data.pclass[e.data.curr].id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    },
    up: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index;
        e[s].total = parseInt(e[s].total) + 1, app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "shop_status",
                pid: e[s].id,
                status: 1,
                total: 1
            },
            success: function(a) {
                "" != a.data.data && (t.setData({
                    list: e
                }), shop_num(t));
            }
        });
    },
    down: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index;
        0 < parseInt(e[s].total) && (e[s].total = parseInt(e[s].total) - 1, app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "shop_status",
                pid: e[s].id,
                status: 1,
                total: -1
            },
            success: function(a) {
                "" != a.data.data && (t.setData({
                    list: e
                }), shop_num(t));
            }
        }));
    },
    shop_up: function(a) {
        var t = this, e = t.data.shop_list, s = a.currentTarget.dataset.index;
        e[s].total = parseInt(e[s].total) + 1, app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "shop_status",
                pid: e[s].pid,
                status: 1,
                total: 1
            },
            success: function(a) {
                "" != a.data.data && (t.setData({
                    shop_list: e
                }), shop_num(t));
            }
        });
    },
    shop_down: function(a) {
        var t = this, e = t.data.shop_list, s = a.currentTarget.dataset.index;
        0 < parseInt(e[s].total) && (e[s].total = parseInt(e[s].total) - 1, app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "shop_status",
                pid: e[s].pid,
                status: 1,
                total: -1
            },
            success: function(a) {
                "" != a.data.data && (t.setData({
                    shop_list: e
                }), shop_num(t));
            }
        }));
    },
    shop_del: function(a) {
        var t = this, e = t.data.shop_list, s = a.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "shop_status",
                pid: e[s].pid,
                status: -1
            },
            success: function(a) {
                "" != a.data.data && (e.splice(s, 1), t.setData({
                    shop_list: e
                }), shop_num(t));
            }
        });
    },
    submit: function() {
        var e = this;
        0 < parseInt(e.data.shop_num.total) ? app.util.request({
            url: "entry/wxapp/pickorder",
            method: "POST",
            data: {
                store: e.data.store_id
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    e.setData({
                        shadow: !1,
                        menu: !1,
                        nav: 2,
                        page: 1,
                        isbottom: !1,
                        list: []
                    }), app.util.request({
                        url: "entry/wxapp/manage",
                        method: "POST",
                        data: {
                            op: "pick_order",
                            page: e.data.page,
                            pagesize: e.data.pagesize,
                            store: e.data.store_id
                        },
                        success: function(a) {
                            var t = a.data;
                            "" != t.data ? e.setData({
                                list: t.data,
                                page: e.data.page + 1
                            }) : e.setData({
                                isbottom: !0
                            });
                        }
                    });
                }, 2e3));
            }
        }) : wx.showModal({
            title: "错误",
            content: "请先添加货品"
        });
    },
    order_del: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index;
        -1 == e[s].status && wx.showModal({
            title: "提示",
            content: "确定取消订单吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    method: "POST",
                    data: {
                        op: "pick_order_del",
                        id: e[s].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 2e3
                        }), e.splice(s, 1), t.setData({
                            list: e
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    order_status: function(a) {
        var t = this, e = t.data.list, s = a.currentTarget.dataset.index;
        1 == e[s].status && wx.showModal({
            title: "提示",
            content: "确定收货吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    method: "POST",
                    data: {
                        op: "pick_order_status",
                        id: e[s].id,
                        status: 2
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 2e3
                        }), e[s].status = 2, t.setData({
                            list: e
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    order_change: function(a) {
        var e = this, s = a.currentTarget.dataset.index, t = e.data.list;
        -1 == t[s].status && app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order_detail",
                id: t[s].id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    shadow: !0,
                    menu2: !0,
                    change_index: s,
                    change_list: t.data
                });
            }
        });
    },
    menu_close2: function() {
        this.setData({
            shadow: !1,
            menu2: !1,
            change_index: ""
        });
    },
    change_up: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.change_list;
        e.pid[t].total = parseInt(e.pid[t].total) + 1, this.setData({
            change_list: e
        }), change_num(this);
    },
    change_down: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.change_list;
        0 < parseInt(e.pid[t].total) && (e.pid[t].total = parseInt(e.pid[t].total) - 1, 
        this.setData({
            change_list: e
        }), change_num(this));
    },
    change_del: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.change_list;
        e.pid.splice(t, 1), this.setData({
            change_list: e
        }), change_num(this);
    },
    change_submit: function() {
        var s = this, a = s.data.change_list;
        0 < parseInt(a.total) ? app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order_change",
                id: a.id,
                pid: JSON.stringify(a.pid)
            },
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    wx.showToast({
                        title: "操作成功",
                        icon: "success",
                        duration: 2e3
                    });
                    var e = s.data.list;
                    e[s.data.change_index] = t.data, s.setData({
                        list: e,
                        shadow: !1,
                        menu2: !1
                    });
                }
            }
        }) : wx.showModal({
            title: "错误",
            content: "请先添加货品"
        });
    },
    onLoad: function(e) {
        var s = this;
        common.config(s), common.theme(s), s.setData({
            store_id: e.store_id
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (s.setData({
                    userinfo: t.data
                }), 1 == parseInt(t.data.shop) || 2 == parseInt(t.data.shop) && parseInt(t.data.shop_id) == e.store_id || wx.showModal({
                    title: "错误",
                    content: "没有权限",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm ? "theme3" == s.data.theme.name ? wx.reLaunch({
                            url: "/xc_beauty/ui2/index/index"
                        }) : wx.reLaunch({
                            url: "/xc_beauty/pages/index/index"
                        }) : a.cancel && console.log("用户点击取消");
                    }
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pclass"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (s.setData({
                    pclass: t.data
                }), app.util.request({
                    url: "entry/wxapp/manage",
                    method: "POST",
                    data: {
                        op: "service",
                        page: s.data.page,
                        pagesize: s.data.pagesize,
                        cid: s.data.pclass[0].id
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data ? s.setData({
                            list: t.data,
                            page: s.data.page + 1
                        }) : s.setData({
                            isbottom: !0
                        });
                    }
                }));
            }
        }), shop_num(s), s.setData({
            shadow: !1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        e.data.isbottom || (1 == e.data.nav ? app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "service",
                page: e.data.page,
                pagesize: e.data.pagesize,
                cid: e.data.pclass[e.data.curr].id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: e.data.concat(t.data),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }) : 2 == e.data.nav && app.util.request({
            url: "entry/wxapp/manage",
            method: "POST",
            data: {
                op: "pick_order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                store: e.data.store_id
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: e.data.list.concat(t.data),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    }
});