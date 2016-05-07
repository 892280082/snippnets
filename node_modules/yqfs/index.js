var dir = require('./src/fsdir');
var file = require('./src/fsfile');

var out = {};

var setProperty = (out,obj)=>{
	for(var p in obj){
		if(!out[p]){
			out[p] = obj[p];
		}else{
			throw '属性名称冲突了';			
		}
	}
};

setProperty(out,dir);
setProperty(out,file);

module.exports = out;
