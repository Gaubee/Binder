var Tools = require('./Tools.js');

var defaultKey = require('./defaultKey.js');


//value||innerHTML||innerText||attrsName...
(function (G,undinefed) {
    var $$,$$id = 0,allBinders = [];
    function _privates(opction){
        for (var i in opction) {
            this['_'+i] = opction[i];
        };
    };
    _privates.prototype = {
                _fn_set: function (fn) {
                    if ((typeof fn).toLowerCase() === "function") {
                        this._content = fn;
                    } else {
                        var arg = arguments[arguments.length];
                        if (arg && arg.length) {//是否更新绑定
                            this._update({ Sponsors: publics.id, Participants: arg });
                        } else {
                            this._update({ Sponsors: publics.id, Participants: [] });
                        }
                    }
                },
                _sin_set: function () {//不用参数，为了实现可以set值为null//数据包,[是否停止更新绑定]
                    if (arguments.length) {
                        var c = arguments[0];
                        var ctype = (typeof c).toLowerCase();
                        if (ctype === "string" || ctype === "number" || ctype === "boolean" || c === null) {
                            this._content = c;
                        } else if (ctype === "function") {
                            this._content = c();
                        } else {
                            try {
                                for (var i in c) {
                                    this._content[i] = c[i];
                                }
                            }
                            catch (e) {
                                console.log("set error:" + e);
                                return;
                            }
                        }
                        if (arguments[1] && arguments[1].length) {//是否更新绑定
                            this._update({ Sponsors: publics.id, Participants: arguments[1] });
                        } else {
                            this._update({ Sponsors: publics.id, Participants: [] });
                        }
                    }
                },
                _obj_set: function () {//数据包,[是否深度复制数据包给对象],[是否停止更新绑定]
                    if (arguments.length) {
                        var c = arguments[0];
                        var ctype = (typeof c).toLowerCase();
                        if (ctype === "string" || ctype === "number" || ctype === "boolean" || c === null) {
                            this._content[this._key] = c;
                        } else if (ctype === "function") {
                            this._content[this._key] = c();
                        } else {
                            if (!arguments[1]) {//是否深赋值，默认false(null,undinefed)
                                try {
                                    for (var i in c) {
                                        this._content[i] = c[i];
                                    }
                                }
                                catch (e) {
                                    console.log("set error:" + e);
                                    return;
                                }
                            }
                            else {//深赋值

                            }
                        }
                        if (arguments[2] && arguments[2].length) {//是否更新绑定
                            this._update({ Sponsors: publics.id, Participants: arguments[2] });
                        } else {
                            this._update({ Sponsors: publics.id, Participants: [] });
                        }
                    }
                },
                _update: function (con) {//更新
                    //con:Sponsors:int(更新发起者),Participants:[int](已参与者),argus:object(附带参数)
                    var BindersID = this._bindersId + "";
                    BindersID = BindersID.substr(1, BindersID.length - 2).split('|');
                    var Binders = this._binders;
                    var Length = BindersID.length;

                    //console.log(con);
                    con.Participants[con.Participants.length] = publics.id; //将自身写入参与者id
                    //console.log(con.Sponsors + "|" + con.Participants);

                    for (var i = 0; i < Length; ++i) {
                        var id = BindersID[i];
                        if (id === "") {
                            break;
                        }
                        var binder = allBinders[id];
                        var BindersMessage = Binders[id];
                        if (("|" + con.Participants.join('|') + "|").indexOf('|' + id + '|') === -1 || BindersMessage.forceUpdate) {
                            //不重复更新，除非配置信息为强制更新
                            var newCon = {
                                Sponsors: publics.id,
                                Participants: Tools.ArrayCopy(con.Participants),
                                argus: BindersMessage
                            }
                            Tools.TimeOut(function (B, BM, C) {
                                var updateKey = BM["updateKey"];
                                var key = BM["key"], value;
                                if ((typeof key).toLowerCase() === "function") {
                                    value = key.call(this._content, BM["binder"]);
                                } else {
                                    value = publics.get(BM["key"]);
                                }
                                var data = {};
                                if (updateKey === null) {//更新关键字为空，则更新默认关键字
                                    data = value;
                                } else if ((typeof updateKey) === "object") {//如果是数组
                                    var Length = updateKey.length;
                                    for (var i = 0; i < Length; ++i) {
                                        data[updateKey[i]] = value;
                                    }
                                } else {
                                    data[updateKey] = value;
                                }
                                if (B.this._type === "object") {
                                    B.publics.set(data, false, C.Participants); //索取绑定关键字,默认为null
                                } else if (B.this._type === "function") {
                                    if (key && key.length) {
                                        B.publics.get.apply(BM["Environment"], key);
                                    } else {
                                        B.publics.get.call(BM["Environment"].publics);
                                    }
                                    B.publics.set(C.Participants); //索取绑定关键字,默认为null
                                } else {
                                    B.publics.set(data, C.Participants); //索取绑定关键字,默认为null
                                }
                                //B.this._update(C); //更新被更新者的绑定
                            }, newCon.argus.weights, [binder, BindersMessage, newCon]);
                        }
                    }
                }
                /*this*/
            };
    function _publics(opction){
        for (var fn in _publics.prototype) {
            this[fn] = function(){
                var args = [_publics.privates],i = 0;
                for ( ; i < arguments.length; i+=1) {
                    args[i+1] = arguments[i];
                };
                _publics.prototype[fn].apply(this,args)
            }
        };
    };
    _publics.prototype = {
                info: "binders", //绑定器标实
                init: function (privates) {
                    if (!(data.info && data.info === "binders")) {
                        switch (type) {
                            case "string":
                                this.set = privates._sin_set;
                                break;
                            case "number":
                                this.set = privates._sin_set;
                                break;
                            case "boolean":
                                this.set = privates._sin_set;
                                break;
                            case "object":
                                this.set = privates._obj_set;
                                if (data.tagName) {//如果是HTML元素
                                    data.info = "view-binders";
                                    data.set = publics.set;
                                    data.get = publics.get;
                                    data.binding = publics.binding;
                                    data.monitor = publics.monitor;
                                    data.twoway = publics.twoway;
                                    data.Binder = publics;
                                }
                                break;
                            case "function":
                                this.set = privates._fn_set;
                                break;

                            default:
                                this.set = privates._sin_set;
                                break;
                        }
                    }
                    return this;
                },
                // set: privates._sin_set,
                get: function (privates) {
                    var result = privates._content;
                    if (privates._type === "function") {
                        if (arguments.length === 0) {
                            if (privates._key.length !== 0) {
                                arguments = privates._key;
                                result = result.apply(privates._content, arguments);
                            }
                            else {
                                result = result.call(privates._content);
                            }
                        } else {
                            result = result.apply(privates._content, arguments);
                        }
                    } else {
                        if (privates._type === "object") {
                            result = result[privates._key];
                        }
                        if (arguments.length) {
                            var con = arguments[0];
                            if (con !== null) {
                                var contype = (typeof con).toLowerCase();
                                if (privates._type === "object" && (contype === "number" || contype === "string")) {//返回索取的字符
                                    result = privates._content[con];
                                } else {
                                    if (!con[0]) {//返回默认的关键字内容
                                        result = privates._content[privates._key];
                                    } else {//获取复合对象
                                        try {
                                            var Length = con.length;
                                            result = {};
                                            for (var i = 0; i < Length; ++i) {
                                                result[con[i]] = privates._content[con[i]];
                                            }
                                        }
                                        catch (e) {
                                            console.log("get error:" + e);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return result;
                },
                binding: function (privates,obj, key, config) {//单向绑定//绑定器对象或者函数，[绑定关键字]，[绑定·配置]
                    var bindkey = key || null;
                    if ((typeof bindkey).toLowerCase() === "object" && bindkey && (!bindkey.length)) {//不是null且不是数组
                        config = key;
                        bindkey = null;
                    }
                    config = config || { updateKey: null, weights: 0, forceUpdate: false, compromise: false };
                    var binderobj;
                    if (!obj.info) {//如果绑定对象不是绑定器
                        binderobj = Binder(obj);
                    } else if (obj.info === "binders") {
                        binderobj = obj;
                    } else if (obj.info === "view-binders") {
                        binderobj = obj.Binder;
                    }
                    var BindersMessage = {
                        id: binderobj.id,
                        key: bindkey,
                        type: "binding",
                        updateKey: config["updateKey"] || null,
                        Environment: publics, //上下文作用域
                        binder: obj,
                        weights: config["weights"] || 0, //更新的权值
                        forceUpdate: config["forceUpdate"] || false, //是否强制更新
                        compromise: config["compromise"] || false//权限相等时是否妥协更新，默认 不妥协
                    }
                    privates._binders[binderobj.id] = BindersMessage;
                    privates._bindersId += binderobj.id + "|";
                },
                monitor: function (privates,obj, updateKey, config) {//单向监听
                    var monitorkey = updateKey || null;
                    if ((typeof monitorkey).toLowerCase() === "object" && monitorkey && (!monitorkey.length)) {//不是null且不是数组
                        config = updateKey;
                        monitorkey = null;
                    }
                    config = config || { key: null, weights: 0, forceUpdate: false, compromise: false };
                    var monitorobj;
                    if (!obj.info) {//如果监听对象不是绑定器
                        monitorobj = allBinders[Binder(obj).id];
                    } else if (obj.info === "binders") {
                        monitorobj = allBinders[obj.id];
                    } else if (obj.info === "view-binders") {
                        monitorobj = allBinders[obj.Binder.id];
                    }
                    var BindersMessage = {
                        id: publics.id,
                        type: "monitor",
                        key: config["key"] || null,
                        updateKey: monitorkey,
                        Environment: monitorobj.publics, //上下文作用域
                        weights: config["weights"] || 0, //更新的权值
                        forceUpdate: config["forceUpdate"] || false, //是否强制更新
                        compromise: config["compromise"] || false//权限相等时是否妥协更新，默认 不妥协
                    }
                    //monitorobj.binding(publics, BindersMessage);
                    monitorobj.privates._binders[publics.id] = BindersMessage;
                    monitorobj.privates._bindersId += publics.id + "|";
                },
                twoway: function (privates) {//双向绑定

                },
                destory: function (privates) {
                    var i;
                    delete allBinders[this.id];
                    for (var i in privates) {
                        delete privates[i];
                    };
                    for (var i in this) {
                        delete this[i];
                    };
                }
                /*privates*/
            };
    var Binder = function (opction) {//生成绑定器
        var type = Tools.GetType(opction.content);
        $$id += 1; //计数器
            console.log(privates)
            var privates = new _privates({
                content: opction.content,
                type: type,
                key: opction.key||defaultKey[type]||defaultKey['other'], //可选，object对象的更新关键字,主要用于HTML对象的绑定
                computer : opction.computer,//可选，更新数据的计算方法，如果使用此方法，将默认调用，如果调用失败，则执行关键字更新
                binders: [], //存储绑定信息
                bindersId: "|", //以字符串的形式存储绑定着ID
            }),
            publics = new _publics({
                id: $$id,
                privates:privates,
            })
            try//绑定仓库，用于统一管理绑定元素
    		{
                //this.allBinders[this.$$id] = $$;
                allBinders[$$id] = {//存储绑定器
                    privates: privates,
                    publics: publics
                }; 
            }
            catch (e) {
                //allBinders = [$$];
                throw e;
            }
            return publics.init();
    };
    G.Binder = Binder;
})(global);
;
// (function (G,undinefed) {
//     if (Object.prototype.toString.call(G) !== "[object global]") {
//         throw new Error("global error:your global is "+Object.prototype.toString.call(G));
//     };
//     function publics (){

//     };
//     //共有接口-public
//     publics.prototype = {
//         _info: "binders", //绑定器标实
//         _v:"0.2",
//         get: function (key) {
//             if (key) {
//                 return this._content[key];
//             };
//             return this._content;
//         },
//         binding: function (obj, opction) {//单向绑定//绑定器对象或者函数，[绑定关键字]，[绑定·配置]
//         },
//         monitor: function (obj, opction) {//单向监听
//         },
//         twoway: function (obj,opction) {//双向绑定
//         },
//         destory:function (argument) {
//         }
//         /*privates*/
//     };
//     //对象生成器
//     function binderObject(opction){
//         var __proto__ = function(){};
//         __proto__.prototype = this;

//         switch (opction.type) {
//             case 'string':;
//             case 'number':;
//             case 'boolean':
//                 __proto__.prototype.toString = function(){return this._content.toString();};
//                 __proto__.prototype.valueOf = function(){return this._content.valueOf()};
//             default:
//                 __proto__.prototype._content = opction.content;
//                 __proto__.prototype._computer = opction.computer;
//                 __proto__.prototype._type = opction.type;
//                 __proto__.prototype._key = opction.key;
//                 break;
//         };
//         return new __proto__;
//     };
//     binderObject.prototype = new publics;
//     binderObject.prototype.destory = function(){
//         for (var i in this) {
//             delete this[i];
//         };
//     };

//     function Binder (opction) {
//         var content = opction.content,
//             key = opction.key,//可选，object对象的更新关键字,主要用于HTML对象的绑定
//             computer = opction.computer,//可选，更新数据的计算方法，如果使用此方法，将默认调用，如果调用失败，则执行关键字更新
//             type = opction.type = Tools.GetType(opction.content);

//         if (!key) {
//             opction.key = defaultKey[type]||defaultKey['other'];
//         };
//         // switch (type) {
//         //     case 'string':;
//         //     case 'number':;
//         //     case 'boolean':
//         //         var single = function(){};
//         //         single.prototype = new binderObject(opction);
//         //         single.prototype.toString = function(){return this._content.toString();};
//         //         single.prototype.valueOf = function(){return this._content.valueOf()};
//         //         return new single;
//         //         break;
//         //     default:
//         //         return new binderObject(opction);
//         //         break;
//         // };
//         return new binderObject(opction);
//     };
//     this.B = Binder;
// })(global);
////RUN


var test = Binder({content:"hello word"});
var test2 = Binder({content:"???"});
var test3 = Binder({content:"???"});
console.log(test2)
// test.binding(test2);
// test.set("?????");
// console.log(test2.get());
// Tools.TimeOut(function () {
//     console.log(test2.get());
// }, 10);

// var t1 = B({
//     content:"hehehe"
// });
// console.log(t1.toString());
// console.log(t1.__proto__);
// var obj = {
//     a:'a',
//     b:'b'
// };
// var t2 = B({
//     content:obj
// });
// console.log(t2.get());
// console.log(t2.__proto__);
