# Binder.js 介绍 # 
_Model模块_
_____________________

## 版本号：v0.1.1 ##
  
  已经实现了对object类型和string、number、boolean类型的基本绑定功能
  并对HTML元素的绑定（View Model）进行初步的特殊设定，并且会进一步完善VM模块
  
  -----------------------
  
## 快速开始 ##
```javascript
var b = Binder("hello word");
```
## 基本操作 ##
```javascript
var b = Binder("Hello");
b.set("hi my lover");
b.get()  //Return"hi my lover"
```
## 绑定类型 ##
* _简单类型(Single type)_ [number、string、boolean]
* _复合对象(Object type)_
* _功能对象(Function type)_

```javascript
//[number、string、boolean]
var sin = Binder(23);
//Object
var obj = Binder({firstname:"Gaubee",lastname:"bangeel"});
//HTML Object
//bind model and it's key word for default update,and "value" is default currently
var firstname = Binder(document.getElementById("firstname"),"innerHTML");
//Function
var fullname = Binder(function(firstname,lastname){
 document.getElementById("fullname") = firstname.value
                                     + " "
                                     + lastname.value;
},[document.getElementById("firstname"),document.getElementById("firstname")]);
```
## 绑定操作 ##
* 直接绑定
* 监听绑定 _结构和功能未完善，建议直接使用 *直接绑定*_
* 双向绑定 _结构和功能还在设计中_

* 简单对象绑定

```javascript
var str1 = Binder("hello word");
var str2 = Binder("hi my love");
str1.binding(str2);
str1.set("you are mine");
str2.get();//still return "hi my love".Will not immediately change the binding is asynchronous,
setTimeout(function(){
 str2.get();//return "you are mine"
},10);
```
* 复合对象绑定:

```javascript
var firstname = Binder(document.getElementById("firstname"));
var lastname = Binder(document.getElementById("lastname"));
//if run ".get()",return document.getElementById("firstname").value,"value" is default key

//objbind-model,if firstname being changed,fullname will be changing too;
//@Binder obj,if not,conver defaultly;
//@[key word],string type,if not,it will take the key word when fitstname being init;
//@[config],{ updateKey: null, weights: 0, forceUpdate: 0, compromise: false },
 //forceUpdate Means whether mandatory update already exists, even if the update history(update route table)
 //【DANGER, WARNING】,it may be cause an infinite loop,and continuously updated
firstname.binding(document.getElementById("fullname"),{updateKey:["title","innerHTML"]});

//and for lastname
lastname.binding(document.getElementById("fullname"),{updateKey:["title","innerHTML"]});
//you could do that soon: 
 //fullname.monitorList([firstname,lastname],["title","innerHTML"]);
```
* 计算功能绑定:

```javascript
var fullname = Binder(function (n1,n2) {
          document.getElementById("fullname").innerHTML = n1.get() + " " + n2.get();
      }, [firstname,lastname]);
```
