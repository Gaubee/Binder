var Tools = {
	destory:function (argument) {
		for (var i in this) {
			delete this[i];
		};
		var self = this;
		setTimeout(function(){
			self = null;
		},0)
	},
	a:"a",
	c:{
		a:"c"
	}
}
console.log(Tools);
Tools.destory();
console.log(Tools);
