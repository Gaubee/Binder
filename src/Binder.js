var Tools = require('./Tools.js');

var defaultKey = require('./defaultKey.js');


//value||innerHTML||innerText||attrsName...
(function (G,undinefed) {//constructor
    var $$,$$id = 0,allBinders = [];
    // G.AB = allBinders;
    function _privates(opction){
        for (var i in opction) {
            this['_'+i] = opction[i];
        };
    };
    var _publicsBase = function(opction){
        if (opction) {
            var self = this,fn,privates = opction.privates,constructor = arguments.callee;
            for (fn in constructor.prototype) {
                if (typeof constructor.prototype[fn] === "function") {
                    (function (proto_fn) {
                        self[proto_fn] = function(){
                            var args = [privates],i = 0;
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
                            var args = [privates],i = 0;
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
                    var i;
                    delete allBinders[privates._id];
                    for (i in privates) {
                        delete privates[i];
                    };
                    for (i in this) {
                        delete this[i];
                    };
                    delete opction;
                    return true;
                }catch(e){
                    throw e;
                    return false;
                }
            };
            self.getId = function(){//read only
                return opction.privates._id;
            }
        };
    };
    //var _publicsSimple,_publicsObject,_publicsFunction,_publicsArray;
    eval(_publicsBase.toString().replace('function','function _publicsSimple')+
         _publicsBase.toString().replace('function','function _publicsObject')+
         _publicsBase.toString().replace('function','function _publicsFunction')+
         _publicsBase.toString().replace('function','function _publicsArray'));

    _privates.prototype = {
                _update: function (con) {//更新
                    //con:guarantor:int(更新发起者),participants:string/*|int|int*/(已参与者),updateKeys:string[]//被更新的关键字,argus:object(附带参数)
                    var BindersID = this._bindersId.split('|'),
                        BinderMessages = this._binder_messages,
                        i,
                        Length,
                        binder_id,
                        binder,

                        binder_messages,
                        per_binder_message,
                        j,
                        binder_messages_length,

                        binder_keys,
                        per_binder_key,
                        k,
                        binder_key_length,
                        _con = {
                            guarantor:con.guarantor,
                            participants:'',
                            updateKeys:[]
                        };

                    con.participants = con.participants + this._id+'|'; //将自身写入参与者id
                    //注意要实现自身绑定更新
                    _con.participants = con.participants;

                    for (i = 1,Length = BindersID.length; i < Length; ++i) {
                        try{
                            binder_id = parseInt(BindersID[i]);
                            if (binder_id.toString() === "NaN") {
                                break;
                            }
                            binder = allBinders[binder_id];
                            if (!binder) {//binder 已经被销毁不存在
                                delete BinderMessages[binder_id];
                                break;
                            };
                            binder_messages = BinderMessages[binder_id];//一个id有多个绑定信息，用于绑定不同关键字、不同权重的不同更新方式
                            for (j = 0,binder_messages_length = binder_messages.length; j < binder_messages_length; j +=1) {
                                per_binder_message = binder_messages[j];//一条绑定信息有多个监听关键字(binderKey)，应发起相应的连锁更新
                                
                                binder_keys = per_binder_message.bindKeys;//某条绑定信息的关键字(自变亮)
                                binder_key_length = binder_keys.length;
                                for ( k = 0; k < binder_keys.length; k = k+1) {
                                    per_binder_key = binder_keys[k];
                                    if (Tools.ArrayIndexOf(con.updateKeys,per_binder_key) !== -1) {//更新的关键字(由_set函数返回，表示本次改变的关键字集合)是否在绑定关键字队列中
                                        _con.updateKeys[_con.updateKeys.length] = per_binder_key;
                                    };
                                }
                                if (con.participants.indexOf('|' + binder_id + '|') === -1||per_binder_message.weight<this._weight||((per_binder_message.weight === this._weight)&&per_binder_message.compromise)||per_binder_message.forceUpdate) {
                                    //不重复更新，除非配置信息为妥协更新（被更新着妥协）或者强制更新
                                    Tools.TimeOut(function (BM, C) {
                                        var _super,
                                            binder = allBinders[BM.binder].publics,
                                            self = allBinders[BM['environment']].publics,
                                            updateKeys;

                                        _super = self._super;
                                        self._super = function(objORval){
                                            updateKeys = binder._set(objORval);
                                        };
                                        BM.relationship.call(self,binder,BM)
                                        if (_super === undinefed ) {
                                            delete binder._super;
                                            delete _super;
                                        }else{
                                            self._super = _super;
                                        };
                                        //链式更新
                                        allBinders[binder.getId()].privates._update({
                                            guarantor:con.guarantor,
                                            participants:con.participants,
                                            updateKeys:updateKeys 
                                        })
                                    }, per_binder_message.synUpdate&&per_binder_message.weight, [per_binder_message, _con]);
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
                        console.log(this.getId())
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
        key:function(privates,k){
            if (arguments.length===1) {
                return privates._key;
            }else{
                try{
                    privates._key = k+"";//to String
                }catch(e){
                    throw new Error("Key Error"+e.message);
                }
            }
        },
        binding: function (privates,opction) {//单向绑定,自变量//绑定器对象或者函数，[绑定关键字]，[绑定·配置]
            if(opction.Binder.info!==this.info){
                throw new Error("Binder error : object must be a Binder-object");
                return false;
            }
            var binder_id = opction.Binder.getId(),bindKeys = opction['bindKeys'],updateKey = opction['updateKey'];
            if(typeof bindKeys !== "object"){
                bindKeys = [bindKeys+""];//toString && toArray 
            }
            // if(typeof updateKey !== "object"){
            //     updateKey = [updateKey+""];//toString && toArray 
            // }
            var BindersMessage = {
                binder: binder_id,
                environment: this.getId(), //上下文作用域
                bindKeys: bindKeys || [allBinders[this.getId()].privates._key],//多个
                updateKey: updateKey+'' || allBinders[binder_id].privates._key,//一个
                relationship:opction['relationship']||function(binder,BindersMessage){//call by publics
                        var updateObject = {};//带路由信息的set
                        updateObject[BindersMessage.updateKey] = this.get(BindersMessage.bindKey);
                        this._super(updateObject);
                    },
                type: "binding",
                synUpdate:!!opction['asynUpdate'], //是同步更新，默认为 异步
                weight: this.weight(opction,opction["weight"]) || 50, //此绑定路由的权重
                forceUpdate: !!opction["forceUpdate"], //是否强制更新
                compromise: !!opction["compromise"],//权重相等时是否妥协更新，默认 不妥协
            }
            privates._binder_messages[binder_id] = [BindersMessage];
            privates._bindersId += binder_id + "|";
        },
        removeBinding:function(){},
        monitor: function (privates,obj, updateKey, config) {//单向监听，因变量e
        },
        removeMonitor:function(){},
        twoway: function (privates,binder) {//双向绑定

            return false;
        },
        removeTwoway:function(privates,binder){},
        replace:function(privates,newBinder){//继承私有，即绑定信息集
            var id = this.getId(),
                newBinderId = newBinder.getId(),
                newBinderPrivates,
                newBinderContent,
                newBinderKey,
                i;
            newBinderPrivates = allBinders[newBinder.getId()].privates;
            newBinderContent = newBinderPrivates._content;
            newBinderKey = newBinderPrivates._key;
            for (i in privates) {
                newBinderPrivates[i] = privates[i];
            };
            newBinderPrivates._content = newBinderContent;
            newBinderPrivates._key = newBinderKey;
            this.destory();
            allBinders[id] = allBinders[newBinderId];
            delete allBinders[newBinderId];
            return newBinder;
        },
        brother:function(privates,brotherBinder){//共享绑定信息集,通过原型继承共享

        }
    };
    _publicsSimple.prototype = new _publicsBase;
    _publicsSimple.prototype._set = function(privates,val) {
        try{
            privates._content = G[privates._type](val);
        }catch(e){
            throw new Error("Set Error:"+e.message);
        }
        return [privates._key];
    }
    _publicsSimple.prototype.set = function(privates,val) {
        var updateKeys;
        if (arguments.length !== 1) {
            updateKeys = this._set(val);
        }
        //更新绑定对象
        privates._update({
            guarantor:privates._id,
            participants:"|",
            updateKeys:updateKeys
        });
        return this;
    };
    _publicsSimple.prototype.get = function (privates) {

        return privates._content;
    };
    // _publicsSimple.prototype.extend = function(privates,obj){};

    _publicsObject.prototype = new _publicsBase;
    _publicsObject.prototype._set = function(privates,obj) {
        var content = privates._content;
        if (typeof obj === 'object') {
            return Tools.noExtendSet(content,obj);
        }else{
            content[privates._key] = G(Tools.GetType(content[privates._key]))(obj);
            return [privates._key];
        };
    }
    _publicsObject.prototype.set = function(privates,obj){
        //只更新有存在的关键字，要拓展对象必须通过extended方法
        var updateKeys;
        if (arguments.length !== 1) {
            updateKeys = this._set(obj);
        };
        privates._update({
            guarantor:privates._id,
            participants:"|",
            updateKeys:updateKeys
        });
        return this;
    };
    _publicsObject.prototype.get = function (privates,key) {
        var result = privates._content,i,keyLength;
        key = key||privates._key;
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
    _publicsObject.prototype.extend = function(privates,obj){
        var content = privates._content,i;
        for (i in obj) {
            if (!(i in content)) {
                content[i] = obj;
            };
        };
    };

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
console.log(test.weight());
console.log(test.get("split"));
// console.log(test.destory());
// console.log(test);

var test2 = Binder({
    content:{name:"???"},//object 类型必须符合json格式，不循环引用
    key:'name'
});


test.binding({
    Binder:test2,
    // updateKey:'name',
    // bindKeys:[""]
    synUpdate:true//同步更新，默认为 异步
});

test.set("okok")
console.log(test2.get('name'));

var test3 = Binder({
    content:{name:"???"},//object 类型必须符合json格式，不循环引用
});
test2.replace(test3);
test3.key("name")
console.log(test3.get());
test.set()//just updete
console.log(test3.get());

var test4 = Binder({
    content:{
        firstName:"Gaubee",
        lastName:"Bangeel",
        fullName:""
    },//object 类型必须符合json格式，不循环引用
});
test4.binding({
    Binder:test4,
    updateKey:['fullName'],

})