var fs = require('fs');
var node_path = require('path');


/**
*@desc 异步递归查询文件下的所有文件
*@_path {String} -路径
*@_callback {Function} -回调函数 callback(err,files)  `files`文件名
*/
var asyncRecurSearchDir = function(_path,_callback){

    var dirs = [];
    dirs.push(_path);
    /**
     * 处理某个类目下所有文件及目录
     * @param files 文件。也可能是目录
     * @param file_path 文件或目录的上级目录
     * @param callback 一个目录或文件的判断结果的回调
     * @param allFilesDoneCallback 所有文件处理完成后的回调函数
     */
    function forFiles(files, file_path,callback,allFilesDoneCallback) {
        var arrlength=files.length;
        if(!files||files.length==0){
            allFilesDoneCallback(file_path);
            return;

        }
        files.forEach(function (e, i) {
            var fullFilePath = node_path.join(file_path,e);

            fs.stat(fullFilePath, function (err, stat) {
                var result={
                    isDir:false,
                    isFile:true,
                    file:fullFilePath
                };

                if (stat.isDirectory()) {
                    result.isDir=true;
                    result.isFile=false;
                }else{
                    result.isDir=false;
                    result.isFile=true;
                }
                //回调
                callback(result);
                arrlength--;
                //判断是否处理完毕
                if(arrlength==0){
                    //回调所有文件处理完毕
                    allFilesDoneCallback(file_path);
                }
            });
        });


    }

    /**
     * 处理单个目录
     * @param dirPath 目录路径
     * @param watchDir 监控的目录列表
     * @param callback 当目录处理完毕后的回调函数
     */
    function forDir(dirPath,watchDir,callback){
        fs.readdir(dirPath, function (err, files) {
            var subFiles=[];
            forFiles(files,dirPath,function(result){
                //如果是目录，继续执行forDir并在之前将目录添加到watchDir
                //如果是文件，放入subFiles中
                if(result.isDir){
                    watchDir.push(result.file);
                    forDir(result.file,watchDir,callback);
                }else{
                    subFiles.push(result.file);
                }
            },function(processedDirPath){//文件全部处理完毕后，执行回调函数通知指定目录遍历完毕，但不包括子目录
                callback(processedDirPath,subFiles);
            });
        });
    }

    /**
     * 遍历处理多个类目
     * @param dirs 多个类目列表
     * @param doneCallback 处理完成的回调
     */
    function forDirs(dirs,doneCallback) {
        var copiedDirs=dirs.slice(0);
        var watchDir=[];
        var allFiles=[];
        copiedDirs.forEach(function(path){
            watchDir.push(path);
            //回调函数中判断watchDir长度是否为0，如为0，表示所有的目录及其子目录处理完毕了，通知最外层处理完毕
            //并将返回的文件信息合并
            forDir(path,watchDir,function(processedDirPath,subFiles){
                allFiles=allFiles.concat(subFiles);
                watchDir.splice(watchDir.indexOf(processedDirPath),1);
                if(watchDir.length==0){
                    doneCallback(allFiles);
                }
            });
        })
    }

    forDirs(dirs,function(fileList){
        _callback(null,fileList);
    });

};

module.exports = asyncRecurSearchDir;
