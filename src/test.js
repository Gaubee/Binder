// var a = {s:'function'};
// var json={
//     uiModule:'str',
//     login:true,
//     taglist:[
//         {'tagName':'xiaoc','applyItemCount':20},
//         {'tagName':'xiaoc','applyItemCount':20}
//     ],
//     fn:function function_name (argument) {
//     	// body...
//     },
//     a:a
// }
 
// var s=JSON.stringify(json,function(key, val) {
// 	  if (typeof val === 'function') {
// 	    return val + '';
// 	  }
// 	  return val;
// 	}
// )

// console.log(s)
// var res	= JSON.parse(s,function(k,v){
// 	var result;
// 	if(v.indexOf&&v.indexOf('function')>-1){
// 		try{
// 			result= eval("(function(){return "+v+" })()");
// 			return result;
// 		}catch(e){}
// 	}
// 	return v;
 
// });
// console.log(res);
// console.log(json.fn+"")
console.log(["as","cs","ps"].indexOf("cs"))

//todo:
返回更新关键字
关键字判定更新