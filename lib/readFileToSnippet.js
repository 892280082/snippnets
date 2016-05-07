var yqfs = require('yqfs');
var then = require('yqthen');
var nodePath = require('path');
var _ = require('underscore');

function Snippet(param){
	this.fileName = param.fileName;
	this.trigger = param.trigger;
	this.description = param.description;
	this.scope = param.scope;
	this.code = param.code;
};

var getValue = (lines)=>{
	return  lines.shift().split(':')[1].trim();
};

var subLineToPojo = (lines,path)=>{
	var trigger = getValue(lines);
	var description = getValue(lines);
	var scope = getValue(lines);
	lines.shift();
	return new Snippet({
		fileName:path,
		trigger:trigger,
		description:description,
		scope:scope,
		code:lines
	});
};

/**
@param path {String} 文件名
@param lines {[[String]]} 数组
*/
var linesArrayToSnippets = (path,lines)=>{
	var snippets = [];

	_.each(lines, function(value){
			snippets.push(subLineToPojo(value,path));
	});

	return snippets;
};



/**
@param file {String} -文件路径
@param callback {Function} -call(err,Snippet)
*/

var dealFile = (path,callback)=>{
	yqfs.readFileByLine(path,(err,lines)=>{
		if(err)
			callback(err);
		
		lines = _.reject(lines, function(value){ //第一步去掉注释
			return  value.indexOf('#') === 0;
		});

		
		lines = _.reduce(lines, function(memo, value){ //10个=号 做为分隔符
			var arrays = _.last(memo);
			if(value.indexOf('==========') > -1){
				memo.push([]);
			}else{
			    arrays.push(value);				
			}
			return memo;
		}, [[]]); 

		if(lines[lines.length-1].length === 0)
			lines.pop();

		lines = linesArrayToSnippets(path,lines);

		callback(null,lines);

	});
};

module.exports = dealFile;

// var t = '#注释var yqfs = require(\'yqfs\');';

// console.log(t.indexOf('#'));

