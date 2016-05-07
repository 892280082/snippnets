var yqfs = require('yqfs');
var then = require('yqthen');
var nodePath = require('path');
var _ = require('underscore');
var readFileToSnippet = require('./readFileToSnippet');
var writeSnippetToFile = require('./writeSnippetToFile');


var debug = true;
console.$log = function(){
	var args = Array.prototype.slice.call(arguments);
	args.unshift('LOG-->');
	if(debug){
		console.log.apply(console,args);
	}
};

var ORISNIPPET = '.orisnippet'; //用户编写文件后缀名
var srcPath = nodePath.join(__dirname,'../src'); //src 目录
var nodeModulePath = nodePath.join(__dirname,'../node_modules'); //node_module 目录
var runtimePath = nodePath.join(__dirname,'../runtime');// runtime 目录


var allFiles = []; //用户处理的所有文件
var allSnippetData = []; //所有的数据对象 


then((next)=>{ //查询 node_module目录
	yqfs.getDirRecurFiles(nodeModulePath,(err,files)=>{
		allFiles = allFiles.concat(files);
		console.$log('1.查询 node_module目录');
		next(err);
	});
})
.then((next)=>{ //查询 src目录
	yqfs.getDirRecurFiles(srcPath,(err,files)=>{
		allFiles = allFiles.concat(files);
		console.$log('2.查询 查询 src目录');
		next(err);
	});
})
.then((next)=>{ //查看编译目录,删除编译目录下的所有文件
	yqfs.checkAndCreateDir(runtimePath,(err,is)=>{
		if(err)
			return next(err);
		if(is){
			yqfs.removeDirAllFile(runtimePath,(err)=>{
				console.$log('3.查看编译目录,删除编译目录下的所有文件');
				next(err);
			});
		}else{
			next(err);
		}
	});
})
.then((next)=>{
	allFiles = _.filter(allFiles, function(file){
		return nodePath.extname(file) === ORISNIPPET;
	});
	if(allFiles.length === 0)
		return next('WARNING:未设置snippet');

	next(null,allFiles);
})
.each((next,_file)=>{
	readFileToSnippet(_file,(err,snippets)=>{
		allSnippetData = allSnippetData.concat(snippets);
		next();
	});
})
.then((next)=>{
	console.$log('4.编译.orisnippet文件');
	if(allSnippetData.length === 0){
		next('WARNING:未设置snippet');
	}else{
		next(null,allSnippetData);
	}
})
.each((next,snippet)=>{
	writeSnippetToFile(runtimePath,snippet,(err)=>{
		next(err);
	});
})
.then((next)=>{
    console.$log('5.向runtime文件写入snippet文件');
	console.$log('生成代码片段数:'+allSnippetData.length);
})
.fail((next,err)=>{
	console.log("curse ERROR:",err);
});

/**
*@desction
*@auther
*@date 
*/

