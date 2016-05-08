var yqfs = require('yqfs');
var then = require('yqthen');
var nodePath = require('path');
var _ = require('underscore');


var writeSnippetToFile = (_targetPath,snippet,callback)=>{
	var lines = [];
	var _fileName;

	var targetFileName = _fileName =  nodePath.basename(snippet.fileName,'.orisnippet');
	targetFileName += '_'+snippet.trigger+_.random(1000,9999)+'.sublime-snippet';
	targetFileName = nodePath.join(_targetPath,targetFileName);

	lines.push('<snippet>');
	lines.push('	<content><![CDATA[');
	lines = lines.concat(snippet.code);
	lines.push(']]></content>');
	lines.push('<tabTrigger>'+ snippet.trigger +'</tabTrigger>');
	lines.push('<scope>'+ snippet.scope +'</scope>');
	lines.push('<description>'+ _fileName+'_'+snippet.description +'</description>');
	lines.push('</snippet>');


	yqfs.linesToFile(targetFileName,lines,(err)=>{
		callback(err);
	});

};

module.exports = writeSnippetToFile;