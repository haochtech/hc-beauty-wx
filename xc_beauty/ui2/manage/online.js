var app = getApp(), common = require("../common/common.js");

function GetDateStr(a) {
    var t = new Date();
    t.setDate(t.getDate() + a);
    t.getFullYear();
    return t.getMonth() + 1 + "月" + t.getDate() + "日";
}

function getMyDay(a) {
    var t = new Date();
    return t.setDate(t.getDate() + a), 0 == t.getDay() && "周日", 1 == t.getDay() && "周一", 
    2 == t.getDay() && "周二", 3 == t.getDay() && "周三", 4 == t.getDay() && "周四", 5 == t.getDay() && "周五", 
    6 == t.getDay() && "周六", t.getDay();
}

function getMyDay2(a) {
    var t, e = new Date();
    return e.setDate(e.getDate() + a), 0 == e.getDay() && (t = "周日"), 1 == e.getDay() && (t = "周一"), 
    2 == e.getDay() && (t = "周二"), 3 == e.getDay() && (t = "周三"), 4 == e.getDay() && (t = "周四"), 
    5 == e.getDay() && (t = "周五"), 6 == e.getDay() && (t = "周六"), t;
}

Page({
    data: {
        footer_curr: 3,
        date_curr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        nav_curr: 3
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        if (t != e.data.nav_curr) {
            e.setData({
                nav_curr: t,
                list: [],
                page: 1,
                isbottom: !1
            });
            var n = {
                op: "online",
                page: e.data.page,
                pagesize: e.data.pagesize,
                plan_date: e.data.date[e.data.date_curr].date
            };
            "" != e.data.id && null != e.data.id && (n.id = e.data.id), n.nav_curr = e.data.nav_curr, 
            app.util.request({
                url: "entry/wxapp/manage",
                data: n,
                success: function(a) {
                    var t = a.data;
                    "" != t.data ? ("" != t.data.store && null != t.data.store && e.setData({
                        store: t.data.store,
                        id: t.data.store.id
                    }), "" != t.data.online && null != t.data.online && e.setData({
                        online: t.data.online
                    }), "" != t.data.list && null != t.data.list ? e.setData({
                        list: t.data.list,
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !0
                    })) : e.setData({
                        isbottom: !0
                    });
                }
            });
        }
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
    date_choose: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        if (t != e.data.date_curr) {
            e.setData({
                date_curr: t,
                list: [],
                page: 1,
                isbottom: !1
            });
            var n = {
                op: "online",
                page: e.data.page,
                pagesize: e.data.pagesize,
                plan_date: e.data.date[e.data.date_curr].date
            };
            "" != e.data.id && null != e.data.id && (n.id = e.data.id), n.nav_curr = e.data.nav_curr, 
            app.util.request({
                url: "entry/wxapp/manage",
                data: n,
                success: function(a) {
                    var t = a.data;
                    "" != t.data ? ("" != t.data.store && null != t.data.store && e.setData({
                        store: t.data.store,
                        id: t.data.store.id
                    }), "" != t.data.online && null != t.data.online && e.setData({
                        online: t.data.online
                    }), "" != t.data.list && null != t.data.list ? e.setData({
                        list: t.data.list,
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !0
                    })) : e.setData({
                        isbottom: !0
                    });
                }
            });
        }
    },
    date_left: function() {
        var e = this;
        if (0 < e.data.date_curr) e.setData({
            date_curr: e.data.date_curr - 1,
            time_curr: -1
        }); else {
            var a = e.data.date;
            if (0 < a[e.data.date_curr].index) (t = {}).index = a[e.data.date_curr].index - 1, 
            t.date = GetDateStr(t.index), t.week = getMyDay(t.index), 0 == t.index ? t.name = "今天" : t.name = getMyDay2(t.index), 
            a.splice(a.length - 1, 1), a.unshift(t), e.setData({
                date: a,
                time_curr: -1
            });
        }
        e.setData({
            list: [],
            page: 1,
            isbottom: !1
        });
        var t = {
            op: "online",
            page: e.data.page,
            pagesize: e.data.pagesize,
            plan_date: e.data.date[e.data.date_curr].date
        };
        "" != e.data.id && null != e.data.id && (t.id = e.data.id), t.nav_curr = e.data.nav_curr, 
        app.util.request({
            url: "entry/wxapp/manage",
            data: t,
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.store && null != t.data.store && e.setData({
                    store: t.data.store,
                    id: t.data.store.id
                }), "" != t.data.online && null != t.data.online && e.setData({
                    online: t.data.online
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                })) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    date_right: function() {
        var e = this;
        if (e.data.date_curr < e.data.date.length - 1) e.setData({
            date_curr: e.data.date_curr + 1,
            time_curr: -1
        }); else {
            var a = e.data.date;
            (t = {}).index = a[e.data.date_curr].index + 1, t.date = GetDateStr(t.index), t.week = getMyDay(t.index), 
            0 == t.index ? t.name = "今天" : t.name = getMyDay2(t.index), a.splice(0, 1), a.push(t), 
            e.setData({
                date: a,
                time_curr: -1
            });
        }
        e.setData({
            list: [],
            page: 1,
            isbottom: !1
        });
        var t = {
            op: "online",
            page: e.data.page,
            pagesize: e.data.pagesize,
            plan_date: e.data.date[e.data.date_curr].date
        };
        "" != e.data.id && null != e.data.id && (t.id = e.data.id), t.nav_curr = e.data.nav_curr, 
        app.util.request({
            url: "entry/wxapp/manage",
            data: t,
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.store && null != t.data.store && e.setData({
                    store: t.data.store,
                    id: t.data.store.id
                }), "" != t.data.online && null != t.data.online && e.setData({
                    online: t.data.online
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                })) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    menu_on: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            menu: !0,
            shadow: !0,
            curr: t
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    call: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: this.data.list[t].userinfo.mobile
        });
    },
    submit: function() {
        var t = this, e = t.data.list;
        1 == e[t.data.curr].status && -1 == e[t.data.curr].use && wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: e[t.data.curr].id
                    },
                    success: function(a) {
                        "" != a.data.data && (e[t.data.curr].is_use = parseInt(e[t.data.curr].is_use) + 1, 
                        e[t.data.curr].is_use == parseInt(e[t.data.curr].can_use) && (e[t.data.curr].use = 1), 
                        t.setData({
                            list: e
                        }), wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    online: function(a) {
        var t = this, e = t.data.online, n = "";
        -1 == e ? n = "确定关闭预约吗？" : 1 == e && (n = "确定开启预约吗？"), wx.showModal({
            title: "提示",
            content: n,
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "online_status",
                        store: t.data.id,
                        status: -t.data.online,
                        plan_date: t.data.date[t.data.date_curr].date
                    },
                    success: function(a) {
                        "" != a.data.data && (1 == e ? wx.showToast({
                            title: "开启成功",
                            icon: "success",
                            duration: 2e3
                        }) : wx.showToast({
                            title: "关闭成功",
                            icon: "success",
                            duration: 2e3
                        }), t.setData({
                            online: -t.data.online
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
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
        var t = this, e = a.currentTarget.dataset.index, n = t.data.list;
        "" != n[e].yu_check_content && null != n[e].yu_check_content ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order_check",
                id: n[e].id,
                content: n[e].yu_check_content
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "操作成功"
                }), n[e].yu_check_result = 1, t.setData({
                    list: n
                }));
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入备注信息"
        });
    },
    check_fail: function(a) {
        var t = this, e = a.currentTarget.dataset.index, n = t.data.list;
        "" != n[e].yu_check_content && null != n[e].yu_check_content ? app.util.request({
            url: "entry/wxapp/OrderRefund",
            data: {
                id: n[e].id,
                content: n[e].yu_check_content,
                yu_check_result: 2
            },
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "操作成功"
                }), n[e].yu_check_result = 2, t.setData({
                    list: n
                }));
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入备注信息"
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), null != a.store_id && "" != a.store_id && e.setData({
            store_id: a.store_id
        });
        for (var t = [], n = 0; n < 5; n++) {
            (d = {}).index = n, d.date = GetDateStr(n), d.week = getMyDay(n), d.name = 0 == n ? "今天" : getMyDay2(n), 
            t.push(d);
        }
        var d, s = -1;
        "" != app.map && null != app.map && "" != app.map.content && null != app.map.content && 1 == app.map.content.store && (s = ""), 
        e.setData({
            date: t,
            map: app.map,
            id: s
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
        }), (d = {
            op: "online",
            page: e.data.page,
            pagesize: e.data.pagesize,
            plan_date: e.data.date[e.data.date_curr].date
        }).id = a.store_id, d.nav_curr = e.data.nav_curr, app.util.request({
            url: "entry/wxapp/manage",
            data: d,
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.store && null != t.data.store && e.setData({
                    store: t.data.store,
                    id: t.data.store.id
                }), "" != t.data.online && null != t.data.online && e.setData({
                    online: t.data.online
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                })) : e.setData({
                    isbottom: !0
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
                op: "online",
                page: e.data.page,
                pagesize: e.data.pagesize,
                plan_date: e.data.date[e.data.date_curr].date
            };
            "" != e.data.id && null != e.data.id && (a.id = e.data.id), a.nav_curr = e.data.nav_curr, 
            app.util.request({
                url: "entry/wxapp/manage",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data ? ("" != t.data.store && null != t.data.store && e.setData({
                        store: t.data.store,
                        id: t.data.store.id
                    }), "" != t.data.online && null != t.data.online && e.setData({
                        online: t.data.online
                    }), "" != t.data.list && null != t.data.list ? e.setData({
                        list: e.data.list.concat(t.data.list),
                        page: e.data.page + 1
                    }) : e.setData({
                        isbottom: !0
                    })) : e.setData({
                        isbottom: !0
                    });
                }
            });
        }
    }
});