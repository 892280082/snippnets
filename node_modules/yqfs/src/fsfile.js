/**
*@description 文件操作
*@auther yq
*@date 2016-5-5
@API
1.fileExists					判断文件是否存在
2.readFileByLine				按行读取文件,返回行数组
3.linesToFile					行数组转成文件


*/
var fs = require('fs');
var then = require('yqthen');
var path = require('path');
var readLine = require('../lib/readLine');


/** 和dirExists 用法一致*/
exports.fileExists = (path,callback)=>{
	fs.exists(path,(result)=>{
		if(!result)
			return callback(null,false);
		fs.lstat(path,(err,state)=>{
			if(err)
				return next(err);
			if(!state.isDirectory()){
				return callback(null,true);
			}
			callback(null,false);
		});
	});
};

/**
Example
readFileByLine(path.join(__dirname,'file.txt'),(err,lines)=>{
	console.log(err,lines.length);
});

@description 按行读取文件，异步
@param _path {String}  -路径名
@param callback {Function} -回调函数 -call(err,lines); 
`lines` 文件的行数组
*/
exports.readFileByLine = readLine.readFileByLine;

/**
Example
linesToFile('./test.text','hello js',function(err){},{encoding:utf-8})

@desc 行数组转成文件
@param _path {String} -路径
@param lines {String|[String]}  -行内容
@param callback {Function} -回调函数
@param option {Object?} 默认utf-8
call(err)
*/
exports.linesToFile = readLine.linesToFile;