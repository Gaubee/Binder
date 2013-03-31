var Tools = require('./Tools.js');

var defaultKey = require('./defaultKey.js');


//value||innerHTML||innerText||attrsName...
(function (G,undinefed) {//constructor
    var $$,$$id = 0,allBinders = [];
    function _privates(opction){
        for (var i in opction) {
            this['_'+i] = opction[i];
        };
    };
    var _publicsBase = function(opction){
        if (opction) {
            var self = this,fn;
            var constructor = arguments.callee;
            for (fn in constructor.prototype) {
                if (typeof constructor.prototype[fn] === "function") {
                    (function (proto_fn) {
                        self[proto_fn] = function(){
                            var args = [opction.privates],i = 0;
                            for ( ; i < arguments.length; i+=1) {
                                args[i+1] = arguments[i];
                            };
                            return constructor.prototype[proto_fn].apply(this,args);
                        }
                    })(fn);
                };
            }
            for(fn in _publicsBase.prototype){
                if (typeof _publicsBase.prototype[fn] === "function") {
                    (function (proto_fn) {
                        self[proto_fn] = function(){
                            var args = [opction.privates],i = 0;
                            for ( ; i < arguments.length; i+=1) {
                                args[i+1] = arguments[i];
                            };
                            return _publicsBase.prototype[proto_fn].apply(this,args);
                        }
                    })(fn);
                };
            }
            self['destory'] = function () {
                try{
                    var i,privates = opction.privates;
                    delete allBinders[this.id];
                    for (var i in privates) {
                        delete privates[i];
                    };
                    for (var i in this) {
                        delete this[i];
                    };
                    delete opction;
                    return true;
                }catch(e){
                    throw e;
                    return false;
                }
            };
            self['id'] = opction['id']
        };
    };
    //var _publicsSimple,_publicsObject,_publicsFunction,_publicsArray;
    eval(_publicsBase.toString().replace('function','function _publicsSimple')+
         _publicsBase.toString().replace('function','function _publicsObject')+
         _publicsBase.toString().replace('function','function _publicsFunction')+
         _publicsBase.toString().replace('function','function _publicsArray'));

    _privates.prototype = {
                _update: function (con) {//更新
                    //con:guarantor:int(更新发起者),participants:string/*|int|int*/(已参与者),argus:object(附带参数)
                    var BindersID = this._bindersId.split('|'),BinderMessages = this._binder_messages,i,Length
                                    ,binder_id,binder,binder_messages,per_binder_message,j,binder_messages_length;

                    con.participants = con.participants + this._id+'|'; //将自身写入参与者id

                    for (i = 1,Length = BindersID.length; i < Length; ++i) {
                        try{
                            binder_id = parseInt(BindersID[i]);
                            if (binder_id.toString() === "NaN") {
                                break;
                            }
                            binder = allBinders[binder_id];
                            binder_messages = BinderMessages[binder_id];
                            for (j = 0,binder_messages_length = binder_messages.length; j < binder_messages_length; j +=1) {
                                per_binder_message = binder_messages[j];
                                if (con.participants.indexOf('|' + binder_id + '|') === -1||per_binder_message.weight<this._weight||((per_binder_message.weight === this._weight)&&per_binder_message.compromise)||per_binder_message.forceUpdate) {
                                    //不重复更新，除非配置信息为妥协更新（被更新着妥协）或者强制更新
                                    var newCon = {
                                        guarantor: this._id,
                                        participants: con.participants,
                                        argus: per_binder_message,
                                    }
                                    Tools.TimeOut(function (BM, C) {
                                        var _super,binder = BM.binder,self = BM['environment'];
                                        _super = self._super;
                                        self._super = function(objORval){
                                            binder._set(objORval);
                                        };
                                        BM.relationship.call(self,binder,BM)
                                        if (_super === undinefed ) {
                                            delete binder._super;
                                            delete _super;
                                        }else{
                                            self._super = _super;
                                        };
                                    }, per_binder_message.synUpdate&&per_binder_message.weight, [per_binder_message, newCon]);
                                }
                            };
                        }catch(e){
                            throw new Error("Update Error:"+e.message);
                        }
                            
                    }
                }
                /*this*/
            };
    _publicsBase.prototype = {
        info: {"name":"binders"},
        weight: function (privates,w) {//1~200,int
            if (arguments.length === 1) {
                return privates._weight;
            }else{
                try{
                    var weight = parseInt(w);
                    if (isNaN(weight)) {
                        console.warn("weight is NaN.");
                        return false;
                    }else if(weight < 200){
                        console.warn("weight had better to smaller than 200.");
                    }else if (weight > 1) {
                        console.warn("weight must be larger than 0.");
                    }else{
                        privates.weight = weight;
                    };
                }catch(e){
                    throw new Error("Weight Error : "+e.message);
                    return false;
                }
            }
        },
        binding: function (privates,opction) {//单向绑定,自变量//绑定器对象或者函数，[绑定关键字]，[绑定·配置]
            if(opction.Binder.info!==this.info){
                throw new Error("Binder error : object must be a Binder-object");
                return false;
            }
            var BindersMessage = {
                id: opction.Binder.id,
                bindKey: opction['bindKey'] || allBinders[this.id].privates._key,
                updateKey: opction['updateKey'] || allBinders[opction.Binder.id].privates._key,
                relationship:opction['relationship']||function(binder,BindersMessage){//call by publics
                        var updateObject = {};//带路由信息的set
                        updateObject[BindersMessage.updateKey] = this.get(BindersMessage.bindKey);
                        this._super(updateObject);
                    },
                type: "binding",
                synUpdate:!!opction['asynUpdate'], //是同步更新，默认为 异步
                environment: this, //上下文作用域
                binder: opction.Binder,
                weight: this.weight(opction,opction["weight"]) || 50, //此绑定路由的权重
                forceUpdate: !!opction["forceUpdate"], //是否强制更新
                compromise: !!opction["compromise"],//权重相等时是否妥协更新，默认 不妥协
            }
            privates._binder_messages[opction.Binder.id] = [BindersMessage];
            privates._bindersId += opction.Binder.id + "|";
        },
        removeBinding:function(){},
        monitor: function (privates,obj, updateKey, config) {//单向监听，因变量e
        },
        removeMonitor:function(){},
        twoway: function (privates) {//双向绑定

            return false;
        },
        removeTwoway:function(){},
    };
    _publicsSimple.prototype = new _publicsBase;
    _publicsSimple.prototype._set = function(privates,val) {
        try{
            privates._content = G[privates._type](val);
        }catch(e){
            throw new Error("Set Error:"+e.message);
        }
        return this;
    }
    _publicsSimple.prototype.set = function(privates,val) {
        this._set(val);
        //更新绑定对象
        privates._update({
            guarantor:this.id,
            participants:"|",// + this.id + "|",
        });
        return this;
    };
    _publicsSimple.prototype.get = function (privates) {
        return privates._content;
    };
    // _publicsSimple.prototype.extend = function(privates,obj){};

    _publicsObject.prototype = new _publicsBase;
    _publicsObject.prototype._set = function(privates,obj) {
        var content = privates._content,i;
        for (i in obj) {
            if (i in content) {
                content[i] = obj[i];
            };
        };
        delete obj;
        return this;
    }
    _publicsObject.prototype.set = function(privates,obj){
        //只更新有存在的关键字，要拓展对象必须通过extended方法
        this._set(obj);
        privates._update({
            guarantor:this.id,
            participants:"|",// + this.id + "|",
        });
        return this;
    };
    _publicsObject.prototype.get = function (privates,key) {
        var result = privates._content,i,keyLength;
        if (typeof key === "string") {
            key = key.split(".");
            keyLength = key.length;
            for (i = 0; i < keyLength; i++) {
                try{
                    result = result[key[i]];
                }catch(e){
                    throw new Error("Get Error:"+e.message);
                }
            };
        }
        return result;
    };
    _publicsObject.prototype.extend = function(privates,obj){};

    _publicsFunction.prototype = new _publicsBase;
    _publicsFunction.prototype._set = function(privates,obj) {    }
    _publicsFunction.prototype.set = function(privates,val){};
    _publicsFunction.prototype.get = function(privates,key){};
    _publicsFunction.prototype.extend = function(privates,obj){};

    _publicsArray.prototype = new _publicsBase;
    _publicsArray.prototype._set = function(privates,obj) {    }
    _publicsArray.prototype.set = function(privates,val){};
    _publicsArray.prototype.get = function(privates,key){};
    _publicsArray.prototype.extend = function(privates,obj){};

    var Binder = function (opction) {//生成绑定器
        var type = Tools.GetType(opction.content);
        $$id += 1; //计数器
            var privates = new _privates({
                id:$$id,
                content: opction.content,
                type: type,
                key: opction.key||defaultKey[type]||defaultKey['other'], //可选，object对象的更新关键字,主要用于HTML对象的绑定
                computer : opction.computer,//可选，更新数据的计算方法，如果使用此方法，将默认调用，如果调用失败，则执行关键字更新
                weight : parseInt(opction.weight)||50,//默认权重为50，1为最大，0为无穷大，内部自己用
                binder_messages: [], //存储绑定信息
                bindersId: "|", //以字符串的形式存储绑定着ID
            }),publics;
            switch(Tools.GetType(opction.content)){
                case "String":;
                case "Number":;
                case "Boolean":
                    publics = new _publicsSimple({
                        id: $$id,
                        privates:privates,
                    });
                    break;
                case "Object":
                    publics = new _publicsObject({
                        id: $$id,
                        privates:privates,
                    });
                    break;
                case "Function":
                    publics = new _publicsFunction({
                        id: $$id,
                        privates:privates,
                    });
                    break;
                case "Array":
                    publics = new _publicsArray({
                        id: $$id,
                        privates:privates,
                    });
                    break;
            }
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
            return publics;
    };
    G.Binder = Binder;
})(global);


////RUN
console.log("RUN")
var test = Binder({content:"hello word"});
console.log(test);
console.log(test.weight());
console.log(test.get("split"));
// console.log(test.destory());
// console.log(test);

var test2 = Binder({
    content:{name:"???"},
    key:'name'
});


test.binding({
    Binder:test2,
    // updateKey:'name',
    synUpdate:true//同步更新，默认为 异步
});

test.set("okok")
console.log(test2.get('name'));

// {
//     id: opction.Binder.id,
//     bindKey: opction['bindKey'] || allBinders[this.id].privates._key,
//     updateKey: config['updateKey'] || allBinders[opction.Binder.id].privates._key,
//     relationship:config['relationship']||function(binder,BindersMessage){//call by publics
//             var updateObject = {};//带路由信息的set
//             updateObject[BindersMessage.updateKey] = this.get(BindersMessage.bindKey);
//             this.super(updateObject);
//         },
//     type: "binding",
//     environment: this, //上下文作用域
//     binder: opction.Binder,
//     weight: this.weight(opction,opction["weight"]) || 50, //此绑定路由的权重
//     forceUpdate: opction["forceUpdate"] || false, //是否强制更新
//     compromise: opction["compromise"] || false,//权重相等时是否妥协更新，默认 不妥协
// }
// var test3 = Binder({content:"???"});
// console.log(test2)

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
