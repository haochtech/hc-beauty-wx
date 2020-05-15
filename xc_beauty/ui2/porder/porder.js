var app = getApp(), common = require("../common/common.js");

function GetDateStr(a) {
    var t = new Date();
    t.setDate(t.getDate() + a);
    t.getFullYear();
    return t.getMonth() + 1 + "月" + t.getDate() + "日";
}

function GetDate(a) {
    var t = new Date();
    return t.setDate(t.getDate() + a), t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
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
        success: function(a) {
            var t = a.data;
            if ("" != t.data) {
                if (1 == t.data.status) for (var e = 0; e < r.length; e++) r[e].week == d.data.date[d.data.date_curr].week ? s = r[e].content : 7 == r[e].week && 0 == d.data.date[d.data.date_curr].week && (s = r[e].content); else i = !0;
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
                    success: function(a) {
                        var t = a.data;
                        "" != t.data ? d.setData({
                            time_curr: -1,
                            time_list: t.data,
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

function sign(a) {
    var t = a.data.time_curr, e = a.data.name, d = a.data.store_member, r = a.data.store, s = a.data.service_type, i = "";
    1 != a.data.time_status || "" != a.data.group && null != a.data.group || -1 == t && (i = "请选择时间"), 
    1 == a.data.group_time && "" != a.data.group && null != a.data.group && -1 == t && (i = "请选择时间"), 
    "" != e && null != e || (i = "请选择预约人"), 1 == a.data.member_status && -1 == d && (i = "请选择服务人员"), 
    -1 == r && (i = "请选择门店"), -1 == s && (i = "请选择服务方式"), "" == i ? a.setData({
        submit: !0
    }) : wx.showModal({
        title: "错误",
        content: i,
        success: function(a) {
            a.confirm ? "请选择预约人" == i && wx.navigateTo({
                url: "../../pages/address/address"
            }) : a.cancel;
        }
    });
}

function getArea(e) {
    if (1 == e.data.service_type) if ("" != e.data.store_data && null != e.data.store_data) {
        var a = e.data.store_data;
        1 == a.distance_status && "" != a.distance && null != a.distance ? "" != e.data.map && null != e.data.map ? (e.setData({
            area_load: !1
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "area",
                store: a.id,
                latitude: e.data.map.latitude,
                longitude: e.data.map.longitude
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    area_status: t.data.area_status,
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
        store: -1,
        store_member: -1,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        group_public: 1,
        area_status: 1,
        area_load: !0
    },
    store_on: function() {
        var d = this;
        1 == d.data.more_store && wx.getLocation({
            type: "wgs84",
            success: function(a) {
                var t = a.latitude, e = a.longitude;
                a.speed, a.accuracy;
                d.setData({
                    latitude: t,
                    longitude: e
                });
            },
            complete: function() {
                d.setData({
                    store_page: !0,
                    store_list: []
                });
                var a = {
                    op: "store",
                    id: d.data.service.id
                };
                null != d.data.latitude && "" != d.data.latitude && (a.latitude = d.data.latitude), 
                null != d.data.longitude && "" != d.data.longitude && (a.longitude = d.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/order",
                    data: a,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && d.setData({
                            store_list: t.data
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
    store_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        t.setData({
            store_name: t.data.store_list[e].name,
            store: t.data.store_list[e].id,
            store_page: !1,
            store_data: t.data.store_list[e]
        }), 1 != t.data.service_type && t.setData({
            store_member: -1
        }), get_time(t), getArea(t);
    },
    tab: function(a) {
        var t = this, e = (t.data.service, a.currentTarget.dataset.index);
        e != t.data.service_type && (t.setData({
            service_type: e,
            store_member: -1
        }), getArea(t));
    },
    up: function() {
        this.setData({
            total: this.data.total + 1
        });
    },
    down: function() {
        var a = this;
        1 < a.data.total && a.setData({
            total: a.data.total - 1
        });
    },
    date_choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        e != t.data.date_curr && (t.setData({
            date_curr: e,
            time_curr: -1
        }), get_time(t));
    },
    date_left: function() {
        var a = this;
        if (0 < a.data.date_curr) a.setData({
            date_curr: a.data.date_curr - 1,
            time_curr: -1
        }), get_time(a); else {
            var t = a.data.date;
            if (0 < t[a.data.date_curr].index) {
                var e = {};
                e.index = t[a.data.date_curr].index - 1, e.plan_date = GetDate(e.index), e.date = GetDateStr(e.index), 
                e.week = getMyDay(e.index), 0 == e.index ? e.name = "今天" : e.name = getMyDay2(e.index), 
                t.splice(t.length - 1, 1), t.unshift(e), a.setData({
                    date: t,
                    time_curr: -1
                }), get_time(a);
            }
        }
    },
    date_right: function() {
        var a = this, t = a.data.config, e = -1;
        if (1 == t.yu_status && "" != t.yu_value && null != t.yu_value) {
            var d = a.data.date;
            parseInt(d[d.length - 1].index) + 1 >= parseInt(t.yu_value) && (e = 1);
        }
        if (-1 == e) if (a.data.date_curr < a.data.date.length - 1) a.setData({
            date_curr: a.data.date_curr + 1,
            time_curr: -1
        }), get_time(a); else {
            d = a.data.date;
            var r = {};
            r.index = d[a.data.date_curr].index + 1, r.plan_date = GetDate(r.index), r.date = GetDateStr(r.index), 
            r.week = getMyDay(r.index), 0 == r.index ? r.name = "今天" : r.name = getMyDay2(r.index), 
            d.splice(0, 1), d.push(r), a.setData({
                date: d,
                time_curr: -1
            }), get_time(a);
        }
    },
    time_choose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.time_curr && this.setData({
            time_curr: t
        });
    },
    member_on: function() {
        var e = this;
        if (-1 != e.data.store) {
            if (e.data.service_type) {
                e.setData({
                    member_page: !0
                });
                var a = {
                    op: "store_member",
                    id: e.data.store,
                    page: e.data.page,
                    pagesize: e.data.pagesize
                };
                -1 != e.data.service_type && (a.service_type = e.data.service_type), app.util.request({
                    url: "entry/wxapp/index",
                    data: a,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data ? e.setData({
                            member_list: t.data,
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
    member_choose: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.member_list;
        this.setData({
            store_member: e[t].id,
            member_name: e[t].name,
            member_page: !1,
            member_list: [],
            page: 1,
            isbottom: !1
        }), get_time(this);
    },
    submit: function(a) {
        var t = this;
        if (sign(t), t.data.submit) {
            var e = {
                id: t.data.id,
                total: t.data.total,
                name: t.data.name,
                mobile: t.data.mobile,
                service_type: t.data.service_type,
                store: t.data.store,
                member: t.data.store_member,
                order_type: 1,
                form_id: a.detail.formId
            };
            "" != t.data.address && null != t.data.address && "undefined" != t.data.address && (e.address = t.data.address), 
            "" != t.data.map && null != t.data.map && "undefined" != t.data.map && (e.map = JSON.stringify(t.data.map)), 
            null != t.data.kind && null != t.data.kind && (e.kind = t.data.kind), null != t.data.kind_index && null != t.data.kind_index && (e.kind_index = t.data.kind_index), 
            "" != t.data.group && null != t.data.group && (e.group = t.data.group, e.group_public = t.data.group_public), 
            "" != t.data.group_id && null != t.data.group_id && (e.group_id = t.data.group_id), 
            "" != t.data.flash && null != t.data.flash && (e.flash = t.data.flash), (1 == t.data.time_status && (null == t.data.group || "" == t.data.group) || 1 == t.data.group_time && null != t.data.group && "" != t.data.group) && (e.plan_date = t.data.date[t.data.date_curr].date + " " + t.data.time_list[t.data.time_curr].start + "-" + t.data.time_list[t.data.time_curr].end, 
            e.date = t.data.date[t.data.date_curr].date, e.plan_start = t.data.date[t.data.date_curr].plan_date + " " + t.data.time_list[t.data.time_curr].start, 
            e.plan_end = t.data.date[t.data.date_curr].plan_date + " " + t.data.time_list[t.data.time_curr].end, 
            null != t.data.time_list[t.data.time_curr].shop_member && "" != t.data.time_list[t.data.time_curr].shop_member && (e.shop_member = t.data.time_list[t.data.time_curr].shop_member), 
            null != t.data.time_list[t.data.time_curr].home_member && "" != t.data.time_list[t.data.time_curr].home_member && (e.home_member = t.data.time_list[t.data.time_curr].home_member)), 
            app.util.request({
                url: "entry/wxapp/setorder",
                data: e,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && (wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.redirectTo({
                            url: "pay?&out_trade_no=" + t.data.out_trade_no
                        });
                    }, 2e3));
                }
            });
        }
    },
    change: function(a) {
        a.detail.value ? this.setData({
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
        }), "" != d.kind_index && null != d.kind_index && r.setData({
            kind_index: d.kind_index
        }), "" != d.group && null != d.group && r.setData({
            group: d.group
        }), "" != d.group_id && null != d.group_id && r.setData({
            group_id: d.group_id
        }), "" != d.flash && null != d.flash && r.setData({
            flash: d.flash
        });
        for (var a = [], t = 0; t < 5; t++) {
            var e = {};
            e.index = t, e.plan_date = GetDate(t), e.date = GetDateStr(t), e.week = getMyDay(t), 
            e.name = 0 == t ? "今天" : getMyDay2(t), a.push(e);
        }
        r.setData({
            date: a
        }), wx.getLocation({
            type: "wgs84",
            success: function(a) {
                var t = a.latitude, e = a.longitude;
                a.speed, a.accuracy;
                r.setData({
                    latitude: t,
                    longitude: e
                });
            },
            complete: function() {
                var a = {
                    op: "porder",
                    id: d.id
                };
                null != r.data.latitude && "" != r.data.latitude && (a.latitude = r.data.latitude), 
                null != r.data.longitude && "" != r.data.longitude && (a.longitude = r.data.longitude), 
                app.util.request({
                    url: "entry/wxapp/service",
                    data: a,
                    success: function(a) {
                        var t = a.data;
                        if ("" != t.data) {
                            if ("" != t.data.service && null != t.data.service) {
                                if ("" != d.kind && null != d.kind && null != t.data.service.parameter && null != t.data.service.parameter) for (var e = 0; e < t.data.service.parameter.length; e++) t.data.service.parameter[e].name == d.kind && "" != t.data.service.parameter[e].price && null != t.data.service.parameter[e].price && (t.data.service.price = t.data.service.parameter[e].price);
                                1 == t.data.service.shop && 1 == r.data.shop_status ? r.setData({
                                    service_type: 2
                                }) : 1 == t.data.service.home && 1 == r.data.home_status ? r.setData({
                                    service_type: 1
                                }) : r.setData({
                                    service_type: -1
                                }), r.setData({
                                    service: t.data.service,
                                    group_public: t.data.service.group_public
                                });
                            }
                            "" != t.data.times && null != t.data.times && (r.setData({
                                times: t.data.times
                            }), get_time(r)), "" != t.data.list && null != t.data.list && r.setData({
                                store_name: t.data.list.name,
                                store: t.data.list.id,
                                store_data: t.data.list
                            }), r.setData({
                                more_store: t.data.more_store
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
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    var e = t.data.address;
                    "" != t.data.content && null != t.data.content && (e += t.data.content), d.setData({
                        name: t.data.name,
                        mobile: t.data.mobile,
                        address: e,
                        map: t.data.map
                    }), getArea(d);
                }
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        !e.data.isbottom && e.data.member_page && app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "store_member",
                id: e.data.store,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    member_list: e.data.member_list.concat(t.data),
                    page: e.data.page
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});