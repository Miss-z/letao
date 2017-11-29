//关闭进度环
NProgress.configure({
    showSpinner: false
})
$(document).ajaxStart(function(){
    //开始进度条
    NProgress.start();

});

$(document).ajaxStop(function(){
    
    //结束进度条
    setTimeout(function(){
        NProgress.done();
    },500);
   
});
// 进度条模块结束 




