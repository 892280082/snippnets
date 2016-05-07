/**
@desc 按行读取文件，返回行数组
*/
var lineReader = require('line-reader');
var fs  = require('fs');
var path = require('path');





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
function readLine(reader,callback,allLines){
	allLines = allLines || [];
	if(reader.hasNextLine()){

		reader.nextLine((err,line)=>{
			if(err)
				return callback(err);

			allLines.push(line);
			readLine(reader,callback,allLines)
		});

	}else{
		callback(null,allLines);		
	}

}

var readFileByLine = (_path,callback)=>{

	lineReader.open(_path,function(err, reader) {
	  if(err)
	  	return callback(err);

	  if (reader.hasNextLine()) {
	  		readLine(reader,(err,allLines)=>{
	  			callback(err,allLines);
	  		});
	  }else {
	    reader.close(function(err) {
	    	return callback(err,[]);
	    });
	  }
	});

};

exports.readFileByLine = readFileByLine;


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
exports.linesToFile = (_path,lines,callback,option)=>{
	if(!(lines instanceof Array))
		lines = [lines];

	option = option || {};
	option.encoding = option.encoding || "utf-8";

	var data = "";

	lines.forEach((lin)=>{
		data += lin +'\n';
	});

	fs.writeFile(_path,data,option,(err)=>{
		callback(err);
	});
};

