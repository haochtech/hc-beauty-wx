function a(a) {
    var t = new Date();
    t.setDate(t.getDate() + a);
    t.getFullYear();
    return t.getMonth() + 1 + "月" + t.getDate() + "日";
}

function t(a) {
    var t = new Date();
    return t.setDate(t.getDate() + a), 0 == t.getDay() && "周日", 1 == t.getDay() && "周一", 
    2 == t.getDay() && "周二", 3 == t.getDay() && "周三", 4 == t.getDay() && "周四", 5 == t.getDay() && "周五", 
    6 == t.getDay() && "周六", t.getDay();
}

function e(a) {
    var t, e = new Date();
    return e.setDate(e.getDate() + a), 0 == e.getDay() && (t = "周日"), 1 == e.getDay() && (t = "周一"), 
    2 == e.getDay() && (t = "周二"), 3 == e.getDay() && (t = "周三"), 4 == e.getDay() && (t = "周四"), 
    5 == e.getDay() && (t = "周五"), 6 == e.getDay() && (t = "周六"), t;
}

var d = getApp(), n = require("../common/common.js");

Page({
    data: {
        footer_curr: 4,
        date_curr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    date_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        if (e != t.data.date_curr) {
            t.setData({
                date_curr: e,
                list: [],
                page: 1,
                isbottom: !1
            });
            var n = {
                op: "online",
                page: t.data.page,
                pagesize: t.data.pagesize,
                plan_date: t.data.date[t.data.date_curr].date
            };
            "" != t.data.id && null != t.data.id && (n.id = t.data.id), d.util.request({
                url: "entry/wxapp/manage",
                data: n,
                success: function(a) {
                    var e = a.data;
                    "" != e.data ? ("" != e.data.store && null != e.data.store && t.setData({
                        store: e.data.store,
                        id: e.data.store.id
                    }), "" != e.data.online && null != e.data.online && t.setData({
                        online: e.data.online
                    }), "" != e.data.list && null != e.data.list ? t.setData({
                        list: e.data.list,
                        page: t.data.page + 1
                    }) : t.setData({
                        isbottom: !0
                    })) : t.setData({
                        isbottom: !0
                    });
                }
            });
        }
    },
    date_left: function() {
        var n = this;
        if (n.data.date_curr > 0) n.setData({
            date_curr: n.data.date_curr - 1,
            time_curr: -1
        }); else {
            var s = n.data.date;
            s[n.data.date_curr].index > 0 && ((i = {}).index = s[n.data.date_curr].index - 1, 
            i.date = a(i.index), i.week = t(i.index), 0 == i.index ? i.name = "今天" : i.name = e(i.index), 
            s.splice(s.length - 1, 1), s.unshift(i), n.setData({
                date: s,
                time_curr: -1
            }));
        }
        n.setData({
            list: [],
            page: 1,
            isbottom: !1
        });
        var i = {
            op: "online",
            page: n.data.page,
            pagesize: n.data.pagesize,
            plan_date: n.data.date[n.data.date_curr].date
        };
        "" != n.data.id && null != n.data.id && (i.id = n.data.id), d.util.request({
            url: "entry/wxapp/manage",
            data: i,
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.store && null != t.data.store && n.setData({
                    store: t.data.store,
                    id: t.data.store.id
                }), "" != t.data.online && null != t.data.online && n.setData({
                    online: t.data.online
                }), "" != t.data.list && null != t.data.list ? n.setData({
                    list: t.data.list,
                    page: n.data.page + 1
                }) : n.setData({
                    isbottom: !0
                })) : n.setData({
                    isbottom: !0
                });
            }
        });
    },
    date_right: function() {
        var n = this;
        if (n.data.date_curr < n.data.date.length - 1) n.setData({
            date_curr: n.data.date_curr + 1,
            time_curr: -1
        }); else {
            var s = n.data.date;
            (i = {}).index = s[n.data.date_curr].index + 1, i.date = a(i.index), i.week = t(i.index), 
            0 == i.index ? i.name = "今天" : i.name = e(i.index), s.splice(0, 1), s.push(i), n.setData({
                date: s,
                time_curr: -1
            });
        }
        n.setData({
            list: [],
            page: 1,
            isbottom: !1
        });
        var i = {
            op: "online",
            page: n.data.page,
            pagesize: n.data.pagesize,
            plan_date: n.data.date[n.data.date_curr].date
        };
        "" != n.data.id && null != n.data.id && (i.id = n.data.id), d.util.request({
            url: "entry/wxapp/manage",
            data: i,
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.store && null != t.data.store && n.setData({
                    store: t.data.store,
                    id: t.data.store.id
                }), "" != t.data.online && null != t.data.online && n.setData({
                    online: t.data.online
                }), "" != t.data.list && null != t.data.list ? n.setData({
                    list: t.data.list,
                    page: n.data.page + 1
                }) : n.setData({
                    isbottom: !0
                })) : n.setData({
                    isbottom: !0
                });
            }
        });
    },
    qie: function() {
        var a = this;
        -1 != a.data.id && (a.setData({
            store_page: !0,
            store_list: []
        }), d.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "store"
            },
            success: function(t) {
                var e = t.data;
                "" != e.data && a.setData({
                    store_list: e.data
                });
            }
        }));
    },
    store_close: function() {
        this.setData({
            store_page: !1
        });
    },
    store_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            id: t.data.store_list[e].id,
            store_page: !1,
            page: 1,
            isbottom: !1,
            list: [],
            store: ""
        });
        var n = {
            op: "online",
            page: t.data.page,
            pagesize: t.data.pagesize,
            plan_date: t.data.date[t.data.date_curr].date
        };
        "" != t.data.id && null != t.data.id && (n.id = t.data.id), d.util.request({
            url: "entry/wxapp/manage",
            data: n,
            success: function(a) {
                var e = a.data;
                "" != e.data ? ("" != e.data.store && null != e.data.store && t.setData({
                    store: e.data.store,
                    id: e.data.store.id
                }), "" != e.data.online && null != e.data.online && t.setData({
                    online: e.data.online
                }), "" != e.data.list && null != e.data.list ? t.setData({
                    list: e.data.list,
                    page: t.data.page + 1
                }) : t.setData({
                    isbottom: !0
                })) : t.setData({
                    isbottom: !0
                });
            }
        });
    },
    menu_on: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            menu: !0,
            shadow: !0,
            curr: e
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    call: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: t.data.list[e].userinfo.mobile
        });
    },
    submit: function() {
        var a = this, t = a.data.list;
        1 == t[a.data.curr].status && -1 == t[a.data.curr].use && wx.showModal({
            title: "提示",
            content: "确定核销吗？",
            success: function(e) {
                e.confirm ? d.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "order_change",
                        id: t[a.data.curr].id
                    },
                    success: function(e) {
                        "" != e.data.data && (t[a.data.curr].is_use = parseInt(t[a.data.curr].is_use) + 1, 
                        t[a.data.curr].is_use == parseInt(t[a.data.curr].can_use) && (t[a.data.curr].use = 1), 
                        a.setData({
                            list: t
                        }), wx.showToast({
                            title: "核销成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : e.cancel && console.log("用户点击取消");
            }
        });
    },
    online: function(a) {
        var t = this, e = t.data.online, n = "";
        -1 == e ? n = "确定关闭预约吗？" : 1 == e && (n = "确定开启预约吗？"), wx.showModal({
            title: "提示",
            content: n,
            success: function(a) {
                a.confirm ? d.util.request({
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
    onLoad: function(s) {
        var i = this;
        n.config(i), n.theme(i);
        for (var o = [], r = 0; r < 5; r++) (u = {}).index = r, u.date = a(r), u.week = t(r), 
        u.name = 0 == r ? "今天" : e(r), o.push(u);
        var l = -1;
        "" != d.map && null != d.map && "" != d.map.content && null != d.map.content && 1 == d.map.content.store && (l = ""), 
        i.setData({
            date: o,
            map: d.map,
            id: l
        });
        var u = {
            op: "online",
            page: i.data.page,
            pagesize: i.data.pagesize,
            plan_date: i.data.date[i.data.date_curr].date
        };
        "" != i.data.id && null != i.data.id && (u.id = i.data.id), d.util.request({
            url: "entry/wxapp/manage",
            data: u,
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.store && null != t.data.store && i.setData({
                    store: t.data.store,
                    id: t.data.store.id
                }), "" != t.data.online && null != t.data.online && i.setData({
                    online: t.data.online
                }), "" != t.data.list && null != t.data.list ? i.setData({
                    list: t.data.list,
                    page: i.data.page + 1
                }) : i.setData({
                    isbottom: !0
                })) : i.setData({
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
        var a = this;
        if (!a.data.isbottom) {
            var t = {
                op: "online",
                page: a.data.page,
                pagesize: a.data.pagesize,
                plan_date: a.data.date[a.data.date_curr].date
            };
            "" != a.data.id && null != a.data.id && (t.id = a.data.id), d.util.request({
                url: "entry/wxapp/manage",
                data: t,
                success: function(t) {
                    var e = t.data;
                    "" != e.data ? ("" != e.data.store && null != e.data.store && a.setData({
                        store: e.data.store,
                        id: e.data.store.id
                    }), "" != e.data.online && null != e.data.online && a.setData({
                        online: e.data.online
                    }), "" != e.data.list && null != e.data.list ? a.setData({
                        list: a.data.list.concat(e.data.list),
                        page: a.data.page + 1
                    }) : a.setData({
                        isbottom: !0
                    })) : a.setData({
                        isbottom: !0
                    });
                }
            });
        }
    }
});