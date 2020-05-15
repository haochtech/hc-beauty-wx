var app = getApp(), common = require("../common/common.js");

function GetDateStr(t) {
    var a = new Date();
    a.setDate(a.getDate() + t);
    a.getFullYear();
    return a.getMonth() + 1 + "月" + a.getDate() + "日";
}

function GetDate(t) {
    var a = new Date();
    return a.setDate(a.getDate() + t), a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
}

function getMyDay(t) {
    var a = new Date();
    return a.setDate(a.getDate() + t), 0 == a.getDay() && "周日", 1 == a.getDay() && "周一", 
    2 == a.getDay() && "周二", 3 == a.getDay() && "周三", 4 == a.getDay() && "周四", 5 == a.getDay() && "周五", 
    6 == a.getDay() && "周六", a.getDay();
}

function getMyDay2(t) {
    var a, e = new Date();
    return e.setDate(e.getDate() + t), 0 == e.getDay() && (a = "周日"), 1 == e.getDay() && (a = "周一"), 
    2 == e.getDay() && (a = "周二"), 3 == e.getDay() && (a = "周三"), 4 == e.getDay() && (a = "周四"), 
    5 == e.getDay() && (a = "周五"), 6 == e.getDay() && (a = "周六"), a;
}

function get_time(d) {
    var r = d.data.times, s = [], i = !1;
    (1 == d.data.time_status && (null == d.data.group || "" == d.data.group) || 1 == d.data.group_time && "" != d.data.group && null != d.data.group) && app.util.request({
        url: "entry/wxapp/user",
        showLoading: !1,
        data: {
            op: "plan_date",
            plan_date: d.data.date[d.data.date_curr].date,
            id: d.data.id,
            service: 1
        },
        success: function(t) {
            var a = t.data;
            if ("" != a.data) {
                if (1 == a.data.status) for (var e = 0; e < r.length; e++) r[e].week == d.data.date[d.data.date_curr].week ? s = r[e].content : 7 == r[e].week && 0 == d.data.date[d.data.date_curr].week && (s = r[e].content); else i = !0;
                -1 != d.data.store_member || -1 == d.data.member_status ? app.util.request({
                    url: "entry/wxapp/user",
                    data: {
                        op: "times_log",
                        member: d.data.store_member,
                        plan_date: d.data.date[d.data.date_curr].date,
                        list: JSON.stringify(s),
                        index: d.data.date[d.data.date_curr].index,
                        week: d.data.date[d.data.date_curr].week,
                        type: d.data.service_type
                    },
                    success: function(t) {
                        var a = t.data;
                        "" != a.data ? d.setData({
                            time_curr: -1,
                            time_list: a.data,
                            tip: i
                        }) : d.setData({
                            time_curr: -1,
                            time_list: s,
                            tip: i
                        });
                    }
                }) : d.setData({
                    time_curr: -1,
                    time_list: s,
                    tip: i
                });
            }
        }
    });
}

function sign(t) {
    var a = t.data.time_curr, e = t.data.name, d = t.data.store_member, r = t.data.store, s = t.data.service_type, i = "";
    1 != t.data.time_status || "" != t.data.group && null != t.data.group || -1 == a && (i = "请选择时间"), 
    1 == t.data.group_time && "" != t.data.group && null != t.data.group && -1 == a && (i = "请选择时间"), 
    "" != e && null != e || (i = "请选择预约人"), 1 == t.data.member_status && -1 == d && (i = "请选择服务人员"), 
    -1 == r && (i = "请选择门店"), -1 == s && (i = "请选择服务方式"), "" == i ? t.setData({
        submit: !0
    }) : wx.showModal({
        title: "错误",
        content: i,
        success: function(t) {
            t.confirm ? "请选择预约人" == i && wx.navigateTo({
                url: "../address/address"
            }) : t.cancel;
        }
    });
}

function getArea(e) {
    if (1 == e.data.service_type) if ("" != e.data.store_data && null != e.data.store_data) {
        var t = e.data.store_data;
        1 == t.distance_status && "" != t.distance && null != t.distance ? "" != e.data.map && null != e.data.map ? (e.setData({
            area_load: !1
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "area",
                store: t.id,
                latitude: e.data.map.latitude,
                longitude: e.data.map.longitude
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && e.setData({
                    area_status: a.data.area_status,
                    area_load: !0
                });
            }
        })) : e.setData({
            area_status: -1
        }) : e.setData({
            area_status: 1
        });
    } else e.setData({
        area_status: 1
    }); else e.setData({
        area_status: 1
    });
}

Page({
    data: {
        service_type: -1,
        total: 1,
        date_curr: 0,
        time_curr: -1,
        submit: !1,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        store_member: -1,
        group_public: 1,
        area_status: 1,
        area_load: !0
    },
    store_on: function() {
        var d = this;
        console.log(d.data.more_store), 1 == d.data.more_store && wx.getLocation({
            type: "wgs84",
            success: function(t) {
                var a = t.latitude, e = t.longitude;
                t.speed, t.accuracy;
                d.setData({
                    latitude: a,
                    longitude: e
                });
            },
            complete: function() {
                d.setData({
                    store_page: !0,
                    store_list: []
                });
                var t = {
                    op: "store",
                    id: d.data.service.id
                };
                null != d.data.latitude && "" != d.data.latitude && (t.latitude = d.data.latitude), 
                null != d.data.longitude && "" != d.data.longitude && (t.longitude = d.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/order",
                    data: t,
                    success: function(t) {
                        var a = t.data;
                        "" != a.data && d.setData({
                            store_list: a.data
                        });
                    }
                });
            }
        });
    },
    store_close: function() {
        this.setData({
            store_page: !1
        });
    },
    store_choose: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        a.setData({
            store_name: a.data.store_list[e].name,
            store: a.data.store_list[e].id,
            store_page: !1,
            store_data: a.data.store_list[e]
        }), 1 != a.data.service_type && a.setData({
            store_member: -1
        }), get_time(a), getArea(a);
    },
    tab: function(t) {
        var a = this, e = (a.data.service, t.currentTarget.dataset.index);
        e != a.data.service_type && (a.setData({
            service_type: e,
            store_member: -1
        }), get_time(a), getArea(a));
    },
    up: function() {
        this.setData({
            total: this.data.total + 1
        });
    },
    down: function() {
        var t = this;
        1 < t.data.total && t.setData({
            total: t.data.total - 1
        });
    },
    date_choose: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        e != a.data.date_curr && (a.setData({
            date_curr: e,
            time_curr: -1
        }), get_time(a));
    },
    date_left: function() {
        var t = this;
        if (0 < t.data.date_curr) t.setData({
            date_curr: t.data.date_curr - 1,
            time_curr: -1
        }), get_time(t); else {
            var a = t.data.date;
            if (0 < a[t.data.date_curr].index) {
                var e = {};
                e.index = a[t.data.date_curr].index - 1, e.plan_date = GetDate(e.index), e.date = GetDateStr(e.index), 
                e.week = getMyDay(e.index), 0 == e.index ? e.name = "今天" : e.name = getMyDay2(e.index), 
                a.splice(a.length - 1, 1), a.unshift(e), t.setData({
                    date: a,
                    time_curr: -1
                }), get_time(t);
            }
        }
    },
    date_right: function() {
        var t = this, a = t.data.config, e = -1;
        if (1 == a.yu_status && "" != a.yu_value && null != a.yu_value) {
            var d = t.data.date;
            parseInt(d[d.length - 1].index) + 1 >= parseInt(a.yu_value) && (e = 1);
        }
        if (-1 == e) if (t.data.date_curr < t.data.date.length - 1) t.setData({
            date_curr: t.data.date_curr + 1,
            time_curr: -1
        }), get_time(t); else {
            d = t.data.date;
            var r = {};
            r.index = d[t.data.date_curr].index + 1, r.plan_date = GetDate(r.index), r.date = GetDateStr(r.index), 
            r.week = getMyDay(r.index), 0 == r.index ? r.name = "今天" : r.name = getMyDay2(r.index), 
            d.splice(0, 1), d.push(r), t.setData({
                date: d,
                time_curr: -1
            }), get_time(t);
        }
    },
    time_choose: function(t) {
        var a = t.currentTarget.dataset.index;
        a != this.data.time_curr && this.setData({
            time_curr: a
        });
    },
    input: function(t) {
        var a = this;
        switch (t.currentTarget.dataset.name) {
          case "name":
            a.setData({
                name: t.detail.value
            });
            break;

          case "mobile":
            a.setData({
                mobile: t.detail.value
            });
            break;

          case "address":
            a.setData({
                address: t.detail.value
            });
        }
    },
    map: function() {
        var a = this;
        wx.chooseLocation({
            success: function(t) {
                a.setData({
                    address: t.address,
                    map: t
                });
            }
        });
    },
    member_on: function() {
        var e = this;
        if (-1 != e.data.store) {
            if (e.data.service_type) {
                e.setData({
                    member_page: !0
                });
                var t = {
                    op: "store_member",
                    id: e.data.store,
                    page: e.data.page,
                    pagesize: e.data.pagesize
                };
                -1 != e.data.service_type && (t.service_type = e.data.service_type), app.util.request({
                    url: "entry/wxapp/index",
                    data: t,
                    success: function(t) {
                        var a = t.data;
                        "" != a.data ? e.setData({
                            member_list: a.data,
                            page: e.data.page + 1
                        }) : e.setData({
                            isbottom: !0
                        });
                    }
                });
            }
        } else wx.showModal({
            title: "提示",
            content: "请先选择门店"
        });
    },
    member_close: function() {
        this.setData({
            member_page: !1,
            member_list: [],
            page: 1,
            isbottom: !1
        });
    },
    member_choose: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.member_list;
        this.setData({
            store_member: e[a].id,
            member_name: e[a].name,
            member_page: !1,
            member_list: [],
            page: 1,
            isbottom: !1
        }), get_time(this);
    },
    submit: function(t) {
        var a = this;
        if (sign(a), a.data.submit) {
            var e = {
                id: a.data.id,
                total: a.data.total,
                name: a.data.name,
                mobile: a.data.mobile,
                service_type: a.data.service_type,
                store: a.data.store,
                member: a.data.store_member,
                order_type: 1,
                form_id: t.detail.formId
            };
            "" != a.data.address && null != a.data.address && "undefined" != a.data.address && (e.address = a.data.address), 
            "" != a.data.map && null != a.data.map && "undefined" != a.data.map && (e.map = JSON.stringify(a.data.map)), 
            null != a.data.kind && null != a.data.kind && (e.kind = a.data.kind), "" != a.data.group && null != a.data.group && (e.group = a.data.group, 
            e.group_public = a.data.group_public), "" != a.data.group_id && null != a.data.group_id && (e.group_id = a.data.group_id), 
            "" != a.data.flash && null != a.data.flash && (e.flash = a.data.flash), (1 == a.data.time_status && (null == a.data.group || "" == a.data.group) || 1 == a.data.group_time && null != a.data.group && "" != a.data.group) && (e.plan_date = a.data.date[a.data.date_curr].date + " " + a.data.time_list[a.data.time_curr].start + "-" + a.data.time_list[a.data.time_curr].end, 
            e.date = a.data.date[a.data.date_curr].date, e.plan_start = a.data.date[a.data.date_curr].plan_date + " " + a.data.time_list[a.data.time_curr].start, 
            e.plan_end = a.data.date[a.data.date_curr].plan_date + " " + a.data.time_list[a.data.time_curr].end, 
            null != a.data.time_list[a.data.time_curr].shop_member && "" != a.data.time_list[a.data.time_curr].shop_member && (e.shop_member = a.data.time_list[a.data.time_curr].shop_member), 
            null != a.data.time_list[a.data.time_curr].home_member && "" != a.data.time_list[a.data.time_curr].home_member && (e.home_member = a.data.time_list[a.data.time_curr].home_member)), 
            app.util.request({
                url: "entry/wxapp/setorder",
                data: e,
                success: function(t) {
                    var a = t.data;
                    "" != a.data && (wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.redirectTo({
                            url: "pay?&out_trade_no=" + a.data.out_trade_no
                        });
                    }, 2e3));
                }
            });
        }
    },
    change: function(t) {
        t.detail.value ? this.setData({
            group_public: 1
        }) : this.setData({
            group_public: -1
        });
    },
    onLoad: function(d) {
        var r = this;
        common.config(r), common.theme(r), "" != d.id && null != d.id && r.setData({
            id: d.id
        }), "" != d.kind && null != d.kind && r.setData({
            kind: d.kind
        }), "" != d.group && null != d.group && r.setData({
            group: d.group
        }), "" != d.group_id && null != d.group_id && r.setData({
            group_id: d.group_id
        }), "" != d.flash && null != d.flash && r.setData({
            flash: d.flash
        });
        for (var t = [], a = 0; a < 5; a++) {
            var e = {};
            e.index = a, e.plan_date = GetDate(a), e.date = GetDateStr(a), e.week = getMyDay(a), 
            e.name = 0 == a ? "今天" : getMyDay2(a), t.push(e);
        }
        r.setData({
            date: t
        }), wx.getLocation({
            type: "wgs84",
            success: function(t) {
                var a = t.latitude, e = t.longitude;
                t.speed, t.accuracy;
                r.setData({
                    latitude: a,
                    longitude: e
                });
            },
            complete: function() {
                var t = {
                    op: "porder",
                    id: d.id
                };
                null != r.data.latitude && "" != r.data.latitude && (t.latitude = r.data.latitude), 
                null != r.data.longitude && "" != r.data.longitude && (t.longitude = r.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/service",
                    data: t,
                    success: function(t) {
                        var a = t.data;
                        if ("" != a.data) {
                            if ("" != a.data.service && null != a.data.service) {
                                if ("" != d.kind && null != d.kind && null != a.data.service.parameter && null != a.data.service.parameter) for (var e = 0; e < a.data.service.parameter.length; e++) a.data.service.parameter[e].name == d.kind && "" != a.data.service.parameter[e].price && null != a.data.service.parameter[e].price && (a.data.service.price = a.data.service.parameter[e].price);
                                1 == a.data.service.shop && 1 == r.data.shop_status ? r.setData({
                                    service_type: 2
                                }) : 1 == a.data.service.home && 1 == r.data.home_status ? r.setData({
                                    service_type: 1
                                }) : r.setData({
                                    service_type: -1
                                }), r.setData({
                                    service: a.data.service,
                                    group_public: a.data.service.group_public
                                });
                            }
                            "" != a.data.times && null != a.data.times && (r.setData({
                                times: a.data.times
                            }), get_time(r)), "" != a.data.list && null != a.data.list && r.setData({
                                store_name: a.data.list.name,
                                store: a.data.list.id,
                                store_data: a.data.list
                            }), r.setData({
                                more_store: a.data.more_store
                            }), getArea(r);
                        }
                    }
                });
            }
        });
        var s = r.data.config, i = -1, u = -1, n = -1, o = -1, l = -1;
        "" != s && null != s && ("" != s.member_status && null != s.member_status && (u = s.member_status), 
        "" != s.home_status && null != s.home_status && (i = s.home_status), "" != s.shop_status && null != s.shop_status && (l = s.shop_status), 
        "" != s.time_status && null != s.time_status && (n = s.time_status), "" != s.group_time && null != s.group_time && (o = s.group_time)), 
        r.setData({
            home_status: i,
            shop_status: l,
            member_status: u,
            time_status: n,
            group_time: o
        }), -1 == i && 1 == l ? r.setData({
            service_type: 2
        }) : 1 == i && -1 == l && r.setData({
            service_type: 1
        });
    },
    onReady: function() {},
    onShow: function() {
        var d = this;
        app.util.request({
            url: "entry/wxapp/service",
            showLoading: !1,
            data: {
                op: "address_default"
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data) {
                    var e = a.data.address;
                    "" != a.data.content && null != a.data.content && (e += a.data.content), d.setData({
                        name: a.data.name,
                        mobile: a.data.mobile,
                        address: e,
                        map: a.data.map
                    }), getArea(d);
                }
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});